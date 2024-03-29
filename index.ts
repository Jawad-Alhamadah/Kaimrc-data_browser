import { Errback, Request, Response } from "express"
require('dotenv').config()
import CMD from "./cmd_libs/cmd_colors"
import express from 'express'
let app = express();
const util = require('util');
//const { exec } = require("child_process");
const exec = util.promisify(require('child_process').exec)
import bodyParser, { json } from 'body-parser'
//import fs, { PathLike } from 'fs'
const { promises: fs } = require("fs");
let fsRename = util.promisify(fs.rename)
//let fsReadDir = util.promisify(fs.readdir)
import { processLineByLine ,deleteFile } from "./lib/Typescript_modules/fileiofunctions"
import axios from 'axios'
let responseCode = require("./lib/Typescript_modules/responseCodes")
var path = require('path')
const multer = require("multer")
let port: number = 5000;
let refNum:string = ""
//
interface MulterRequest extends Request {
    file: any;
}

let storage = multer.diskStorage({

    destination: function (req: Request, file: any, cb: any) {

        // Uploads is the Upload_folder_name
        cb(null, path.join(__dirname, process.env.UPLOAD_FOLDER_NAME_GENOME))
    },
    filename: function (req: Request, file: any, cb: any) {
        let filename = timestampFilename(file.originalname)
        cb(null, filename)
    }
})

let upload = multer({
    storage: storage,
    fileFilter: function (req: Request, file: any, cb: any) {
        // Set the filetypes, it is optional
        let filetypesRegex = /txt|bam|bai|cram/;
        let extname = filetypesRegex.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(`Error: File upload only supports the following filetypes - ${filetypesRegex}`);
    }
}).single("myFile")



app.use(express.static(__dirname + "/public"))
app.use(function (req: Request, res: Response, next: any) {
    res.setHeader('Access-Control-Allow-Origin', ["https://app.terra.bio","https://localhost:8008","https://localhost:5000","https://*"]);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.json())

app.post('/download-file', async function (req: Request, res: Response) {
    let terraUploadFoldername: string = process.env.UPLOAD_FOLDER_NAME_TERA || "uploads"
    let { execError, stdout, stderr } = await exec(`${req.body.text} ./${terraUploadFoldername}`)
    let command: string = req.body.text
    if (execError) {
        console.log(`error: ${execError.message}`);
        res.status(500).send("error while downloading the")
    }
    if (stderr) {

        let oldFileName : string = getFilenameFromGSutil(command);
        let oldFilePath : string = path.join(path.join(__dirname,terraUploadFoldername),oldFileName) 
        let stampedFilename: string = timestampFilename(oldFileName)
        let stampedFilePath :string = path.join(path.join(__dirname,terraUploadFoldername),stampedFilename) 
        let renameError = await fsRename(oldFilePath, stampedFilePath)
        if (renameError) throw renameError

        // res.send('File Saved');   
    }
    // console.log(`stdout: ${stdout}`);

    res.status(200).send("response test")

})
//this route handles uploading the VCF file to server, and then update the jason files to fit Gnomad
app.post("/upload_data", async function (req: Request, res: Response) {
    
    try {
        //we start by getting the current VCF file
        let dir = path.join(__dirname, <string>process.env.UPLOAD_FOLDER_NAME_GENOME)
        let filesNames: string[] = await getFilenamesFromDir(dir, res)
        let oldFilename: string = filesNames[0]

        upload(req, res, async function (err: any) {
            //error
            if (err) {
                console.log("error uploading the file : ", err)
                res.status(responseCode.SERVER_ERROR).send("failed to upload")
                return
            }
            //success

            res.status(responseCode.CREATED).send("File Uploaded")
            //since upload is successful, we deleted the old file.
           if(oldFilename) await deleteFile(req, res, path.join(dir, oldFilename), responseCode.SERVER_ERROR)
           
           
            let vcfFoldername: string = path.join(__dirname, "/genome_data_files/")
            let vcfFilename: string = (req as MulterRequest).file.filename
            let vcfFullPath: string = path.join(vcfFoldername, vcfFilename)

            let jsonsFolderName: string = path.join(__dirname, "/json_files/")
            let jsonFiles: string[] =  await getFilenamesFromDir(jsonsFolderName,res)
            
            for(const file of jsonFiles) {
                await deleteFile(req, res, path.join(jsonsFolderName, file), responseCode.SERVER_ERROR)
            }

            let writeFilesDestination: string = jsonsFolderName
            await processLineByLine(vcfFullPath, writeFilesDestination)
            console.log("done processing")

        })

    } catch (error) { }
})

app.post("/api",async function (req: any, res: Response){
    switch(req.body.operationName){
        case "Gene":
            refNum = req.body.variables.geneId
            return res.redirect(`/api/grch37`)
        case "GeneCoverage":
            return res.redirect(`/api/pcsk9`)
        case "VariantsInGene":
            //console.log(req.variables)
            return res.redirect(`/api/${req.body.operationName}/${refNum}`)
            //return res.redirect(`/api/${req.body.operationName}/${req.body.variables.geneId.split('_')[0]}`)
           // return res.redirect(`/api/${req.body.operationName}/clinvar_stub`)
    }
    // if(req.body.operationName ==="Gene"){
    //     //let url = `/api/${req.body.operationName}/${req.body.variables.geneId}`
    //     let url = `/api/grch37`
    //     console.log(req.body.operationName)
    //     return res.redirect(url)
    // }
    
        try{
           
            let dir = path.join(__dirname, <string>process.env.JSON_FILES_FOLDER)
            let filesNames: string[] = await getFilenamesFromDir(dir, res)
           
            let ensemblIdList = filesNames.map(filename =>{
                let ensemblId = filename.split(".")[0].split("-")[1]
                let symbol = filename.split(".")[0].split("-")[0]
                let keyVale = { ensembl_id:ensemblId, symbol:symbol }
               return keyVale
            })
            let data: any = { data:{ gene_search: [] } }
            for(let i =0;i<10;i++){
                let rand =Math.floor(Math.random() * (20000 - 0) + 0)
                data.data.gene_search.push(ensemblIdList[rand])
            }
            data.data.gene_search.push({ ensembl_id:"ENSG00000151136", symbol:"clinvar_stub"})
            // data.data.gene_search.push(ensemblIdList[2000])
            // data.data.gene_search.push(ensemblIdList[90])
            //  data.data.gene_search.push(ensemblIdList[4628])
            //  data.data.gene_search.push(ensemblIdList[3752])
            //  data.data.gene_search.push(ensemblIdList[3588])
            //  data.data.gene_search.push(ensemblIdList[200])
            //  data.data.gene_search.push(ensemblIdList[16287])
            //  data.data.gene_search.push(ensemblIdList[20000])
            //  data.data.gene_search.push(ensemblIdList[12005])
            //  data.data.gene_search.push(ensemblIdList[10000])
            // data.data.gene_search.push({ensembl_id:"clinvar_stub", symbol: "clinvar_stub"})
            res.send(JSON.stringify(data))
        }
       
        catch(error){}
    
})

app.get("/api/:operationName/:symbol",async function (req: any, res: Response){
    let readDir = path.join(__dirname, <string>process.env.JSON_FILES_FOLDER)
    let filesNames: string[] = await getFilenamesFromDir(readDir, res)
    let filename:string =""
    req.params.symbol
    filesNames.forEach(element => {
        if (element.includes(req.params.symbol)) filename =element
        
    });
   let dir = path.join(__dirname, <string>process.env.JSON_FILES_FOLDER)
   try{

    //console.log("symbol",req.params.symbol)
    let geneData= await fs.readFile(path.join(dir,filename))
    let jsonData = JSON.parse(geneData)
    
    res.send(JSON.stringify(jsonData))
   }catch(err){console.log(err)}

})

app.get("/api/grch37",async function (req: Request, res: Response){

    let dir = path.join(__dirname, <string>process.env.GENE_REFRENCE_FILES)
    try{
     let geneData= await fs.readFile(path.join(dir,`grch37_reference_stub.json`))
     let jsonData = JSON.parse(geneData)
     
     res.send(JSON.stringify(jsonData))
    }catch(err){console.log(err)}
 
 })

 app.get("/api/pcsk9",async function (req: Request, res: Response){

    let dir = path.join(__dirname, <string>process.env.GENE_REFRENCE_FILES)
    try{
     let geneData= await fs.readFile(path.join(dir,`pcsk9_coverage_stub.json`))
     let jsonData = JSON.parse(geneData)
     
     res.send(JSON.stringify(jsonData))
    }catch(err){console.log(err)}
 
 })

app.get( "/process",async function(req: Request, res: Response){
    let vcfFoldername: string = path.join(__dirname, "/genome_data_files/")
    let vcfFilename: string = await getFilenamesFromDir(vcfFoldername,res)
    let vcfFullPath: string = path.join(vcfFoldername, vcfFilename[0])

    let jsonsFolderName: string = path.join(__dirname, "/json_files/")
    let jsonFiles: string[] =  await getFilenamesFromDir(jsonsFolderName,res)
    
    for(const file of jsonFiles) {
        await deleteFile(req, res, path.join(jsonsFolderName, file), responseCode.SERVER_ERROR)
    }
    let writeFilesDestination: string = jsonsFolderName
    await processLineByLine(vcfFullPath, writeFilesDestination)
    console.log("done processing")
    res.send("processed!")



            // let folderPath:string = path.join(__dirname, "/genome_data_files")
            // let files: string[] =  await getFilenamesFromDir(folderPath,res)
            // //console.log(files)
            // files.forEach( async function(file) {
            //     await deleteFile(req, res, path.join(folderName, file), responseCode.SERVER_ERROR)
            // });
            // let filename =files[0]
            // let fullPath: string = path.join(folderPath, filename)
            // let writeFilesDestination: string = path.join(__dirname, "json_files")
            // await processLineByLine(fullPath, writeFilesDestination)
})

app.post("/reads",async function (req: Request, res: Response){
 console.log("inreads")
})





app.listen(port, function () {
    console.log(CMD.Magenta("Listening To Port : "), CMD.Orange(`${port}`))
})

//this function deletes a file by request.


async function uploadFileFromUser(req: Request, res: Response, errorCode?: number) {
    try {
        await upload(req, res)
    }
    catch (error) {
        res.status(errorCode ? errorCode : 500).send()
        throw error
    }

}
//this function returns a filename from gsutill command.
function getFilenameFromGSutil(command: string) {
    //this regex goes to the end of the line and then take anything untill you reach a /
    // the result of this is the filename at the end of a path.
    let filename = command.match(/[^\/]+$/gm)![0]//command.match(/[^\/]+\s\.$/gm)![0];
    //gsutil ends its command with a space and period that we need to trim.
    filename = filename.slice(0, -1)
    filename = filename.slice(0, -1)
    return filename;
}

// function create_file_path(file_name: string = "No_Name", file_extention: string, folder_name: string = "uploads") {
//     let new_file_name: string = timestamp_file_name(file_name, file_extention);
//     let new_file_path: string = `${__dirname}/${folder_name}/${new_file_name}`
//     return new_file_path;
// }

function timestampFilename(filename: string) {

    let name: string = filename.split(".")[0].trim();
    let extention: string = filename.split('.')[1].trim();
    if (!name) { name = "No_name" }

    let today: Date = new Date(Date.now())
    let todayStr: string = today.toDateString().replace(/\s/g, "-")
    let hours = today.getHours() > 12 ? today.getHours() - 12 : today.getHours()
    let minutes = today.getMinutes()
    let seconds = today.getSeconds()
    let timestamp = Date.now()
    const TIME_IN_HH_MM_SS = `(_${hours}H-${minutes}M-${seconds}S_)`

    return `${name}-${todayStr}_${TIME_IN_HH_MM_SS}_${timestamp}.${extention}`
}

function pathToFilename(path: string) {
    //given a path, this regex returns the file and extention
    //let filename= path.match(/[^\/]+\s\.$/gm)![0]

    let filename = path.match(/[^\/]+$/gm)![0]
    //let filename= path.match(/[^\\]+$/gm)![0]
    console.log(filename, "path")

    return filename
}

function handleError(error: any, res: Response, errorCode: number) {
    if (error) {
        console.log(error)
        //  res.status(errorCode).send(error)
        throw new Error("stuff");
    }

}
function pathToNameAndExtention(path: string) {
    //given a path, this regex returns the file and extention
    // let filename= path.match(/[^\/]+\s\.$/gm)![0]
    let filename = path.match(/[^\/]+$/gm)![0]
    // let filename= path.match(/[^\\]+$/gm)![0]

    let name = filename.split(".")[0]
    let extention = filename.split(".")[1]
    return { name, extention }
}

async function getFilenamesFromDir(dir: string, res: Response, errorCode?: number) {
    try {

        return await fs.readdir(dir);
    } catch (error) {
        res.status(errorCode ? errorCode : 500).send()
        console.log(CMD.Orange(`error in reading the filenames from ${dir} function : getFileNamesFromDir \n`), error);
        throw error
    }
}

//process.on('uncaughtException', function (err: Error) {
  //  console.log(CMD.Red(`uncaughtException : ${err}`))

//})

//process.on('unhandledRejection', function (err: Error) {
 ////   console.log(CMD.Red(`unhandledRejection : ${err}`))
//});
//processLineByLine(__dirname + "/genome_data_files/combined_annotated_VCF_allele_counts-Fri-Nov-04-2022_(_9H-50M-54S_)_1667587854600.txt", __dirname + "/json_files")