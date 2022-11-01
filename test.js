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
//.....
const fs = require("fs"); //mycomment
const readline = require("readline");
let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson.json");
//let list_of_lists: any = []
//let list_of_list_of_lists: any = []
let dot_counter = 0;
let column_names = "ClinVar_sept_5_22_CLNSIG|ClinVar_sept_5_22_ID|num_samples|alt_allele_count|het_count|alt_allele_ratio|HGVSc|HGVSp|Consequence|POS|ClinVar_sept_5_22_CLNREVSTAT|Feature|ClinVar_sept_5_22|Consequence|rs_dbSNP|Feature|alt_count|HGVSc|5".toLowerCase();
let column_name_list = column_names.split(/\|/g);
let clinvar_names_gnomad = 'clinical_significance|clinvar_variation_id|an|ac|ac_hemi|af|hgvsc|hgvsp|major_consequence|pos|review_status|transcript_id|variant_id|consequence|rsids|transcript_id|ac_hom|hgvs|transcript_version';
let clinvar_names_list_gnomad = clinvar_names_gnomad.split(/\|/g);
let clinvar_names_list_gnomad_name = [];
let mapping = {};
let jsonCount = 0;
//clinvar_names_list_gnomad_name ["clinical_significance"]
for (let index = 0; index < clinvar_names_list_gnomad.length; index++) {
    //const element = array[index];
    clinvar_names_list_gnomad_name[clinvar_names_list_gnomad[index]] = column_name_list[index];
}
//let clinvar_variants: ClinvarVariant[] = []
function processLineByLine() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const fileStream = fs.createReadStream(__dirname + "/genome_data_files/combined_annotated_VCF_allele_counts-Wed-Oct-26-2022_(_H1-M8-S50_)_1666735730388.txt");
        //.......
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        //
        let first_line = true;
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
        try {
            for (var rl_1 = __asyncValues(rl), rl_1_1; rl_1_1 = yield rl_1.next(), !rl_1_1.done;) {
                const line = rl_1_1.value;
                let row = line.split(/\t+/g);
                //row = row.map(e => e.trim())
                //row.splice(2400, row.length);
                if (first_line) {
                    row.forEach((col_name, index) => {
                        if (column_name_list.includes(col_name.toLowerCase()))
                            indices.push(index);
                    });
                    for (let index = 0; index < indices.length; index++) {
                        const element = row[indices[index]].toLowerCase();
                        //console.log(element ," : ", indices[index])
                        mapping[element] = indices[index];
                    }
                    // let filtered: string[] = row.filter((_: string, i: number) => indices.includes(i))
                    //   row.forEach((e,i) =>{
                    //    if(e.toLowerCase().includes('alt')) console.log(e)
                    // })
                    // break;
                }
                //let filtered: string[] = row.filter((_: string, i: number) => indices.includes(i))
                //  if(first_line) cols=[...row]
                first_line = false;
                // list_of_lists.push(filtered)
                //feature_to_variantValue()
                let clinvar_variant = {
                    clinical_significance: feature_to_variant_value("clinical_significance", row, clinvar_names_list_gnomad_name, mapping),
                    clinvar_variation_id: feature_to_variant_value("clinvar_variation_id", row, clinvar_names_list_gnomad_name, mapping),
                    gnomad: null,
                    gold_stars: 1,
                    hgvsc: feature_to_variant_value("hgvsc", row, clinvar_names_list_gnomad_name, mapping),
                    hgvsp: feature_to_variant_value("hgvsp", row, clinvar_names_list_gnomad_name, mapping),
                    in_gnomad: true,
                    major_consequence: feature_to_variant_value("major_consequence", row, clinvar_names_list_gnomad_name, mapping),
                    pos: Number(feature_to_variant_value("pos", row, clinvar_names_list_gnomad_name, mapping)),
                    review_status: feature_to_variant_value("review_status", row, clinvar_names_list_gnomad_name, mapping),
                    transcript_id: feature_to_variant_value("transcript_id", row, clinvar_names_list_gnomad_name, mapping),
                    variant_id: feature_to_variant_value("variant_id", row, clinvar_names_list_gnomad_name, mapping)
                };
                //console.log(feature_to_variant_value("clinical_significance",row,clinvar_names_list_gnomad_name,indices))
                //feature_to_variant_value("clinical_significance", row, clinvar_names_list_gnomad_name, mapping)
                // clinvar_variants.push(clinvar_variant)
                let variant = {
                    consequence: feature_to_variant_value("consequence", row, clinvar_names_list_gnomad_name, mapping),
                    flags: [],
                    hgvs: feature_to_variant_value("hgvs", row, clinvar_names_list_gnomad_name, mapping),
                    hgvsc: feature_to_variant_value("hgvsc", row, clinvar_names_list_gnomad_name, mapping),
                    hgvsp: feature_to_variant_value("hgvsp", row, clinvar_names_list_gnomad_name, mapping),
                    lof: null,
                    lof_filter: null,
                    lof_flags: null,
                    pos: Number(feature_to_variant_value("pos", row, clinvar_names_list_gnomad_name, mapping)),
                    rsids: [],
                    transcript_id: feature_to_variant_value("transcript_id", row, clinvar_names_list_gnomad_name, mapping),
                    transcript_version: feature_to_variant_value("transcript_version", row, clinvar_names_list_gnomad_name, mapping),
                    variant_id: feature_to_variant_value("variant_id", row, clinvar_names_list_gnomad_name, mapping),
                    exome: null,
                    genome: {
                        ac: Number(feature_to_variant_value("ac", row, clinvar_names_list_gnomad_name, mapping)),
                        ac_hemi: Number(feature_to_variant_value("ac_hemi", row, clinvar_names_list_gnomad_name, mapping)),
                        ac_hom: Number(feature_to_variant_value("ac_hom", row, clinvar_names_list_gnomad_name, mapping)),
                        an: Number(feature_to_variant_value("an", row, clinvar_names_list_gnomad_name, mapping)) * 2,
                        af: Number(feature_to_variant_value("af", row, clinvar_names_list_gnomad_name, mapping)),
                        filters: [],
                        populations: null
                    },
                    lof_curation: null
                };
                variant.rsids.push(feature_to_variant_value("rsids", row, clinvar_names_list_gnomad_name, mapping));
                json_structure.data.gene.clinvar_variants.push(clinvar_variant);
                json_structure.data.gene.variants.push(variant);
                // console.log(json_structure.data.gene.clinvar_variants.length)
                count++;
                // dot_counter++
                // if (dot_counter >= 5000) {
                //  process.stdout.write(".")
                //  dot_counter=0;
                // }
                // if (clinvar_variants.length>=500) {
                //   json_structure.data.gene.clinvar_variants.push(...clinvar_variants)
                //   clinvar_variants =[]   
                //     //break;
                // }list_of_list_of_lists
                if (count >= 100000) {
                    // list_of_list_of_lists.push(list_of_lists)
                    // list_of_lists=[]
                    count = 0;
                    let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson" + jsonCount + ".json");
                    jsonCount++;
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
                    // clinvar_variants =[]   
                    //break;
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
        //console.log(list_of_lists)
        if (json_structure.data.gene.clinvar_variants.length) {
            let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson" + jsonCount + ".json");
            jsonCount++;
            writeStream.write(JSON.stringify(json_structure, null, 4));
            writeStream.end();
        }
        //list_of_lists = []
        // writeStream.write(JSON.stringify(json_structure));
        writeStream.end();
        //console.log(clinvar_variants)
        console.timeEnd("time:");
    });
}
processLineByLine();
function feature_to_variant_value(feature, values_row, clinvar_mapping, indices_mapping) {
    //console.log(retrive_mapped_value(feature,clinvar_mapping))
    return values_row[retrive_mapped_value(retrive_mapped_value(feature, clinvar_mapping), indices_mapping)];
}
function retrive_mapped_value(name, map) {
    return map[name];
}
