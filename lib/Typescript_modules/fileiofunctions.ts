const fs = require("fs");//mycomment
const readline = require("readline");
import { GnomadDataJson } from "./Interfaces"
import { Variant } from "../Classes/Variant"
import { ClinvarVariant } from "../Classes/ClinvarVariant"
import { vcfFeatures, GnomadFeaturesToVcfDictionary } from "./variables"
import { Errback, Request, Response } from "express"
const { promises: fsPromise } = require("fs");

var path = require('path')
let jsonEntiresLimit: number = 100000

//this function processes the VCF file line by line and creates Json entries that mirror the Gnomad data
export async function processLineByLine(filePath: string, destination: string) {
    //  let vcf_to_gnomad_map: any = []
    console.time("time:")
    let vcfFeaturesToFilterIndicesDictionary: any = {}
    let jsonFilesCount: number = 0;
    let isFirstLine: boolean = true;
    let vcfFilterIndices: number[] = [];
    let jsonEntriesCount: number = 0
    let ensemblIdMap = {}
    let indexOfGeneFeature:number= 0;
    let prevEnsemblId :string =""
    let prevSymbol:string = ""
    let dotCounter:number  = 0
    let indexOfSymbol:number = 0
    let isRowOfFeatures:boolean =true
    let listOfRowLengths:number[]=[]
    const readStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity,
    });

    //this is the general structure of the gnomad json files
    let gnomadJsonDataStructure: GnomadDataJson = {
        data: {
            meta: {clinvar_release_date: "2022-01-04"},
            gene: {
                clinvar_variants: [],
                variants: []

            }
        }
    }
    
    //forloop to read vcf file one line at a time
    for await (const line of rl) {
        //read the firstline and split it into one row of data entires
        let row: string[] = line.split(/\t/g);
       // let row: string[] = line.split(/\t+/g)
        listOfRowLengths.push(row.length)
        let currentEnsemblId:string = row[indexOfGeneFeature]
        let currentSymbol:string = row[indexOfSymbol]
        let tempRow =row.map(value =>{
            if (value==="-") {return "NA"}
            else {return value.trim()}
        })
        row = tempRow
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
            let allFeatures : string[] = row.map(feature =>feature.toLowerCase())
            vcfFilterIndices = createFilterIndices(vcfFeatures, allFeatures)
            
            allFeatures.forEach((feature,i)=> {
                if(feature==="symbol") 
                    indexOfSymbol = i
                if(feature==="gene")
                    indexOfGeneFeature = i  
            })
           
            let filteredVcfFeatures :string [] = vcfFilterIndices.map(value => allFeatures[value].toLowerCase())
            vcfFeaturesToFilterIndicesDictionary = createDictionary(filteredVcfFeatures, vcfFilterIndices)
            isRowOfFeatures = false
            continue
            
        }
        if(isFirstLine){
            prevSymbol=currentSymbol
            prevEnsemblId=currentEnsemblId
            isFirstLine=false
        }
           
        

        /* create variants and ClinvarVariant obejcts
           we use the row of data, and  gnomad to vcf, vcf to index dictonaries
           to get the information only using a string of the name of the gnomad fields as input.

        */
        dotCounter++
       if(dotCounter>10000){
        process.stdout.write(".")
        dotCounter = 0;
       }
       //continue
        let clinvarVariant: ClinvarVariant =
            new ClinvarVariant(row, GnomadFeaturesToVcfDictionary, vcfFeaturesToFilterIndicesDictionary)
        let variant: Variant =
            new Variant(row, GnomadFeaturesToVcfDictionary, vcfFeaturesToFilterIndicesDictionary)
        gnomadJsonDataStructure.data.gene.clinvar_variants.push(clinvarVariant.toJson())
        gnomadJsonDataStructure.data.gene.variants.push(variant.toJson())
        jsonEntriesCount++
       
        // //this if statment is to write the json file once our entries reach the limit of 
        // //javascript variable size.
        
        if (!(prevSymbol === currentSymbol)) {
           // jsonEntriesCount = 0;
          //  jsonFilesCount++
            //let writeStream = fs.createWriteStream(path.join(destination, `myjson${jsonFilesCount}.json`))
            let writeStream = fs.createWriteStream(path.join(destination, `${prevSymbol}-${prevEnsemblId}.json`))
            writeStream.write(JSON.stringify(gnomadJsonDataStructure, null, 4));
            prevSymbol = currentSymbol
            prevEnsemblId=currentEnsemblId
            //empty json to avoid going over the limit of javascript variable size
            gnomadJsonDataStructure = { data: { meta: {clinvar_release_date: "2022-01-04"}, gene: { clinvar_variants: [], variants: [] } } }
            writeStream.end()
        }

//////


    }

    //we make sure the last bit of data that didn't quite reach the limit is still written to a file
    // if (gnomadJsonDataStructure.data.gene.clinvar_variants.length) {
    //   //  let writeStream = fs.createWriteStream(path.join(destination, `myjson${jsonFilesCount}.json`))
    //    let writeStream = fs.createWriteStream(path.join(destination, `${prevSymbol}.json`) )
    //    // jsonFilesCount++
    //     writeStream.write(JSON.stringify(gnomadJsonDataStructure, null, 4));
    //     writeStream.end()

    // }
    // writeStream.end()
    // for (let index = 0; index < listOfRowLengths.length; index++) {
    //     let numb = listOfRowLengths[index]
    //     process.stdout.write("_")
    //     process.stdout.write(numb.toString())
       
    // }
    console.timeEnd("time:")

}

//this function creates a dictonary given a set of keys and values
function createDictionary(keysList: any, valuesList: any) {
    let mapDict: any = {}
    for (let i = 0; i < valuesList.length; i++) {
        const key: string = keysList[i]
        mapDict[key] = valuesList[i]

    }
    return mapDict
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

export async function deleteFile(req: Request, res: Response, path: string, errorCode?: number) {
    try {
        await fsPromise.unlink(path)
    }
    catch (error) {
        res.status(errorCode ? errorCode : 500).send()
        console.log("couldn't delete File")
        throw error
    }

}