const fs = require("fs");//mycomment
const readline = require("readline");
import { GnomadDataJson } from "./Interfaces"
import { Variant } from "../Classes/Variant"
import { ClinvarVariant } from "../Classes/ClinvarVariant"
import {  vcfFeatures, gnomadFieldnames, GnomadToVcfMap } from "./variables"


export async function processLineByLine(filePath : string ,destination: string) {
  //  let vcf_to_gnomad_map: any = []
    let vcfFeaturesToFilteredIndexMap: any = {}
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
    let vcfFilterIndices: number[] = Array();
    let count = 0
    //let cols = []
    console.time("time:")
    let jsonStructure: GnomadDataJson = {
        data: {
            meta: {},
            gene: {
                clinvarVariants: [],
                variants: []

            }
        }
    }
    for await (const line of rl) {

        let row: string[] = line.split(/\t+/g);
        //row = row.map(e => e.trim())
        //row.splice(2400, row.length);
        if (isFirstLine) {
            let allFeatures = row
            vcfFilterIndices = createdFilteredIndicesFromStringLists(vcfFeatures,allFeatures)
            // row.forEach((feature: string, index: number) => {
            //     if (vcfFeatures.includes(feature.toLowerCase())) vcfFilterIndices.push(index);

            // });
            let filteredVcfFeatures = vcfFilterIndices.map(value =>allFeatures[value])
            let vcfFeaturesToFilteredIndexMap= createDictionary(filteredVcfFeatures,vcfFilterIndices)
           
            console.log(GnomadToVcfMap)
            //console.log(filteredVcfFeatures)
            console.log(vcfFeaturesToFilteredIndexMap)
           // console.log(vcfFilterIndices)
            // row.forEach( e =>  { if( e.toLowerCase().includes("hg") ) console.log(e) })
            // break;
        }

        isFirstLine = false

        let clinvarVariant: ClinvarVariant = new ClinvarVariant(row, GnomadToVcfMap, vcfFeaturesToFilteredIndexMap)
        let variant: Variant = new Variant(row, GnomadToVcfMap, vcfFeaturesToFilteredIndexMap)
        jsonStructure.data.gene.clinvarVariants.push(clinvarVariant.toJson())
        jsonStructure.data.gene.variants.push(variant.toJson())
        count++
        // dot_counter++
        // if (dot_counter >= 5000) {
        //   process.stdout.write(".")
        //   dot_counter = 0;

        // }

        if (count >= 100000) {

            count = 0;
            let writeStream =  fs.createWriteStream(destination)
            //fs.createWriteStream(__dirname + "/json_files/myjson" + jsonCount + ".json")
            jsonCount++


            writeStream.write(JSON.stringify(jsonStructure, null, 4));
            jsonStructure = {
                data: {
                    meta: {},
                    gene: {
                        clinvarVariants: [],
                        variants: []

                    }
                }
            }
            writeStream.end()

        }

    }

    if (jsonStructure.data.gene.clinvarVariants.length) {
        let writeStream = fs.createWriteStream(__dirname + "/json_files/myjson" + jsonCount + ".json")
        jsonCount++
        writeStream.write(JSON.stringify(jsonStructure, null, 4));
        writeStream.end()

    }
   // writeStream.end()

    console.timeEnd("time:")

}


function createDictionary(keysList:any,valuesList:any){
    let mapDict:any ={}
    for (let i = 0; i < valuesList.length; i++) {
        const key :string= keysList[i]
        mapDict[key.toLowerCase()] = valuesList[i]

    }
    return mapDict
}
function createdFilteredIndicesFromStringLists(baseList:string[],elementsToFilterList:any[]){
    let indices:number[] = [] 
    elementsToFilterList.forEach((value: string, index: number) => {
        if (baseList.includes(value.toLowerCase())) indices.push(index);

    });
    return indices
    
}