import { Request, Response } from "express"
require('dotenv').config()
import CMD from "./cmd_libs/cmd_colors"
import express from 'express'
let app = express();
const { exec } = require("child_process");
import bodyParser from 'body-parser'
import fs, { PathLike } from 'fs'
import{processLineByLine} from "./lib/Typescript_modules/fileiofunctions"
var path = require('path')
const multer = require("multer")
let port: number = 5000;
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
    res.setHeader('Access-Control-Allow-Origin', "https://app.terra.bio");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.json())

app.post('/download-file', function (req: Request, res: Response) {
    exec(req.body.text + ` ./${process.env.UPLOAD_FOLDER_NAME_TERA || "uploads"}`,
        (error: Error, stdout: string, stderr: string) => {
            let command: string = req.body.text
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {

                let { oldFilePath: oldFilePath, newFilePath: newFilePath } = pathsFromGSutil(command);
                fs.rename(oldFilePath, newFilePath, function (error: any) {
                    if (error) {
                        console.log(error)
                        throw error
                    }
                    res.send('File Saved');
                })
                return;
            }
            // console.log(`stdout: ${stdout}`);
            //  })

            res.status(200).send("response test")
        });
})

app.post("/upload_data", function (req :Request ,res :Response, next) {
    let oldFile :string
    let dir = path.join(__dirname,<string>process.env.UPLOAD_FOLDER_NAME_GENOME)
    fs.readdir(dir,function (err,files){
        if (err) throw err;
        oldFile =files [0]   
    })
    upload(req, res, function (err: any) {
        if (err) {
            //error occured
            res.send(err)
        }
        else {
            
            fs.readdir(dir, err => {

                if (err) throw err; 
                fs.unlink( path.join(dir,oldFile), err =>{ if (err) throw err})
                     
            })
            // no errors
            
            let file = (req as MulterRequest).file  
            //console.log(file.path)

            fs.writeFile(`${__dirname}/logs/VcfName.txt`, file.path, err =>{
                if (err) throw err
            })         
            let fullPath = file.path
          //  console.log("fulpath : ",full_path)
          
        //   fs.readFile(full_path, function (err, data) {
        //         if (err) throw err
        //        // let data_string = data.toString()
        //       //  let data_list = data_string.split(/\s+/g)
        //       //  console.log(data_list)
           
        //     })

            res.send("filed uploaded")
        }

    })

})


app.listen(port, function () {
    console.log(CMD.Magenta("Listening To Port : "), CMD.Orange(`${port}`))
})

function pathsFromGSutil(command: string) {
    
    let filename  = command.match(/[^\/]+\s\.$/gm)![0]//command.match(/[^\/]+\s\.$/gm)![0];
   // let name: string = filename.split(".")[0].trim();
    //let extention: string = filename.split('.')[1].trim();
    let folderName: string = process.env.UPLOAD_FOLDER_NAME_TERA ||"uploads";
    let oldFilePath: string = `${__dirname}/${folderName}/${filename}`;
    let newFilePath: string = `${__dirname}/${folderName}/${timestampFilename(filename)}`//create_file_path(filename, extention, <string>folder_name);
    return { oldFilePath: oldFilePath, newFilePath: newFilePath };
}

// function create_file_path(file_name: string = "No_Name", file_extention: string, folder_name: string = "uploads") {
//     let new_file_name: string = timestamp_file_name(file_name, file_extention);
//     let new_file_path: string = `${__dirname}/${folder_name}/${new_file_name}`
//     return new_file_path;
// }

function timestampFilename(filename: string ) {
    
    let name: string = filename.split(".")[0].trim();
    let extention: string = filename.split('.')[1].trim();
    if(!name){name="No_name"}

    let today: Date = new Date(Date.now())
    let todayStr: string = today.toDateString().replace(/\s/g, "-")
    let hours = today.getHours() >12 ? today.getHours() - 12 :  today.getHours()
    let minutes = today.getMinutes()
    let seconds = today.getSeconds()
    let timestamp = Date.now()
    const TIME_IN_HH_MM_SS = `(_${hours}H-${minutes}M-${seconds}S_)`

    return `${name}-${todayStr}_${TIME_IN_HH_MM_SS}_${timestamp}.${extention}`
} 

function pathToFilename (path:string){
    //given a path, this regex returns the file and extention
    //let filename= path.match(/[^\/]+\s\.$/gm)![0]
    let filename= path.match(/[^\\]+$/gm)![0]
    console.log(filename, "path")
    
    return filename
}


function pathToNameAndExtention (path:string){
    //given a path, this regex returns the file and extention
   // let filename= path.match(/[^\/]+\s\.$/gm)![0]
    let filename= path.match(/[^\\]+$/gm)![0]
   
    let name = filename.split(".")[0]
    let extention = filename.split(".")[1]
    return {name,extention}
}
process.on('uncaughtException', function (err: Error) {
    console.log(CMD.Red(`uncaughtException : ${err}`))

})

process.on('unhandledRejection', function (err: Error) {
    console.log(CMD.Red(`unhandledRejection : ${err}`))
});
processLineByLine(__dirname +"/genome_data_files/combined_annotated_VCF_allele_counts-Fri-Nov-04-2022_(_9H-50M-54S_)_1667587854600.txt",__dirname+"/json_files/myjson.json")