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
//.....
const cmd_colors_1 = __importDefault(require("./cmd_libs/cmd_colors"));
const variables_1 = require("./lib/Typescript_modules/variables");
const fs = require("fs"); //mycomment
const readline = require("readline");
let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson.json");
let dot_counter = 0;
//let vcf_feature_string =
//"ClinVar_sept_5_22_CLNSIG|ClinVar_sept_5_22_ID|num_samples|alt_allele_count|het_count|alt_allele_ratio|HGVSc|HGVSp|Consequence|POS|ClinVar_sept_5_22_CLNREVSTAT|Feature|ClinVar_sept_5_22|Consequence|rs_dbSNP|Feature|alt_count|HGVSc|5".toLowerCase();
//let vcf_features = vcf_feature_string.split(/\|/g);
//let gnomad_fields_str: string = 'clinical_significance|clinvar_variation_id|an|ac|ac_hemi|af|hgvsc|hgvsp|major_consequence|pos|review_status|transcript_id|variant_id|consequence|rsids|transcript_id|ac_hom|hgvs|transcript_version'
//let gnomad_fieldnames: string[] = gnomad_fields_str.split(/\|/g)
let vcf_to_gnomad_map = [];
let mapping = {};
let jsonCount = 0;
for (let index = 0; index < variables_1.gnomadFieldnames.length; index++) {
    vcf_to_gnomad_map[variables_1.gnomadFieldnames[index]] = variables_1.vcfFeatures[index];
}
let prevId = "";
function processLineByLine() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fileStream = fs.createReadStream(__dirname + "/genome_data_files/combined_annotated_VCF_allele_counts-Tue-Nov-15-2022_(_10H-58M-57S_)_1668542337171.txt");
        //.......
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        //
        let is_first_line = true;
        let indices = Array();
        let count = 0;
        //let cols = []
        console.time("time:");
        let json_structure = {
            data: {
                meta: {},
                gene: {
                    clinvar_variants: [],
                    variants: []
                }
            }
        };
        let geneNum = 0;
        let geneIdMapping = {};
        let myList = [];
        let inxmyList = [];
        let featureCounter = 0;
        let mylist = [];
        try {
            for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                const line = rl_1_1.value;
                let row = line.split(/\t+/g);
                //row = row.map(e => e.trim())
                //row.splice(2400, row.length);
                if (is_first_line) {
                    row.forEach((col_name, index) => {
                        if (variables_1.vcfFeatures.includes(col_name.toLowerCase()))
                            indices.push(index);
                        if (col_name.toLowerCase() === "gene")
                            geneNum = index;
                    });
                    for (let index = 0; index < indices.length; index++) {
                        let key = indices[index];
                        const element = row[key].toLowerCase();
                        //console.log(element ," : ", indices[index])
                        mapping[element] = key;
                    }
                    // row.forEach( e =>  { if( e.toLowerCase().includes("hg") ) console.log(e) })
                    // break;
                    row.forEach((col_name, index) => {
                        if (variables_1.vcfFeatures.includes(col_name.toLowerCase()))
                            indices.push(index);
                    });
                    //print columns
                    let searchTerms = "num|rs";
                    let searchList = searchTerms.split(/\|/g);
                    mylist = searchAndCreateKeyValuePairs(row, searchList);
                    is_first_line = false;
                    // break
                    continue;
                }
                // if(row.includes("DDX11L1")){
                //   console.log("entry num : " , count)
                //   featureCounter++;
                // }
                mylist.forEach((ele) => {
                    console.log(cmd_colors_1.default.Red("col_name: ") + cmd_colors_1.default.Blue(ele.colName) + cmd_colors_1.default.Red(" value: ") + cmd_colors_1.default.Blue(row[ele.index]));
                });
                console.log("................ ");
                console.log("................ ");
                console.log("................ ");
                // let clinvar_variant: ClinvarVariant = new ClinvarVariant(row, vcf_to_gnomad_map, mapping)
                // let variant: Variant = new Variant(row, vcf_to_gnomad_map, mapping)
                // json_structure.data.gene.clinvar_variants.push(clinvar_variant.toJson())
                // json_structure.data.gene.variants.push(variant.toJson())
                count++;
                dot_counter++;
                if (dot_counter >= 10000) {
                    process.stdout.write(".");
                    dot_counter = 0;
                    let searchTerms = "ref|alt|ense|symbol|position|chr|var|existing_variation|chrom|hgv";
                    let searchList = searchTerms.split(/\|/g);
                    searchAndCreateKeyValuePairs(row, searchList);
                    // let match = geneIdMapping.some(object => object.id ===row[geneNum])//geneIdMapping.find((object,index) => object.id ===row[geneNum])
                    // if(match){
                    //   //geneIdMapping[match].count+=1
                    // }
                    // else{
                    //   geneIdMapping.push({id:row[geneNum],jsonFileNumber:jsonCount,count:0})
                    // }
                    //let geneValue = indices.map(index => {rowName: vcfFeatures[row[index]],value:row[index]})
                    // break
                }
                //count >= 1000
                // console.log(row[geneNum])
                if (!(prevId === row[geneNum])) {
                    continue;
                    // console.log(geneIdMapping)
                    count = 0;
                    let writeStream = fs.createWriteStream(__dirname + "/json_files/" + prevId + ".json");
                    jsonCount++;
                    prevId = row[geneNum];
                    writeStream.write(JSON.stringify(json_structure, null, 4));
                    json_structure = {
                        data: {
                            meta: {},
                            gene: {
                                clinvar_variants: [],
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
        console.log(featureCounter);
        //console.log(geneIdMapping.length)
        if (json_structure.data.gene.clinvar_variants.length) {
            let writeStream = fs.createWriteStream(__dirname + "/json_files/" + prevId + ".json");
            jsonCount++;
            writeStream.write(JSON.stringify(json_structure, null, 4));
            writeStream.end();
        }
        writeStream.end();
        console.timeEnd("time:");
    });
}
function searchAndCreateKeyValuePairs(values, searchList) {
    let list = [];
    values.forEach((col_name, i) => {
        searchList.forEach(key => {
            if (col_name.toLowerCase().includes(key)) {
                // myList.push({colName :col_name, value:})
                list.push({ colName: col_name, index: i });
            }
        });
    });
    return list;
}
function getIndexFilter(stringOfElements) {
    return;
}
processLineByLine();
//# sourceMappingURL=test.js.map