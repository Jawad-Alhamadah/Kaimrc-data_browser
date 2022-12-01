const fs = require("fs");//mycomment
const readline = require("readline");
import { GnomadDataJson } from "./interfaces"
import { Variant } from "../Classes/ClinvarDataClasses/Variant"
import { ClinvarVariant } from "../Classes//ClinvarDataClasses/ClinvarVariant"
import { VCF_FEATURES, GNOMAD_TO_VCF,GENE_CODE_GFT_FEATURES } from "./variables"
import { Request, Response } from "express"
import { GENECODE_TO_GNOMAD_REFERENCE } from "../../lib/Typescript_modules/variables"
import { Reference } from "../../lib/Classes/GeneReferenceDataClasses/Reference"
import { ReferenceTranscript } from "../../lib/Classes/GeneReferenceDataClasses/ReferenceTranscript"
import { ReferenceTranscriptExon } from "../../lib/Classes/GeneReferenceDataClasses/ReferenceTranscriptExon"
import { FileProcessError } from "../Classes/ErrorClasses/FileProcessError";
const RESPONSE_CODES = require("./responseCodes")
const ERROR_MESSAGES = require("./ErrorMessages")
const { promises: fsPromise } = require("fs");
import CMD from "../../cmd_libs/cmd_colors"

var path = require('path')
let jsonEntiresLimit: number = 100000

//this function processes the VCF file line by line and creates Json entries that mirror the Gnomad data
export async function processLineByLine(filePath: string, destination: string) {
   
    //  let vcf_to_gnomad_map: any = []
    console.time("time:")
    let vcfFeaturesToFilterIndicesDictionary: any = {}
    let isFirstLine: boolean = true;
    let vcfFilterIndices: number[] = [];
    let ensemblIdMap = {}
    let indexOfGeneFeature: number = 0;
    let prevEnsemblId: string = ""
    let prevSymbol: string = ""
    let dotCounter: number = 0
    let indexOfSymbol: number = 0
    let isRowOfFeatures: boolean = true
    let posJson: { [key: string]: number } = {}
    const readStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity,
    });

    //this is the general structure of the gnomad json files
    let gnomadJsonDataStructure: GnomadDataJson = {
        data: {
            meta: { clinvar_release_date: "2022-01-04" },
            gene: {
                clinvar_variants: [],
                variants: []

            }
        }
    }

    //forloop to read vcf file one line at a time
    for await (const line of rl) {
        //read the firstline and split it into one row of data entires
        // continue
        let row: string[] = line.split(/\t/g);
        let currentEnsemblId: string = row[indexOfGeneFeature]
        let currentSymbol: string = row[indexOfSymbol]

        vcfFilterIndices.forEach(index => {
            row[index] = row[index].trim()
            if (row[index] === '-')
                row[index] = "NA"
        })

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
            let allFeatures: string[] = row.map(feature => feature.toLowerCase())
            vcfFilterIndices = createFilterIndices(VCF_FEATURES, allFeatures)

            allFeatures.forEach((feature, i) => {
                if (feature === "symbol")
                    indexOfSymbol = i
                if (feature === "gene")
                    indexOfGeneFeature = i
            })

            let filteredVcfFeatures: string[] = vcfFilterIndices.map(value => allFeatures[value].toLowerCase())
            vcfFeaturesToFilterIndicesDictionary = createDictionary(filteredVcfFeatures, vcfFilterIndices)
            isRowOfFeatures = false
            continue

        }
        if (isFirstLine) {
            prevSymbol = currentSymbol
            prevEnsemblId = currentEnsemblId
            isFirstLine = false
        }
        if (row[indexOfSymbol] === 'NA') continue
        /* create variants and ClinvarVariant obejcts
           we use the row of data, and  gnomad to vcf, vcf to index dictonaries
           to get the information only using a string of the name of the gnomad fields as input.
        */
        dotCounter++
        if (dotCounter > 10000) {
            process.stdout.write(".")
            dotCounter = 0;
        }

        let clinvarVariant: ClinvarVariant =
            new ClinvarVariant(row, GNOMAD_TO_VCF, vcfFeaturesToFilterIndicesDictionary)
        let variant: Variant =
            new Variant(row, GNOMAD_TO_VCF, vcfFeaturesToFilterIndicesDictionary)

        gnomadJsonDataStructure.data.gene.clinvar_variants.push(clinvarVariant)
        gnomadJsonDataStructure.data.gene.variants.push(variant)
        posJson[clinvarVariant.symbol] = clinvarVariant.pos
        //console.log(JSON.stringify(gnomadJsonDataStructure, null, 4))
        //continue
        if (!(prevSymbol === currentSymbol)) {

            let writeStream = fs.createWriteStream(path.join(destination, `${prevSymbol}-${prevEnsemblId}.json`))
            writeStream.write(JSON.stringify(gnomadJsonDataStructure, null, 4));
            prevSymbol = currentSymbol
            prevEnsemblId = currentEnsemblId
            //empty json to avoid going over the limit of javascript variable size
            gnomadJsonDataStructure = { data: { meta: { clinvar_release_date: "2022-01-04" }, gene: { clinvar_variants: [], variants: [] } } }
            writeStream.end()
        }

    }
    let writePath: string = path.join(__dirname+"/../../", process.env.GENOME_DATA_FOLDER_UPLOAD)
    let writeStream = fs.createWriteStream(path.join(writePath, `${process.env.POS_FILE_STAMP}.json`))
    writeStream.write(JSON.stringify(posJson, null, 4));

    console.timeEnd("time:")

}


export async function processReferenceLinebyLine(filePath: string, destination: string, ) {
     //  let vcf_to_gnomad_map: any = []
        console.time("time:")
        let colors = [CMD.Red, CMD.Blue, CMD.Cyan, CMD.Green, CMD.Indigo, CMD.Magenta, CMD.Orange]
        let colorsCounter = 0
        let dotCounter: number = 0
        let reference: any = new Reference([], [])
        let transcripts: any[] = []
    
        //let geneReferenceFolder: string = path.join(__dirname+"/../../", <string>process.env.JSONS_GENE_REFRENCE_FOLDER)
       //console.log(geneReferenceFolder)
        let JsonsGeneReference: string[] = await getFilenamesFromDir(destination)//, res)

        for (const JSON_NAMES of JsonsGeneReference) {

            await deleteFile(null, null, path.join(destination, JSON_NAMES), JSON_NAMES, RESPONSE_CODES.SERVER_ERROR)
        }
        
        //command.match(/[^\/]+$/gm)![0]
        await doesFileExist(filePath)
        const readStream = fs.createReadStream(filePath);
        //console.log(readStream)
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity,
        });
        
        let typeIndex = 2
        //verification comment
        //another ver
        //forloop to read vcf file one line at a time
       
      
        for await (const line of rl) {

        
           //# is indicative of a comment
            if (line.includes('#')) continue

            let rowOfData :string[] = line.split(/\t/g);
            //rowOfData=[]
            if(rowOfData.length ==0) 
                throw new FileProcessError(ERROR_MESSAGES.CANT_PROCESS,RESPONSE_CODES.SERVER_ERROR)

            let type = rowOfData[typeIndex]
            
           // let rowOfData = line.split(/\t/g)

            let featuredElements: string[] = (<string>rowOfData.pop()).split(/;\s/g)
            let nonFeaturedElements: string[] = rowOfData

            let featuredElementsKeyValue = featuredElements.map(pair => {
                let data = pair.split(/\s+/g)
                return { key: data[0], value: data[1].replace(/"/g, "") }

            })
       
            let AllFeaturesKeyValue: any[] = []
            GENE_CODE_GFT_FEATURES.forEach((key: any, i) => {
                AllFeaturesKeyValue[key] = nonFeaturedElements[i]
            })

            featuredElementsKeyValue.forEach((pair: any, i) => {
                AllFeaturesKeyValue[pair.key] = pair.value
            })
   

            switch (type) {
                case "gene":
                    reference.pushTranscripts(transcripts)
                    if (reference.symbol) {
                        if (reference.symbol.includes("/"))
                            reference.symbol = reference.symbol.replace(/\//g, '-')
                    }
                    let JsonData = { data: { gene: reference } }
                    let writeStream = fs.createWriteStream(path.join(destination, `${reference.symbol}.json`))
                    writeStream.write(JSON.stringify(JsonData, null, 4));
                    writeStream.end()
                    reference = new Reference(GENECODE_TO_GNOMAD_REFERENCE, AllFeaturesKeyValue)
                    transcripts = []
                    break
                case "transcript":

                    transcripts.push(new ReferenceTranscript(GENECODE_TO_GNOMAD_REFERENCE, AllFeaturesKeyValue))

                    break
                case "CDS":
                case "start_codon":
                case "UTR":
                case "exon":
                case "stop_codon":
                    const EXON = new ReferenceTranscriptExon(GENECODE_TO_GNOMAD_REFERENCE, AllFeaturesKeyValue)
                    transcripts[transcripts.length - 1].exons.push(EXON)
                    reference.exons.push(EXON)
                    break
            }

            colorsCounter++
            if (colorsCounter > 6) colorsCounter = 0
            //console.log("\n")
            dotCounter++
            if (dotCounter > 10000) {
                process.stdout.write('. ')
                dotCounter = 0;
            }

        }
        
    
   
    console.timeEnd("time:")
    return ""
}


export async function processCoverageLineByLine(filePath: string, destination: string) {
    //let keyValuePair: any = []
    //let symbols = vcfJsons.map(filename => filename.split("-")[0])
    //symbols.forEach(e => keyValuePair[e] = 0)
   // symbols.forEach((e: string) => console.log(keyValuePair[e]))
    //console.log(keyValuePair)
    const GENE_FOLDER:string =  path.join(__dirname+"/../../",process.env.GENOME_DATA_FOLDER_UPLOAD)
    const DATA_FILES:string[] = await getFilenamesFromDir(GENE_FOLDER)
    let posFilename:string =''
    DATA_FILES.forEach(FILE =>{
        let isPosFile:boolean = FILE.includes(<string>process.env.POS_FILE_STAMP)
        if(isPosFile){
            posFilename = FILE
            return
        }
    })  
    let posJson = await fsPromise.readFile( path.join(GENE_FOLDER,posFilename))
    let firstLine:boolean = true
    const readStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
         input: readStream,
         crlfDelay: Infinity,
    });
    for await (const line of rl){
        if (firstLine)
        {
            console.log(line.split(/\t/g))
            firstLine = false
        }

    }

    //console.log(JSON.parse(posJson))

}
//this function creates a dictonary given a set of keys and values
export function createDictionary(keysList: any, valuesList: any) {
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

export async function deleteFile(req: Request|null, res: Response|null, path: string, filename: string, errorCode?: number) {
    try {
      //  console.log(CMD.Red(`File Deleted : ${filename} --- ${getTimestamp()}`))
        await fsPromise.unlink(path)
    }
    catch (error) {
       // res.status(errorCode ? errorCode : 500).send()
        console.log(CMD.Red(`error in deleting the filenames from ${path} function :deleteFile  \n`), error);
        throw new FileProcessError(ERROR_MESSAGES.CANT_DELETE, RESPONSE_CODES.SERVER_ERROR)
    }

}

function getTimestamp() {

    let today: Date = new Date(Date.now())
    let todayStr: string = today.toDateString().replace(/\s/g, "-")
    let hours = today.getHours() > 12 ? today.getHours() - 12 : today.getHours()
    let minutes = today.getMinutes()
    let seconds = today.getSeconds()
    //let timestamp = Date.now()
    const TIME_IN_HH_MM_SS = ` - ${hours}:${minutes}:${seconds}`

    return `${todayStr}_${TIME_IN_HH_MM_SS}`
}




export async function getFilenamesFromDir(dir: string, res?: Response, errorCode?: number) {
    try {

        return await fsPromise.readdir(dir);
    } catch (error:any) {
       // console.log(error.stack)
        console.log(CMD.Red(`error in reading the filenames from ${dir} function : getFileNamesFromDir \n`), error)
        throw new FileProcessError(ERROR_MESSAGES.CANT_READ_FILE, RESPONSE_CODES.SERVER_ERROR)
    }
}

async function doesFileExist(path:string){
    try{
        await fsPromise.access(path, fs.F_OK)
    }
    catch(error){
        console.log(CMD.Red(`error in reading the file in :  ${path} function . : doesFileExist \n`), error)
        throw new FileProcessError(ERROR_MESSAGES.FILE_NOT_EXIST,RESPONSE_CODES.SERVER_ERROR)
    }
}