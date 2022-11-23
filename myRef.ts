const fs = require("fs");//mycomment
const readline = require("readline");

import { gftFeatures,gftToReference } from "./lib/Typescript_modules/variables"
import { Errback, Request, Response } from "express"
const { promises: fsPromise } = require("fs");
import { Reference } from "./lib/Classes/GeneReferenceDataClasses/Reference";
import { ReferenceTranscript } from "./lib/Classes/GeneReferenceDataClasses/ReferenceTranscript";
import { ReferenceTranscriptExon } from "./lib/Classes/GeneReferenceDataClasses/ReferenceExon";
import CMD from "./cmd_libs/cmd_colors"
var path = require('path')
let colorsCounter = 0

let colors = [CMD.Red,CMD.Blue,CMD.Cyan,CMD.Green,CMD.Indigo,CMD.Magenta,CMD.Orange]
export async function processLineByLine(filePath: string) {
   try{ //  let vcf_to_gnomad_map: any = []
    console.time("time:")
    let isFirstLine: boolean = true;

    let indexOfGeneFeature:number= 0;
    let dotCounter:number  = 0
    let indexOfSymbol:number = 0
    let newRef: any = new Reference([],[])
    let newTrans:any[]=[]
    let listOfRowLengths:number[]=[]
    const readStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity,
    });
    let features = ['chrom','source','feature_type','start','end','score','strand','frame']
    let typeIndex = 2
    //verification comment
    //another ver
    //forloop to read vcf file one line at a time
    for await (const line of rl) {
        let gnomadJsonDataStructure = {
            data: {
                meta: {clinvar_release_date: "2022-01-04"},
                gene: {
                    variants: []
                }
            }
        }

        //read the firstline and split it into one row of data entires
        let row: string[] = line.split(/\t/g);
        let type = row[typeIndex]
        if(line.includes('#')) continue
        let no_feature_List:string[] = line.match(/.*(?=gene_id)/g)
        let featured_List:string[] = line.split(/.*(?=gene_id)/g)
        //console.log("no feature",featured_List)
        no_feature_List = no_feature_List? no_feature_List[0].split(/\t/g) : ["N/A"]
        featured_List= featured_List? featured_List[1].split(/;\s+/) : ["NA"]
       // let row: string[] = line.split(/\t+/g)
        listOfRowLengths.push(row.length)

        //e is not returning itself here. Rather, e is acting like an expression
        let filtered_no_feature = no_feature_List.filter(e => e) 
        let filtered_featured = featured_List.filter(e => e) 
        let noComma = filtered_featured.map(e => e.replace(/[,;]/g,""))
        
         let featuredKeyValue = noComma.map( pair =>({key:pair.split(/\s+/g)[0], value:pair.split(/\s+/g)[1] }) )
        // for (let i = 0; i < 10; i++) {
        //     const pair = noComma[i];
           //  console.log(noComma);

        // }featured_List
      //  console.log("keyvalue: ",featuredKeyValue)
        //console.log('just value', no_feature_List)
        let completeList: any[] =[]
        features.forEach((key:any,i) =>{
            completeList[key] = no_feature_List[i]
        })

        featuredKeyValue.forEach((pair:any,i) =>{
            completeList[pair.key] = pair.value.replace(/["]/g,"")
        })
        //if(!line.includes("level")) console.log("no hgnc")
         
       // let newExon = new ReferenceTranscriptExon()
       // newRef.transcripts[0].exons.push(newExon)
       // console.log(JSON.stringify(newRef, null, 4))

        switch(type){
            
            case "gene":
                
                newRef.pushTranscripts(newTrans)
                console.log(JSON.stringify(newRef, null, 4))
               
                newRef = new Reference (gftToReference,completeList)
                newTrans=[]
                break
            case "transcript":

                newTrans.push(new ReferenceTranscript(gftToReference,completeList))
               // console.log(newTrans)
               // console.log(colors[0]("transcript : "), colors[1](JSON.stringify(newRef, null, 4)))
                break
            case "CDS":
            case "start_codon":
            case "UTR":
            case "exon":
            case "stop_codon":
                newTrans[newTrans.length-1].exons.push(new ReferenceTranscriptExon(gftToReference,completeList))
               // console.log(newTrans)
              //  console.log(colors[0]("Mix : "), colors[1](JSON.stringify(newRef, null, 4)))
                break         
        }
        //console.log(newTrans)
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
        colorsCounter++
        if(colorsCounter>6) colorsCounter= 0
        console.log("\n")
       dotCounter++
       if(dotCounter>1000){
        break
       // dotCounter = 0;
       }

    }

   }
   catch(err){console.log(err)}
    console.timeEnd("time:")
}

//given two lists, this function returns a filter list
//that contains indices where both values match.
function createFilterIndices(baseList: any[], elements: any[]) {
    let indices: number[] = []
    elements.forEach((value: string, index: number) => {
        if (baseList.includes(value)) indices.push(index);

    });
    return indices

}

function createDictionary(keysList: any, valuesList: any) {
    let mapDict: any = {}
    for (let i = 0; i < valuesList.length; i++) {
        const key: string = keysList[i]
        mapDict[key] = valuesList[i]

    }
    return mapDict
}

let foldername = path.join(__dirname,"genome_data_files")
processLineByLine(path.join(foldername,"gencode.v38.annotation.gtf"))

