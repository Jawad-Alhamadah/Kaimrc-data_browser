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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.processLineByLine = void 0;
const fs = require("fs"); //mycomment
const readline = require("readline");
const Variant_1 = require("../Classes/ClinvarDataClasses/Variant");
const ClinvarVariant_1 = require("../Classes//ClinvarDataClasses/ClinvarVariant");
const variables_1 = require("./variables");
const { promises: fsPromise } = require("fs");
var path = require('path');
let jsonEntiresLimit = 100000;
//this function processes the VCF file line by line and creates Json entries that mirror the Gnomad data
function processLineByLine(filePath, destination) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        //  let vcf_to_gnomad_map: any = []
        console.time("time:");
        let vcfFeaturesToFilterIndicesDictionary = {};
        let jsonFilesCount = 0;
        let isFirstLine = true;
        let vcfFilterIndices = [];
        let jsonEntriesCount = 0;
        let ensemblIdMap = {};
        let indexOfGeneFeature = 0;
        let prevEnsemblId = "";
        let prevSymbol = "";
        let dotCounter = 0;
        let indexOfSymbol = 0;
        let isRowOfFeatures = true;
        let listOfRowLengths = [];
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
                    vcfFilterIndices = createFilterIndices(variables_1.vcfFeatures, allFeatures);
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
                /* create variants and ClinvarVariant obejcts
                   we use the row of data, and  gnomad to vcf, vcf to index dictonaries
                   to get the information only using a string of the name of the gnomad fields as input.
                */
                dotCounter++;
                if (dotCounter > 10000) {
                    process.stdout.write(".");
                    dotCounter = 0;
                }
                let clinvarVariant = new ClinvarVariant_1.ClinvarVariant(row, variables_1.GnomadFeaturesToVcfDictionary, vcfFeaturesToFilterIndicesDictionary);
                let variant = new Variant_1.Variant(row, variables_1.GnomadFeaturesToVcfDictionary, vcfFeaturesToFilterIndicesDictionary);
                gnomadJsonDataStructure.data.gene.clinvar_variants.push(clinvarVariant);
                gnomadJsonDataStructure.data.gene.variants.push(variant);
                jsonEntriesCount++;
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
        console.timeEnd("time:");
    });
}
exports.processLineByLine = processLineByLine;
//this function creates a dictonary given a set of keys and values
function createDictionary(keysList, valuesList) {
    let mapDict = {};
    for (let i = 0; i < valuesList.length; i++) {
        const key = keysList[i];
        mapDict[key] = valuesList[i];
    }
    return mapDict;
}
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
function deleteFile(req, res, path, errorCode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fsPromise.unlink(path);
        }
        catch (error) {
            res.status(errorCode ? errorCode : 500).send();
            console.log("couldn't delete File");
            throw error;
        }
    });
}
exports.deleteFile = deleteFile;
//# sourceMappingURL=fileiofunctions.js.map