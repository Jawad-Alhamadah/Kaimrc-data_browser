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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilenamesFromDir = exports.deleteFile = exports.createDictionary = exports.processCoverageLineByLine = exports.processReferenceLinebyLine = exports.processLineByLine = void 0;
const fs = require("fs"); //mycomment
const readline = require("readline");
const Variant_1 = require("../Classes/ClinvarDataClasses/Variant");
const ClinvarVariant_1 = require("../Classes//ClinvarDataClasses/ClinvarVariant");
const variables_1 = require("./variables");
const variables_2 = require("../../lib/Typescript_modules/variables");
const Reference_1 = require("../../lib/Classes/GeneReferenceDataClasses/Reference");
const ReferenceTranscript_1 = require("../../lib/Classes/GeneReferenceDataClasses/ReferenceTranscript");
const ReferenceTranscriptExon_1 = require("../../lib/Classes/GeneReferenceDataClasses/ReferenceTranscriptExon");
const FileProcessError_1 = require("../Classes/ErrorClasses/FileProcessError");
const RESPONSE_CODES = require("./responseCodes");
const ERROR_MESSAGES = require("./ErrorMessages");
const { promises: fsPromise } = require("fs");
const cmd_colors_1 = __importDefault(require("../../cmd_libs/cmd_colors"));
var path = require('path');
let jsonEntiresLimit = 100000;
//this function processes the VCF file line by line and creates Json entries that mirror the Gnomad data
function processLineByLine(filePath, destination) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        //  let vcf_to_gnomad_map: any = []
        console.time("time:");
        let vcfFeaturesToFilterIndicesDictionary = {};
        let isFirstLine = true;
        let vcfFilterIndices = [];
        let ensemblIdMap = {};
        let indexOfGeneFeature = 0;
        let prevEnsemblId = "";
        let prevSymbol = "";
        let dotCounter = 0;
        let indexOfSymbol = 0;
        let isRowOfFeatures = true;
        let posJson = {};
        const readStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });
        //this is the general structure of the gnomad json files
        let gnomadJsonDataStructure = {
            data: {
                meta: { clinvar_release_date: "2022-01-04" },
                gene: {
                    clinvar_variants: [],
                    variants: []
                }
            }
        };
        try {
            //forloop to read vcf file one line at a time
            for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                const line = rl_1_1.value;
                //read the firstline and split it into one row of data entires
                // continue
                let row = line.split(/\t/g);
                let currentEnsemblId = row[indexOfGeneFeature];
                let currentSymbol = row[indexOfSymbol];
                vcfFilterIndices.forEach(index => {
                    row[index] = row[index].trim();
                    if (row[index] === '-')
                        row[index] = "NA";
                });
                // row = tempRow
                /*
                the if statment below handles the first line of the VCF file.
                its a special case because the first line contains the feature
                names of the data.
         
                vcfFilterIndices is the list of indices for values we want to keep from each row of data.
         
                vcfFeaturesToFilterIndicesDictionary is a dictonary that maps the features we are going to use
                with their postion in each row of data.
         
                GnomadFeaturesToVcfDictionary is a dictonary that maps the name of the gnomad json fields to the vcf fields.
                */
                if (isRowOfFeatures) {
                    let allFeatures = row.map(feature => feature.toLowerCase());
                    vcfFilterIndices = createFilterIndices(variables_1.VCF_FEATURES, allFeatures);
                    allFeatures.forEach((feature, i) => {
                        if (feature === "symbol")
                            indexOfSymbol = i;
                        if (feature === "gene")
                            indexOfGeneFeature = i;
                    });
                    let filteredVcfFeatures = vcfFilterIndices.map(value => allFeatures[value].toLowerCase());
                    vcfFeaturesToFilterIndicesDictionary = createDictionary(filteredVcfFeatures, vcfFilterIndices);
                    isRowOfFeatures = false;
                    continue;
                }
                if (isFirstLine) {
                    prevSymbol = currentSymbol;
                    prevEnsemblId = currentEnsemblId;
                    isFirstLine = false;
                }
                if (row[indexOfSymbol] === 'NA')
                    continue;
                /* create variants and ClinvarVariant obejcts
                   we use the row of data, and  gnomad to vcf, vcf to index dictonaries
                   to get the information only using a string of the name of the gnomad fields as input.
                */
                dotCounter++;
                if (dotCounter > 10000) {
                    process.stdout.write(".");
                    dotCounter = 0;
                }
                let clinvarVariant = new ClinvarVariant_1.ClinvarVariant(row, variables_1.GNOMAD_TO_VCF, vcfFeaturesToFilterIndicesDictionary);
                let variant = new Variant_1.Variant(row, variables_1.GNOMAD_TO_VCF, vcfFeaturesToFilterIndicesDictionary);
                gnomadJsonDataStructure.data.gene.clinvar_variants.push(clinvarVariant);
                gnomadJsonDataStructure.data.gene.variants.push(variant);
                posJson[clinvarVariant.symbol] = clinvarVariant.pos;
                //console.log(JSON.stringify(gnomadJsonDataStructure, null, 4))
                //continue
                if (!(prevSymbol === currentSymbol)) {
                    let writeStream = fs.createWriteStream(path.join(destination, `${prevSymbol}-${prevEnsemblId}.json`));
                    writeStream.write(JSON.stringify(gnomadJsonDataStructure, null, 4));
                    prevSymbol = currentSymbol;
                    prevEnsemblId = currentEnsemblId;
                    //empty json to avoid going over the limit of javascript variable size
                    gnomadJsonDataStructure = { data: { meta: { clinvar_release_date: "2022-01-04" }, gene: { clinvar_variants: [], variants: [] } } };
                    writeStream.end();
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rl_1_1 && !rl_1_1.done && (_a = rl_1.return)) yield _a.call(rl_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        let writePath = path.join(__dirname + "/../../", process.env.GENOME_DATA_FOLDER_UPLOAD);
        let writeStream = fs.createWriteStream(path.join(writePath, `${process.env.POS_FILE_STAMP}.json`));
        writeStream.write(JSON.stringify(posJson, null, 4));
        console.timeEnd("time:");
    });
}
exports.processLineByLine = processLineByLine;
function processReferenceLinebyLine(filePath, destination) {
    var e_2, _a;
    return __awaiter(this, void 0, void 0, function* () {
        //  let vcf_to_gnomad_map: any = []
        console.time("time:");
        let colors = [cmd_colors_1.default.Red, cmd_colors_1.default.Blue, cmd_colors_1.default.Cyan, cmd_colors_1.default.Green, cmd_colors_1.default.Indigo, cmd_colors_1.default.Magenta, cmd_colors_1.default.Orange];
        let colorsCounter = 0;
        let dotCounter = 0;
        let reference = new Reference_1.Reference([], []);
        let transcripts = [];
        //let geneReferenceFolder: string = path.join(__dirname+"/../../", <string>process.env.JSONS_GENE_REFRENCE_FOLDER)
        //console.log(geneReferenceFolder)
        let JsonsGeneReference = yield getFilenamesFromDir(destination); //, res)
        for (const JSON_NAMES of JsonsGeneReference) {
            yield deleteFile(null, null, path.join(destination, JSON_NAMES), JSON_NAMES, RESPONSE_CODES.SERVER_ERROR);
        }
        //command.match(/[^\/]+$/gm)![0]
        yield doesFileExist(filePath);
        const readStream = fs.createReadStream(filePath);
        //console.log(readStream)
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });
        let typeIndex = 2;
        try {
            //verification comment
            //another ver
            //forloop to read vcf file one line at a time
            for (var rl_2 = __asyncValues(rl), rl_2_1; rl_2_1 = yield rl_2.next(), !rl_2_1.done;) {
                const line = rl_2_1.value;
                //# is indicative of a comment
                if (line.includes('#'))
                    continue;
                let rowOfData = line.split(/\t/g);
                //rowOfData=[]
                if (rowOfData.length == 0)
                    throw new FileProcessError_1.FileProcessError(ERROR_MESSAGES.CANT_PROCESS, RESPONSE_CODES.SERVER_ERROR);
                let type = rowOfData[typeIndex];
                // let rowOfData = line.split(/\t/g)
                let featuredElements = rowOfData.pop().split(/;\s/g);
                let nonFeaturedElements = rowOfData;
                let featuredElementsKeyValue = featuredElements.map(pair => {
                    let data = pair.split(/\s+/g);
                    return { key: data[0], value: data[1].replace(/"/g, "") };
                });
                let AllFeaturesKeyValue = [];
                variables_1.GENE_CODE_GFT_FEATURES.forEach((key, i) => {
                    AllFeaturesKeyValue[key] = nonFeaturedElements[i];
                });
                featuredElementsKeyValue.forEach((pair, i) => {
                    AllFeaturesKeyValue[pair.key] = pair.value;
                });
                switch (type) {
                    case "gene":
                        reference.pushTranscripts(transcripts);
                        if (reference.symbol) {
                            if (reference.symbol.includes("/"))
                                reference.symbol = reference.symbol.replace(/\//g, '-');
                        }
                        let JsonData = { data: { gene: reference } };
                        let writeStream = fs.createWriteStream(path.join(destination, `${reference.symbol}.json`));
                        writeStream.write(JSON.stringify(JsonData, null, 4));
                        writeStream.end();
                        reference = new Reference_1.Reference(variables_2.GENECODE_TO_GNOMAD_REFERENCE, AllFeaturesKeyValue);
                        transcripts = [];
                        break;
                    case "transcript":
                        transcripts.push(new ReferenceTranscript_1.ReferenceTranscript(variables_2.GENECODE_TO_GNOMAD_REFERENCE, AllFeaturesKeyValue));
                        break;
                    case "CDS":
                    case "start_codon":
                    case "UTR":
                    case "exon":
                    case "stop_codon":
                        const EXON = new ReferenceTranscriptExon_1.ReferenceTranscriptExon(variables_2.GENECODE_TO_GNOMAD_REFERENCE, AllFeaturesKeyValue);
                        transcripts[transcripts.length - 1].exons.push(EXON);
                        reference.exons.push(EXON);
                        break;
                }
                colorsCounter++;
                if (colorsCounter > 6)
                    colorsCounter = 0;
                //console.log("\n")
                dotCounter++;
                if (dotCounter > 10000) {
                    process.stdout.write('. ');
                    dotCounter = 0;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (rl_2_1 && !rl_2_1.done && (_a = rl_2.return)) yield _a.call(rl_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        console.timeEnd("time:");
        return "";
    });
}
exports.processReferenceLinebyLine = processReferenceLinebyLine;
function processCoverageLineByLine(filePath, destination) {
    var e_3, _a;
    return __awaiter(this, void 0, void 0, function* () {
        //let keyValuePair: any = []
        //let symbols = vcfJsons.map(filename => filename.split("-")[0])
        //symbols.forEach(e => keyValuePair[e] = 0)
        // symbols.forEach((e: string) => console.log(keyValuePair[e]))
        //console.log(keyValuePair)
        const GENE_FOLDER = path.join(__dirname + "/../../", process.env.GENOME_DATA_FOLDER_UPLOAD);
        const DATA_FILES = yield getFilenamesFromDir(GENE_FOLDER);
        let posFilename = '';
        DATA_FILES.forEach(FILE => {
            let isPosFile = FILE.includes(process.env.POS_FILE_STAMP);
            if (isPosFile) {
                posFilename = FILE;
                return;
            }
        });
        let posJson = yield fsPromise.readFile(path.join(GENE_FOLDER, posFilename));
        let firstLine = true;
        const readStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });
        try {
            for (var rl_3 = __asyncValues(rl), rl_3_1; rl_3_1 = yield rl_3.next(), !rl_3_1.done;) {
                const line = rl_3_1.value;
                if (firstLine) {
                    console.log(line.split(/\t/g));
                    firstLine = false;
                }
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (rl_3_1 && !rl_3_1.done && (_a = rl_3.return)) yield _a.call(rl_3);
            }
            finally { if (e_3) throw e_3.error; }
        }
    });
}
exports.processCoverageLineByLine = processCoverageLineByLine;
//this function creates a dictonary given a set of keys and values
function createDictionary(keysList, valuesList) {
    let mapDict = {};
    for (let i = 0; i < valuesList.length; i++) {
        const key = keysList[i];
        mapDict[key] = valuesList[i];
    }
    return mapDict;
}
exports.createDictionary = createDictionary;
//given two lists, this function returns a filter list
//that contains indices where both values match.
function createFilterIndices(baseList, elements) {
    let indices = [];
    elements.forEach((value, index) => {
        if (baseList.includes(value))
            indices.push(index);
    });
    return indices;
}
function deleteFile(req, res, path, filename, errorCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //  console.log(CMD.Red(`File Deleted : ${filename} --- ${getTimestamp()}`))
            yield fsPromise.unlink(path);
        }
        catch (error) {
            // res.status(errorCode ? errorCode : 500).send()
            console.log(cmd_colors_1.default.Red(`error in deleting the filenames from ${path} function :deleteFile  \n`), error);
            throw new FileProcessError_1.FileProcessError(ERROR_MESSAGES.CANT_DELETE, RESPONSE_CODES.SERVER_ERROR);
        }
    });
}
exports.deleteFile = deleteFile;
function getTimestamp() {
    let today = new Date(Date.now());
    let todayStr = today.toDateString().replace(/\s/g, "-");
    let hours = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    //let timestamp = Date.now()
    const TIME_IN_HH_MM_SS = ` - ${hours}:${minutes}:${seconds}`;
    return `${todayStr}_${TIME_IN_HH_MM_SS}`;
}
function getFilenamesFromDir(dir, res, errorCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fsPromise.readdir(dir);
        }
        catch (error) {
            // console.log(error.stack)
            console.log(cmd_colors_1.default.Red(`error in reading the filenames from ${dir} function : getFileNamesFromDir \n`), error);
            throw new FileProcessError_1.FileProcessError(ERROR_MESSAGES.CANT_READ_FILE, RESPONSE_CODES.SERVER_ERROR);
        }
    });
}
exports.getFilenamesFromDir = getFilenamesFromDir;
function doesFileExist(path) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fsPromise.access(path, fs.F_OK);
        }
        catch (error) {
            console.log(cmd_colors_1.default.Red(`error in reading the file in :  ${path} function . : doesFileExist \n`), error);
            throw new FileProcessError_1.FileProcessError(ERROR_MESSAGES.FILE_NOT_EXIST, RESPONSE_CODES.SERVER_ERROR);
        }
    });
}
//# sourceMappingURL=fileiofunctions.js.map