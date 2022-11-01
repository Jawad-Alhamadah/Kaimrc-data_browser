import { json } from "body-parser";

//.....
const fs = require("fs");//mycomment
const readline = require("readline");

let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson.json")
//let list_of_lists: any = []
//let list_of_list_of_lists: any = []
let dot_counter=0;
let column_names =
  "ClinVar_sept_5_22_CLNSIG|ClinVar_sept_5_22_ID|num_samples|alt_allele_count|het_count|alt_allele_ratio|HGVSc|HGVSp|Consequence|POS|ClinVar_sept_5_22_CLNREVSTAT|Feature|ClinVar_sept_5_22|Consequence|rs_dbSNP|Feature|alt_count|HGVSc|5".toLowerCase();
let column_name_list = column_names.split(/\|/g);

let clinvar_names_gnomad: string = 'clinical_significance|clinvar_variation_id|an|ac|ac_hemi|af|hgvsc|hgvsp|major_consequence|pos|review_status|transcript_id|variant_id|consequence|rsids|transcript_id|ac_hom|hgvs|transcript_version'
let clinvar_names_list_gnomad: string[] = clinvar_names_gnomad.split(/\|/g)
let clinvar_names_list_gnomad_name: any = []
let mapping: any = {}
let jsonCount =0;
//clinvar_names_list_gnomad_name ["clinical_significance"]
for (let index = 0; index < clinvar_names_list_gnomad.length; index++) {
  //const element = array[index];
  clinvar_names_list_gnomad_name[clinvar_names_list_gnomad[index]] = column_name_list[index]
}
interface ClinvarVariant {
  clinical_significance: string,
  clinvar_variation_id: string,
  gnomad?: { exome: { ac: number, an: number, filters: string[] } | null, genome: { ac: number, an: number, filters: string[] } | null } | null,
  gold_stars: number,
  hgvsc: string,
  hgvsp: string,
  in_gnomad: true,
  major_consequence: string,
  pos: number,
  review_status: string,
  transcript_id: string,
  variant_id: string

}
interface Variant {
  consequence: string,
  flags: [],
  hgvs: string,
  hgvsc: string,
  hgvsp: string,
  lof: string|null,
  lof_filter: string|null,
  lof_flags: string|null,
  pos: number,
  rsids: string[],
  transcript_id: string,
  transcript_version: string,
  variant_id: string,
  exome: {
    ac: number,
    ac_hemi: number,
    ac_hom: number,
    an: number,
    af: number,
    filters: any[],
    populations: null
  }|null,
  genome: {
    ac: number,
    ac_hemi: number,
    ac_hom: number,
    an: number,
    af: number,
    filters: any[],
    populations: null
  }|null,
  lof_curation: null
}
interface GnomadDataJson { 
  data: { 
    meta: {}, 
    gene: { 
      clinvar_variants: ClinvarVariant[],
      variants:Variant[]
    
    } 
  } 
}

//let clinvar_variants: ClinvarVariant[] = []

async function processLineByLine() {
  const fileStream = fs.createReadStream(
    __dirname + "/genome_data_files/combined_annotated_VCF_allele_counts-Wed-Oct-26-2022_(_H1-M8-S50_)_1666735730388.txt"
  );
  //.......
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  //
  let first_line = true;
  let indices: number[] = Array();
  let count = 0
  //let cols = []
  console.time("time:")
  let json_structure :GnomadDataJson = { 
    data: { 
      meta: {}, 
      gene: { 
        clinvar_variants:[],
        variants:[] 
      
      } 
    } 
  }
  for await (const line of rl) {
   
    let row: string[] = line.split(/\t+/g);
    //row = row.map(e => e.trim())
    //row.splice(2400, row.length);
    if (first_line) {
      row.forEach((col_name: string, index: number) => {
        if (column_name_list.includes(col_name.toLowerCase())) indices.push(index);

      });
     
      for (let index = 0; index < indices.length; index++) {
        const element = row[indices[index]].toLowerCase();
        //console.log(element ," : ", indices[index])
        mapping[element] = indices[index]

      }
     // let filtered: string[] = row.filter((_: string, i: number) => indices.includes(i))
     
   
    //   row.forEach((e,i) =>{
    //    if(e.toLowerCase().includes('alt')) console.log(e)
 
    
    // })
    // break;

    }


    //let filtered: string[] = row.filter((_: string, i: number) => indices.includes(i))
    //  if(first_line) cols=[...row]
    first_line = false
   // list_of_lists.push(filtered)
    
    //feature_to_variantValue()

    let clinvar_variant: ClinvarVariant = {
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

    }
    //console.log(feature_to_variant_value("clinical_significance",row,clinvar_names_list_gnomad_name,indices))
    //feature_to_variant_value("clinical_significance", row, clinvar_names_list_gnomad_name, mapping)
   // clinvar_variants.push(clinvar_variant)
   
   let variant: Variant = {
  consequence: feature_to_variant_value("consequence", row, clinvar_names_list_gnomad_name, mapping),
  flags: [],
  hgvs: feature_to_variant_value("hgvs", row, clinvar_names_list_gnomad_name, mapping),
  hgvsc: feature_to_variant_value("hgvsc", row, clinvar_names_list_gnomad_name, mapping),
  hgvsp: feature_to_variant_value("hgvsp", row, clinvar_names_list_gnomad_name, mapping),
  lof:null,
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
    ac_hemi:Number(feature_to_variant_value("ac_hemi", row, clinvar_names_list_gnomad_name, mapping)),
    ac_hom: Number(feature_to_variant_value("ac_hom", row, clinvar_names_list_gnomad_name, mapping)),
    an: Number(feature_to_variant_value("an", row, clinvar_names_list_gnomad_name, mapping)) *2,
    af: Number(feature_to_variant_value("af", row, clinvar_names_list_gnomad_name, mapping)),
    filters: [],
    populations: null
  },
  lof_curation: null
  }

  variant.rsids.push(feature_to_variant_value("rsids", row, clinvar_names_list_gnomad_name, mapping))
  json_structure.data.gene.clinvar_variants.push(clinvar_variant)
  json_structure.data.gene.variants.push(variant)
   // console.log(json_structure.data.gene.clinvar_variants.length)
    count++
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
     if (count>=100000) {
     // list_of_list_of_lists.push(list_of_lists)
     // list_of_lists=[]
     count = 0;
     let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson"+jsonCount+".json")
      jsonCount++
     
      
      writeStream.write(JSON.stringify(json_structure,null,4));
      json_structure = { 
        data: { 
          meta: {}, 
          gene: { 
            clinvar_variants:[],
            variants:[] 
          
          } 
        } 
      }
      writeStream.end()
     // clinvar_variants =[]   
        //break;
    }



    // close the stream



  }
  
  //console.log(list_of_lists)


  if (json_structure.data.gene.clinvar_variants.length)  {
    let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson"+jsonCount+".json")
      jsonCount++
      writeStream.write(JSON.stringify(json_structure,null,4));
      writeStream.end()

  }
  
  //list_of_lists = []

  
   // writeStream.write(JSON.stringify(json_structure));
   
  writeStream.end()
  //console.log(clinvar_variants)

 
  console.timeEnd("time:")
 
  // the finish event is emitted when all data has been flushed from the stream
  // writeStream.on('finish', () => {
  //   console.log('wrote all data to file');

  // });


}
processLineByLine();

function feature_to_variant_value(feature: string, values_row: string[], clinvar_mapping: string[], indices_mapping: number[]) {
  //console.log(retrive_mapped_value(feature,clinvar_mapping))
  return values_row[retrive_mapped_value(retrive_mapped_value(feature, clinvar_mapping), indices_mapping)]

}
function retrive_mapped_value(name: string, map: any) {
  return map[name]
}