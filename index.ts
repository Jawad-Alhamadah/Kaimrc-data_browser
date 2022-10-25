import { Request, Response } from "express"
require('dotenv').config()
import CMD from "./cmd_libs/cmd_colors"
import express from 'express'
let app = express();
const { exec } = require("child_process");
import bodyParser from 'body-parser'
import fs from 'fs'
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
        cb(null, __dirname + "/" + process.env.UPLOAD_FOLDER_NAME_GENOME)
    },
    filename: function (req: Request, file: any, cb: any) {
        let full_name = timestamp_file_name(file.originalname.split(".")[0], file.originalname.split(".")[1])
        cb(null, full_name)
    }
})

let upload = multer({
    storage: storage,
    fileFilter: function (req: Request, file: any, cb: any) {
        // Set the filetypes, it is optional
        let filetypes_regex = /txt|bam|bai|cram/;
        let extname = filetypes_regex.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(`Error: File upload only supports the following filetypes - ${filetypes_regex}`);
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

                let { old_file_path, new_file_path } = paths_from_gsutil(command);
                fs.rename(old_file_path, new_file_path, function (error: any) {
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

    upload(req, res, function (err: any) {
        if (err) {
            //error occured
            res.send(err)
        }
        else {
            // no errors
            let file = (req as MulterRequest).file           
            let full_path = file.path
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

function paths_from_gsutil(command: string) {
    let file_name_and_extention = command.match(/[^\/]+\s\.$/gm)![0];
    let old_file_name: string = file_name_and_extention.split(".")[0].trim();
    let old_file_extention: string = file_name_and_extention.split('.')[1].trim();
    let folder_name: string = process.env.UPLOAD_FOLDER_NAME_TERA || "uploads";
    let old_file_path: string = `${__dirname}/${folder_name}/${old_file_name}.${old_file_extention}`;
    let new_file_path: string = create_file_path(old_file_name, old_file_extention, <string>folder_name);
    return { old_file_path, new_file_path };
}

function create_file_path(file_name: string = "No_Name", file_extention: string, folder_name: string = "uploads") {
    let new_file_name: string = timestamp_file_name(file_name, file_extention);
    let new_file_path: string = `${__dirname}/${folder_name}/${new_file_name}`
    return new_file_path;
}

function timestamp_file_name(file_name: string = "No_Name", file_extention: string) {
    const today: Date = new Date(Date.now())
    const today_string: string = today.toDateString().replace(/\s/g, "-")
    const HOURS = today.getHours() >12 ? today.getHours() - 12 :  today.getHours()
    const MINUTES = today.getMinutes()
    const SECONDS = today.getSeconds()
    const timestamp = Date.now()
    const time_in_hh_mm_ss = `(_H${HOURS}-M${MINUTES}-S${SECONDS}_)`

    return `${file_name}-${today_string}_${time_in_hh_mm_ss}_${timestamp}.${file_extention}`
}

// process.on('uncaughtException', function (err: Error) {
//     console.log(CMD.Red(`uncaughtException : ${JSON.stringify(err)}`))

// })

process.on('unhandledRejection', function (err: Error) {
    console.log(CMD.Red(`unhandledRejection : ${JSON.stringify(err)}`))
});