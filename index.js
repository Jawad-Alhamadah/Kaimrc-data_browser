"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cmd_colors_1 = __importDefault(require("./cmd_libs/cmd_colors"));
const express_1 = __importDefault(require("express"));
let app = (0, express_1.default)();
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const body_parser_1 = __importDefault(require("body-parser"));
const { promises: fs } = require("fs");
let fsRename = util.promisify(fs.rename);
const fileiofunctions_1 = require("./lib/Typescript_modules/fileiofunctions");
const EmptySearchTermError_1 = require("./lib/Classes/ErrorClasses/EmptySearchTermError");
const RESPONSE_CODES = require("./lib/Typescript_modules/responseCodes");
var path = require('path');
const multer = require("multer");
let port = 5000;
let refNum = "";
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, path.join(__dirname, process.env.GENOME_DATA_FOLDER_UPLOAD));
    },
    filename: function (req, fileMetaData, cb) {
        // let filename = timestampFilename(file.originalname)
        let ext = fileMetaData.originalname.split('.')[1];
        let file = timestampFilename(`${process.env.VCF_FILENAME}.${ext}`);
        cb(null, file);
    }
});
let upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        let filetypesRegex = /txt|bam|bai|cram/;
        let extname = filetypesRegex.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(`Error: File upload only supports the following filetypes - ${filetypesRegex}`);
    }
}).single("myFile");
app.use(express_1.default.static(__dirname + "/public"));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', ["https://app.terra.bio", "https://localhost:8008", "https://localhost:5000", "https://*"]);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.json());
app.post('/download-file', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let terraUploadFoldername = process.env.UPLOAD_FOLDER_NAME_TERA || "uploads";
        let { execError, stdout, stderr } = yield exec(`${req.body.text} ./${terraUploadFoldername}`);
        let command = req.body.text;
        if (execError) {
            console.log(`error: ${execError.message}`);
            res.status(500).send("error while downloading the");
        }
        if (stderr) {
            let oldFile = getFilenameFromGSutil(command);
            let oldFilePath = path.join(path.join(__dirname, terraUploadFoldername), oldFile);
            let stampedFilename = timestampFilename(oldFile);
            let stampedFilePath = path.join(path.join(__dirname, terraUploadFoldername), stampedFilename);
            let renameError = yield fsRename(oldFilePath, stampedFilePath);
            if (renameError)
                throw renameError;
            // res.send('File Saved');   
        }
        // console.log(`stdout: ${stdout}`);
        res.status(200).send("response test");
    });
});
//this route handles uploading the VCF file to server, and then update the jason files to fit Gnomad
app.post("/upload_data", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //we start by getting the current VCF file
            let dir = path.join(__dirname, process.env.GENOME_DATA_FOLDER_UPLOAD);
            let files = yield (0, fileiofunctions_1.getFilenamesFromDir)(dir, res);
            let oldFilename = files.filter((file) => file.includes(process.env.VCF_FILENAME))[0];
            upload(req, res, function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    //error
                    if (err) {
                        console.log("error uploading the file : ", err);
                        res.status(RESPONSE_CODES.SERVER_ERROR).send("failed to upload");
                        return;
                    }
                    //success
                    res.status(RESPONSE_CODES.CREATED).send("File Uploaded");
                    //since upload is successful, we deleted the old file.
                    if (oldFilename)
                        yield (0, fileiofunctions_1.deleteFile)(req, res, path.join(dir, oldFilename), oldFilename, RESPONSE_CODES.SERVER_ERROR);
                    let vcfGenomeFolder = path.join(__dirname, process.env.GENOME_DATA_FOLDER_UPLOAD);
                    let vcfFilename = req.file.filename;
                    let vcfFullPath = path.join(vcfGenomeFolder, vcfFilename);
                    let jsonsVcfFolder = path.join(__dirname, process.env.JSONS_CLINVAR_FOLDER);
                    let vcfJsons = yield (0, fileiofunctions_1.getFilenamesFromDir)(jsonsVcfFolder, res);
                    for (const json of vcfJsons) {
                        yield (0, fileiofunctions_1.deleteFile)(req, res, path.join(jsonsVcfFolder, json), json, RESPONSE_CODES.SERVER_ERROR);
                    }
                    let writeFilesDestination = jsonsVcfFolder;
                    yield (0, fileiofunctions_1.processLineByLine)(vcfFullPath, writeFilesDestination);
                    console.log("done processing");
                });
            });
        }
        catch (error) { }
    });
});
app.post("/api", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const OPERATION = req.body.operationName;
        switch (OPERATION) {
            case "Gene":
                //refNum = req.body.variables.geneId // geneSymbol
                refNum = req.body.variables.geneSymbol;
                console.log(refNum);
                /// return res.redirect(`/api/grch37`)
                return res.redirect(`/api/Gene/${req.body.variables.geneSymbol}`);
            case "GeneCoverage":
                return res.redirect(`/api/GeneCoverage/pcsk9`);
            case "VariantsInGene":
                //console.log(req.variables)
                return res.redirect(`/api/VariantsInGene/${req.body.operationName}/${refNum}`);
            //return res.redirect(`/api/${req.body.operationName}/${req.body.variables.geneId.split('_')[0]}`)
            // return res.redirect(`/api/${req.body.operationName}/clinvar_stub`)
        }
        // if(req.body.operationName ==="Gene"){
        //     //let url = `/api/${req.body.operationName}/${req.body.variables.geneId}`
        //     let url = `/api/grch37`
        //     console.log(req.body.operationName)
        //     return res.redirect(url)
        // }
        try {
            if (!req.body.variables.query)
                throw new EmptySearchTermError_1.EmptySearchTermError("Search Term is undefined", 400);
            const SEARCH_TERM = req.body.variables.query.toLowerCase();
            let dir = path.join(__dirname, process.env.JSONS_CLINVAR_FOLDER);
            let filesNames = yield (0, fileiofunctions_1.getFilenamesFromDir)(dir, res);
            let ensemblIdList = filesNames.map(filename => {
                let ensemblId = filename.split(".")[0].split("-")[1];
                let symbol = filename.split(".")[0].split("-")[0];
                let keyVale = { ensembl_id: symbol, symbol: symbol };
                return keyVale;
            });
            let data = { data: { gene_search: [] } };
            for (let i = 0; i < ensemblIdList.length; i++) {
                const ELEMENT = ensemblIdList[i].symbol.toLowerCase();
                // let rand = Math.floor(Math.random() * (20000 - 0) + 0)
                if (ELEMENT.includes(SEARCH_TERM))
                    data.data.gene_search.push(ensemblIdList[i]);
                if (data.data.gene_search.length > 10)
                    break;
            }
            res.send(JSON.stringify(data));
        }
        catch (error) { }
    });
});
app.get("/api/VariantsInGene/:operationName/:symbol", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let readDir = path.join(__dirname, process.env.JSONS_CLINVAR_FOLDER);
        let filesNames = yield (0, fileiofunctions_1.getFilenamesFromDir)(readDir, res);
        let filename = "";
        req.params.symbol;
        filesNames.forEach(element => {
            if (element.includes(req.params.symbol))
                filename = element;
        });
        let dir = path.join(__dirname, process.env.JSONS_CLINVAR_FOLDER);
        try {
            //console.log("symbol",req.params.symbol)
            let geneData = yield fs.readFile(path.join(dir, filename));
            let jsonData = JSON.parse(geneData);
            res.send(JSON.stringify(jsonData));
        }
        catch (err) {
            console.log(err);
        }
    });
});
app.get("/api/Gene/:ReferenceSymbol", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let dir = path.join(__dirname, process.env.JSONS_GENE_REFRENCE_FOLDER);
        try {
            let geneData = yield fs.readFile(path.join(dir, `${req.params.ReferenceSymbol}.json`));
            let jsonData = JSON.parse(geneData);
            res.send(JSON.stringify(jsonData));
        }
        catch (err) {
            console.log(err);
        }
    });
});
app.get("/api/GeneCoverage/pcsk9", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let dir = path.join(__dirname, process.env.GENOME_DATA_FOLDER_UPLOAD);
        try {
            let geneData = yield fs.readFile(path.join(dir, `pcsk9_coverage_stub.json`));
            let jsonData = JSON.parse(geneData);
            res.send(JSON.stringify(jsonData));
        }
        catch (err) {
            console.log(err);
        }
    });
});
app.get("/UpdateData/process/vcf", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let vcfGenomeFolder = path.join(__dirname, process.env.GENOME_DATA_FOLDER_UPLOAD);
            let vcfFiles = yield (0, fileiofunctions_1.getFilenamesFromDir)(vcfGenomeFolder, res);
            //this like filters the filenames and produces a list of 1 element containing the desired filename
            let vcfFile = vcfFiles.filter((file) => file.includes(process.env.VCF_FILENAME))[0];
            let vcfFullPath = path.join(vcfGenomeFolder, vcfFile);
            let jsonsVcfFolder = path.join(__dirname, process.env.JSONS_CLINVAR_FOLDER);
            let jsonVcfJsons = yield (0, fileiofunctions_1.getFilenamesFromDir)(jsonsVcfFolder, res);
            for (const json of jsonVcfJsons) {
                yield (0, fileiofunctions_1.deleteFile)(req, res, path.join(jsonsVcfFolder, json), json, RESPONSE_CODES.SERVER_ERROR);
            }
            let writeFilesDestination = jsonsVcfFolder;
            yield (0, fileiofunctions_1.processLineByLine)(vcfFullPath, writeFilesDestination);
            console.log("done processing");
            res.send("processed!");
        }
        catch (err) {
            console.log(err);
        }
    });
});
app.get("/UpdateData/process/Coverage", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let genomeFolder = path.join(__dirname, process.env.GENOME_DATA_FOLDER_UPLOAD);
            let dataFiles = yield (0, fileiofunctions_1.getFilenamesFromDir)(genomeFolder, res);
            //this like filters the filenames and produces a list of 1 element containing the desired filename
            let coverageFile = dataFiles.filter((file) => file.includes(process.env.COVERAGE_FILE_STAMP))[0];
            let coverageFilePath = path.join(genomeFolder, coverageFile);
            //  let jsonsVcfFolder: string = path.join(__dirname, <string>process.env.JSONS_CLINVAR_FOLDER)
            //  let jsonVcfJsons: string[] = await getFilenamesFromDir(jsonsVcfFolder, res)
            //for (const json of jsonVcfJsons) {
            //   await deleteFile(req, res, path.join(jsonsVcfFolder, json),json, responseCode.SERVER_ERROR)
            //   }
            let writeFilesDestination = path.join(__dirname, process.env.JSONS_COVERAGE_FOLDER);
            yield (0, fileiofunctions_1.processCoverageLineByLine)(coverageFilePath, writeFilesDestination);
            console.log("done processing");
            res.send("processed!");
        }
        catch (err) {
            console.log(err);
        }
    });
});
app.get("/UpdateData/process/Reference", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let geneCodeFolder = path.join(__dirname, process.env.GENOME_DATA_FOLDER_UPLOAD);
            geneCodeFolder = path.join(geneCodeFolder, process.env.GENE_CODE_FOLDER);
            let geneCodeFile = yield (0, fileiofunctions_1.getFilenamesFromDir)(geneCodeFolder, res, 500);
            geneCodeFile = geneCodeFile[0];
            let geneCodeFullpath = path.join(geneCodeFolder, geneCodeFile);
            let writeFilesDestination = path.join(__dirname, process.env.JSONS_GENE_REFRENCE_FOLDER);
            yield (0, fileiofunctions_1.processReferenceLinebyLine)(geneCodeFullpath, writeFilesDestination);
            res.status(RESPONSE_CODES.OK).send("File Processed");
        }
        catch (err) {
            console.log(err.message);
            res.status(RESPONSE_CODES.SERVER_ERROR).send(err.message);
        }
    });
});
app.post("/reads", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inreads");
    });
});
app.listen(port, function () {
    console.log(cmd_colors_1.default.Magenta("Listening To Port : "), cmd_colors_1.default.Orange(`${port}`));
});
//this function deletes a file by request.
function uploadFileFromUser(req, res, errorCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield upload(req, res);
        }
        catch (error) {
            res.status(errorCode ? errorCode : 500).send();
            throw error;
        }
    });
}
//this function returns a filename from gsutill command.
function getFilenameFromGSutil(command) {
    //this regex goes to the end of the line and then take anything untill you reach a /
    // the result of this is the filename at the end of a path.
    let filename = command.match(/[^\/]+$/gm)[0]; //command.match(/[^\/]+\s\.$/gm)![0];
    //gsutil ends its command with a space and period that we need to trim.
    filename = filename.slice(0, -1);
    filename = filename.slice(0, -1);
    return filename;
}
// function create_file_path(file_name: string = "No_Name", file_extention: string, folder_name: string = "uploads") {
//     let new_file_name: string = timestamp_file_name(file_name, file_extention);
//     let new_file_path: string = `${__dirname}/${folder_name}/${new_file_name}`
//     return new_file_path;
// }
function timestampFilename(filename) {
    let name = filename.split(".")[0].trim();
    let extention = filename.split('.')[1].trim();
    if (!name) {
        name = "No_name";
    }
    let today = new Date(Date.now());
    let todayStr = today.toDateString().replace(/\s/g, "-");
    let hours = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let timestamp = Date.now();
    const TIME_IN_HH_MM_SS = `(_${hours}H-${minutes}M-${seconds}S_)`;
    return `${name}-${todayStr}_${TIME_IN_HH_MM_SS}_${timestamp}.${extention}`;
}
function pathToFilename(path) {
    //given a path, this regex returns the file and extention
    //let filename= path.match(/[^\/]+\s\.$/gm)![0]
    let filename = path.match(/[^\/]+$/gm)[0];
    //let filename= path.match(/[^\\]+$/gm)![0]
    console.log(filename, "path");
    return filename;
}
function handleError(error, res, errorCode) {
    if (error) {
        console.log(error);
        //  res.status(errorCode).send(error)
        throw new Error("stuff");
    }
}
function pathToNameAndExtention(path) {
    //given a path, this regex returns the file and extention
    // let filename= path.match(/[^\/]+\s\.$/gm)![0]
    let filename = path.match(/[^\/]+$/gm)[0];
    // let filename= path.match(/[^\\]+$/gm)![0]
    let name = filename.split(".")[0];
    let extention = filename.split(".")[1];
    return { name, extention };
}
// async function getFilenamesFromDir(dir: string, res: Response, errorCode?: number) {
//     try {
//         return await fs.readdir(dir);
//     } catch (error) {
//         res.status(errorCode ? errorCode : 500).send()
//         console.log(CMD.Orange(`error in reading the filenames from ${dir} function : getFileNamesFromDir \n`), error);
//         throw error
//     }
// }
process.on('uncaughtException', function (err) {
    console.log(cmd_colors_1.default.Red(`uncaughtException : ${err}`));
});
process.on('unhandledRejection', function (err) {
    console.log(cmd_colors_1.default.Red(`unhandledRejection : ${err}`));
});
//# sourceMappingURL=index.js.map