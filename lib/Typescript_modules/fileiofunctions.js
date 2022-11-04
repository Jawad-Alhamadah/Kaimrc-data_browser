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
exports.processLineByLine = void 0;
const fs = require("fs"); //mycomment
const readline = require("readline");
const Variant_1 = require("../Classes/Variant");
const ClinvarVariant_1 = require("../Classes/ClinvarVariant");
const variables_1 = require("./variables");
function processLineByLine(filePath, destination) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        //  let vcf_to_gnomad_map: any = []
        let vcfFeaturesToFilteredIndexMap = {};
        let jsonCount = 0;
        const readStream = fs.createReadStream(filePath
        //  __dirname + "/genome_data_files/combined_annotated_VCF_allele_counts-Fri-Nov-04-2022_(_9H-50M-54S_)_1667587854600.txt"
        );
        //.......
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        //
        let isFirstLine = true;
        let vcfFilterIndices = Array();
        let count = 0;
        //let cols = []
        console.time("time:");
        let jsonStructure = {
            data: {
                meta: {},
                gene: {
                    clinvarVariants: [],
                    variants: []
                }
            }
        };
        try {
            for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                const line = rl_1_1.value;
                let row = line.split(/\t+/g);
                //row = row.map(e => e.trim())
                //row.splice(2400, row.length);
                if (isFirstLine) {
                    let allFeatures = row;
                    vcfFilterIndices = createdFilteredIndicesFromStringLists(variables_1.vcfFeatures, allFeatures);
                    // row.forEach((feature: string, index: number) => {
                    //     if (vcfFeatures.includes(feature.toLowerCase())) vcfFilterIndices.push(index);
                    // });
                    let filteredVcfFeatures = vcfFilterIndices.map(value => allFeatures[value]);
                    let vcfFeaturesToFilteredIndexMap = createDictionary(filteredVcfFeatures, vcfFilterIndices);
                    console.log(variables_1.GnomadToVcfMap);
                    //console.log(filteredVcfFeatures)
                    console.log(vcfFeaturesToFilteredIndexMap);
                    // console.log(vcfFilterIndices)
                    // row.forEach( e =>  { if( e.toLowerCase().includes("hg") ) console.log(e) })
                    // break;
                }
                isFirstLine = false;
                let clinvarVariant = new ClinvarVariant_1.ClinvarVariant(row, variables_1.GnomadToVcfMap, vcfFeaturesToFilteredIndexMap);
                let variant = new Variant_1.Variant(row, variables_1.GnomadToVcfMap, vcfFeaturesToFilteredIndexMap);
                jsonStructure.data.gene.clinvarVariants.push(clinvarVariant.toJson());
                jsonStructure.data.gene.variants.push(variant.toJson());
                count++;
                // dot_counter++
                // if (dot_counter >= 5000) {
                //   process.stdout.write(".")
                //   dot_counter = 0;
                // }
                if (count >= 100000) {
                    count = 0;
                    let writeStream = fs.createWriteStream(destination);
                    //fs.createWriteStream(__dirname + "/json_files/myjson" + jsonCount + ".json")
                    jsonCount++;
                    writeStream.write(JSON.stringify(jsonStructure, null, 4));
                    jsonStructure = {
                        data: {
                            meta: {},
                            gene: {
                                clinvarVariants: [],
                                variants: []
                            }
                        }
                    };
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
        if (jsonStructure.data.gene.clinvarVariants.length) {
            let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson" + jsonCount + ".json");
            jsonCount++;
            writeStream.write(JSON.stringify(jsonStructure, null, 4));
            writeStream.end();
        }
        // writeStream.end()
        console.timeEnd("time:");
    });
}
exports.processLineByLine = processLineByLine;
function createDictionary(keysList, valuesList) {
    let mapDict = {};
    for (let i = 0; i < valuesList.length; i++) {
        const key = keysList[i];
        mapDict[key.toLowerCase()] = valuesList[i];
    }
    return mapDict;
}
function createdFilteredIndicesFromStringLists(baseList, elementsToFilterList) {
    let indices = [];
    elementsToFilterList.forEach((value, index) => {
        if (baseList.includes(value.toLowerCase()))
            indices.push(index);
    });
    return indices;
}
