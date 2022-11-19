//import { json } from "body-parser";
import { GnomadDataJson } from "./lib/Typescript_modules/Interfaces"
//.....
import CMD from "./cmd_libs/cmd_colors"
import { Variant } from "./lib/Classes/Variant"
import { ClinvarVariant } from "./lib/Classes/ClinvarVariant"
import {vcfFeatures,gnomadFieldnames} from "./lib/Typescript_modules/variables"
const fs = require("fs");//mycomment
const readline = require("readline");

let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson.json")
let dot_counter = 0;

//let vcf_feature_string =
  //"ClinVar_sept_5_22_CLNSIG|ClinVar_sept_5_22_ID|num_samples|alt_allele_count|het_count|alt_allele_ratio|HGVSc|HGVSp|Consequence|POS|ClinVar_sept_5_22_CLNREVSTAT|Feature|ClinVar_sept_5_22|Consequence|rs_dbSNP|Feature|alt_count|HGVSc|5".toLowerCase();
//let vcf_features = vcf_feature_string.split(/\|/g);

//let gnomad_fields_str: string = 'clinical_significance|clinvar_variation_id|an|ac|ac_hemi|af|hgvsc|hgvsp|major_consequence|pos|review_status|transcript_id|variant_id|consequence|rsids|transcript_id|ac_hom|hgvs|transcript_version'
//let gnomad_fieldnames: string[] = gnomad_fields_str.split(/\|/g)
let vcf_to_gnomad_map: any = []
let mapping: any = {}
let jsonCount = 0;

for (let index = 0; index < gnomadFieldnames.length; index++) {
  vcf_to_gnomad_map[gnomadFieldnames[index]] = vcfFeatures[index]
}
let prevId :string =""
async function processLineByLine() {

  const fileStream = fs.createReadStream(
    __dirname + "/genome_data_files/combined_annotated_VCF_allele_counts-Tue-Nov-15-2022_(_10H-58M-57S_)_1668542337171.txt"
  );
  //.......
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  //
  let is_first_line = true;
  let indices: number[] = Array();
  let count = 0
  //let cols = []
  console.time("time:")
  let json_structure: GnomadDataJson = {
    data: {
      meta: {},
      gene: {
        clinvar_variants: [],
        variants: []

      }
    }
  }
  let geneNum:number =0
  let geneIdMapping = {}
  let myList:any =[]
  let inxmyList:any =[]
  let featureCounter = 0
  let mylist :any = []
  for await (const line of rl) {
    
    let row: string[] = line.split(/\t+/g);
    //row = row.map(e => e.trim())
    //row.splice(2400, row.length);
    
    if (is_first_line) {
      row.forEach((col_name: string, index: number) => {
        if (vcfFeatures.includes(col_name.toLowerCase())) indices.push(index);
        if(col_name.toLowerCase()==="gene") geneNum = index
        
      });

      for (let index = 0; index < indices.length; index++) {
        let key =indices[index]
        const element = row[key].toLowerCase();
        //console.log(element ," : ", indices[index])
        mapping[element] = key

      }
      
      // row.forEach( e =>  { if( e.toLowerCase().includes("hg") ) console.log(e) })
      // break;
      row.forEach((col_name: string, index: number) => {
        if (vcfFeatures.includes(col_name.toLowerCase())) indices.push(index);
  
      });
      
      //print columns
      let searchTerms = "hgv"
      let searchList = searchTerms.split(/\|/g);
      mylist =searchAndCreateKeyValuePairs(row, searchList)
      is_first_line = false
     // break
      continue
    }
    // if(row.includes("DDX11L1")){
    //   console.log("entry num : " , count)
    //   featureCounter++;
    // }
    
    mylist.forEach((ele:any)=>{
      console.log(CMD.Red("col_name: ")+CMD.Blue(ele.colName)+CMD.Red(" value: ")+CMD.Blue(row[ele.index]))
  
    })

    console.log("................ ")
    console.log("................ ")
    console.log("................ ")
   
     
   
    // let clinvar_variant: ClinvarVariant = new ClinvarVariant(row, vcf_to_gnomad_map, mapping)
    // let variant: Variant = new Variant(row, vcf_to_gnomad_map, mapping)
    // json_structure.data.gene.clinvar_variants.push(clinvar_variant.toJson())
    // json_structure.data.gene.variants.push(variant.toJson())
   

    count++
    dot_counter++
    if (dot_counter >= 10000) {
      process.stdout.write(".")
      dot_counter = 0;
   let searchTerms = "ref|alt|ense|symbol|position|chr|var|existing_variation|chrom|hgv"
      let searchList = searchTerms.split(/\|/g);
      searchAndCreateKeyValuePairs(row, searchList)
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
    if (! (prevId===row[geneNum]) ) {
      
      continue
     // console.log(geneIdMapping)
      count = 0;
      let writeStream = fs.createWriteStream(__dirname + "/json_files/" + prevId + ".json")
      jsonCount++
      prevId = row[geneNum]


      writeStream.write(JSON.stringify(json_structure, null, 4));
      json_structure = {
        data: {
          meta: {},
          gene: {
            clinvar_variants: [],
            variants: []

          }
        }
      }
      writeStream.end()

    }

  }
  console.log(featureCounter)
  //console.log(geneIdMapping.length)
  if (json_structure.data.gene.clinvar_variants.length) {
    let writeStream = fs.createWriteStream(__dirname + "/json_files/"+prevId+ ".json")
    jsonCount++
    writeStream.write(JSON.stringify(json_structure, null, 4));
    writeStream.end()

  }
  writeStream.end()

  console.timeEnd("time:")

}

function searchAndCreateKeyValuePairs(values: string[], searchList: string[]) {
  let list:any =[]
  values.forEach((col_name, i) => {
    searchList.forEach(key => {
      if (col_name.toLowerCase().includes(key)) {
        // myList.push({colName :col_name, value:})
        list.push({ colName: col_name, index: i })
      }
    })


  })
 
  return list
}

function getIndexFilter (stringOfElements:string){
  return 
}
processLineByLine();

