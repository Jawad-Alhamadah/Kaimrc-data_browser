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
//const { exec } = require("child_process");
const exec = util.promisify(require('child_process').exec);
const body_parser_1 = __importDefault(require("body-parser"));
//import fs, { PathLike } from 'fs'
const { promises: fs } = require("fs");
let fsRename = util.promisify(fs.rename);
//let fsReadDir = util.promisify(fs.readdir)
const fileiofunctions_1 = require("./lib/Typescript_modules/fileiofunctions");
let responseCode = require("./lib/Typescript_modules/responseCodes");
var path = require('path');
const multer = require("multer");
let port = 5000;
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, path.join(__dirname, process.env.UPLOAD_FOLDER_NAME_GENOME));
    },
    filename: function (req, file, cb) {
        let filename = timestampFilename(file.originalname);
        cb(null, filename);
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
            let oldFileName = getFilenameFromGSutil(command);
            let oldFilePath = path.join(path.join(__dirname, terraUploadFoldername), oldFileName);
            let stampedFilename = timestampFilename(oldFileName);
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
            let dir = path.join(__dirname, process.env.UPLOAD_FOLDER_NAME_GENOME);
            let filesNames = yield getFilenamesFromDir(dir, res);
            let oldFilename = filesNames[0];
            upload(req, res, function (err) {
                return __awaiter(this, void 0, void 0, function* () {
                    //error
                    if (err) {
                        console.log("error uploading the file : ", err);
                        res.status(responseCode.SERVER_ERROR).send("failed to upload");
                        return;
                    }
                    //success
                    res.status(responseCode.CREATED).send("File Uploaded");
                    //since upload is successful, we deleted the old file.
                    yield deleteFile(req, res, path.join(dir, oldFilename), responseCode.SERVER_ERROR);
                    let filename = req.file.filename;
                    let fullPath = path.join(path.join(__dirname, "/genome_data_files/"), filename);
                    let writeFilesDestination = path.join(__dirname, "json_files");
                    yield (0, fileiofunctions_1.processLineByLine)(fullPath, writeFilesDestination);
                    console.log("done processing");
                });
            });
        }
        catch (error) { }
    });
});
app.post("/api", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (req.body.operationName) {
            case "Gene":
                return res.redirect(`/api/grch37`);
            case "GeneCoverage":
                return res.redirect(`/api/pcsk9`);
            case "VariantsInGene":
                return res.redirect(`/api/${req.body.operationName}/${req.body.variables.geneId.split('_')[0]}`);
        }
        // if(req.body.operationName ==="Gene"){
        //     //let url = `/api/${req.body.operationName}/${req.body.variables.geneId}`
        //     let url = `/api/grch37`
        //     console.log(req.body.operationName)
        //     return res.redirect(url)
        // }
        try {
            let dir = path.join(__dirname, process.env.JSON_FILES_FOLDER);
            let filesNames = yield getFilenamesFromDir(dir, res);
            let ensemblIdList = filesNames.map(filename => ({ ensembl_id: filename.split(".")[0], symbol: filename.split(".")[0] }));
            let data = { data: { gene_search: [] } };
            data.data.gene_search.push(ensemblIdList[2000]);
            data.data.gene_search.push(ensemblIdList[90]);
            data.data.gene_search.push(ensemblIdList[4628]);
            data.data.gene_search.push(ensemblIdList[3752]);
            data.data.gene_search.push(ensemblIdList[3588]);
            data.data.gene_search.push(ensemblIdList[200]);
            res.send(JSON.stringify(data));
        }
        catch (error) { }
    });
});
app.get("/api/:operationName/:symbol", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let dir = path.join(__dirname, process.env.JSON_FILES_FOLDER);
        try {
            console.log("symbol", req.params.symbol);
            let geneData = yield fs.readFile(path.join(dir, `${req.params.symbol}.json`));
            let jsonData = JSON.parse(geneData);
            res.send(JSON.stringify(jsonData));
        }
        catch (err) {
            console.log(err);
        }
    });
});
app.get("/api/grch37", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let dir = path.join(__dirname, process.env.GENE_REFRENCE_FILES);
        try {
            let geneData = yield fs.readFile(path.join(dir, `grch37_reference_stub.json`));
            let jsonData = JSON.parse(geneData);
            res.send(JSON.stringify(jsonData));
        }
        catch (err) {
            console.log(err);
        }
    });
});
app.get("/api/pcsk9", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let dir = path.join(__dirname, process.env.GENE_REFRENCE_FILES);
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
app.post("/reads", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("inreads");
    });
});
app.listen(port, function () {
    console.log(cmd_colors_1.default.Magenta("Listening To Port : "), cmd_colors_1.default.Orange(`${port}`));
});
//this function deletes a file by request.
function deleteFile(req, res, path, errorCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs.unlink(path);
        }
        catch (error) {
            res.status(errorCode ? errorCode : 500).send();
            console.log("couldn't delete File");
            throw error;
        }
    });
}
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
function getFilenamesFromDir(dir, res, errorCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fs.readdir(dir);
        }
        catch (error) {
            res.status(errorCode ? errorCode : 500).send();
            console.log(cmd_colors_1.default.Orange(`error in reading the filenames from ${dir} function : getFileNamesFromDir \n`), error);
            throw error;
        }
    });
}
//process.on('uncaughtException', function (err: Error) {
//  console.log(CMD.Red(`uncaughtException : ${err}`))
//})
//process.on('unhandledRejection', function (err: Error) {
////   console.log(CMD.Red(`unhandledRejection : ${err}`))
//});
//processLineByLine(__dirname + "/genome_data_files/combined_annotated_VCF_allele_counts-Fri-Nov-04-2022_(_9H-50M-54S_)_1667587854600.txt", __dirname + "/json_files")
