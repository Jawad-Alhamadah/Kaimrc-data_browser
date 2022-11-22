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
exports.processLineByLine = void 0;
const fs = require("fs"); //mycomment
const readline = require("readline");
const variables_1 = require("./lib/Typescript_modules/variables");
const { promises: fsPromise } = require("fs");
const Reference_1 = require("./lib/Classes/GeneReferenceDataClasses/Reference");
const cmd_colors_1 = __importDefault(require("./cmd_libs/cmd_colors"));
var path = require('path');
let colorsCounter = 0;
let colors = [cmd_colors_1.default.Red, cmd_colors_1.default.Blue, cmd_colors_1.default.Cyan, cmd_colors_1.default.Green, cmd_colors_1.default.Indigo, cmd_colors_1.default.Magenta, cmd_colors_1.default.Orange];
function processLineByLine(filePath) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        try { //  let vcf_to_gnomad_map: any = []
            console.time("time:");
            let isFirstLine = true;
            let indexOfGeneFeature = 0;
            let dotCounter = 0;
            let indexOfSymbol = 0;
            let listOfRowLengths = [];
            const readStream = fs.createReadStream(filePath);
            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity,
            });
            let features = ['chrom', 'source', 'feature_type', 'start', 'end', 'score', 'strand', 'frame'];
            try {
                //verification comment
                //another ver
                //forloop to read vcf file one line at a time
                for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                    const line = rl_1_1.value;
                    let gnomadJsonDataStructure = {
                        data: {
                            meta: { clinvar_release_date: "2022-01-04" },
                            gene: {
                                variants: []
                            }
                        }
                    };
                    //read the firstline and split it into one row of data entires
                    let row = line.split(/\t/g);
                    if (line.includes('#'))
                        continue;
                    let no_feature_List = line.match(/.*(?=gene_id)/g);
                    let featured_List = line.split(/.*(?=gene_id)/g);
                    //console.log("no feature",featured_List)
                    no_feature_List = no_feature_List ? no_feature_List[0].split(/\t/g) : ["N/A"];
                    featured_List = featured_List ? featured_List[1].split(/;\s+/) : ["NA"];
                    // let row: string[] = line.split(/\t+/g)
                    listOfRowLengths.push(row.length);
                    //e is not returning itself here. Rather, e is acting like an expression
                    let filtered_no_feature = no_feature_List.filter(e => e);
                    let filtered_featured = featured_List.filter(e => e);
                    let noComma = filtered_featured.map(e => e.replace(/[,;]/g, ""));
                    let featuredKeyValue = noComma.map(pair => ({ key: pair.split(/\s+/g)[0], value: pair.split(/\s+/g)[1] }));
                    // for (let i = 0; i < 10; i++) {
                    //     const pair = noComma[i];
                    //  console.log(noComma);
                    // }featured_List
                    //  console.log("keyvalue: ",featuredKeyValue)
                    //console.log('just value', no_feature_List)
                    let completeList = [];
                    features.forEach((key, i) => {
                        completeList[key] = no_feature_List[i];
                    });
                    featuredKeyValue.forEach((pair, i) => {
                        completeList[pair.key] = pair.value.replace(/["]/g, "");
                    });
                    //if(!line.includes("level")) console.log("no hgnc")
                    let newRef = new Reference_1.Reference(variables_1.gftToReference, completeList);
                    // newRef.transcripts.push(new ReferenceTranscripts.toJson())
                    // console.log(newRef.transcripts[0])
                    // let singlePair:any = noComma[1]
                    // let x = singlePair.split(/\s+/g)
                    //console.log(noComma);
                    // let featureNames= featured_List.filter((e,i) => i%2===0)
                    //let featureValues= featured_List.filter((e,i) => i%2>0)  
                    //  console.log(createDictionary(features,filteredList))
                    //console.log(featuredKeyValue)
                    //     console.log("featured",featureValues)
                    //     let keyValuePair:any={}
                    //     for (let i = 0; i < featureNames.length; i++) {
                    //         const key = featureNames[i];
                    //         keyValuePair[key]=featureValues[i] 
                    //     }
                    //console.log("key_value",keyValuePair)
                    // for (let i = 0; i < nofeatureList.length; i++) {
                    //     const element = nofeatureList[i];
                    //     process.stdout.write( colors[colorsCounter](element + " ") )
                    // }
                    // for (let index = 0; index < row.length; index++) {
                    //     const element = row[index];
                    //     process.stdout.write( colors[colorsCounter](element + " ") )
                    // }
                    colorsCounter++;
                    if (colorsCounter > 6)
                        colorsCounter = 0;
                    console.log("\n");
                    dotCounter++;
                    if (dotCounter > 100) {
                        break;
                        // dotCounter = 0;
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
        }
        catch (err) {
            console.log(err);
        }
        console.timeEnd("time:");
    });
}
exports.processLineByLine = processLineByLine;
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
function createDictionary(keysList, valuesList) {
    let mapDict = {};
    for (let i = 0; i < valuesList.length; i++) {
        const key = keysList[i];
        mapDict[key] = valuesList[i];
    }
    return mapDict;
}
let foldername = path.join(__dirname, "genome_data_files");
processLineByLine(path.join(foldername, "gencode.v38.annotation.gtf"));
//# sourceMappingURL=myRef.js.map