"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const cmd_colors_1 = __importDefault(require("./cmd_libs/cmd_colors"));
const express_1 = __importDefault(require("express"));
let app = (0, express_1.default)();
const { exec } = require("child_process");
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
var path = require('path');
const multer = require("multer");
let port = 5000;
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, __dirname + "/" + process.env.UPLOAD_FOLDER_NAME_GENOME);
    },
    filename: function (req, file, cb) {
        let full_name = timestamp_file_name(file.originalname.split(".")[0], file.originalname.split(".")[1]);
        cb(null, full_name);
    }
});
let upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        let filetypes_regex = /txt|bam|bai|cram/;
        let extname = filetypes_regex.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(`Error: File upload only supports the following filetypes - ${filetypes_regex}`);
    }
}).single("myFile");
app.use(express_1.default.static(__dirname + "/public"));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "https://app.terra.bio");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
// parse application/x-www-form-urlencoded
app.use(body_parser_1.default.json());
app.post('/download-file', function (req, res) {
    exec(req.body.text + ` ./${process.env.UPLOAD_FOLDER_NAME_TERA || "uploads"}`, (error, stdout, stderr) => {
        let command = req.body.text;
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            let { old_file_path, new_file_path } = paths_from_gsutil(command);
            fs_1.default.rename(old_file_path, new_file_path, function (error) {
                if (error) {
                    console.log(error);
                    throw error;
                }
                res.send('File Saved');
            });
            return;
        }
        // console.log(`stdout: ${stdout}`);
        //  })
        res.status(200).send("response test");
    });
});
app.post("/upload_data", function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            //error occured
            res.send(err);
        }
        else {
            // no errors
            let file = req.file;
            let full_path = file.path;
            //  console.log("fulpath : ",full_path)
            //   fs.readFile(full_path, function (err, data) {
            //         if (err) throw err
            //        // let data_string = data.toString()
            //       //  let data_list = data_string.split(/\s+/g)
            //       //  console.log(data_list)
            //     })
            res.send("filed uploaded");
        }
    });
});
app.listen(port, function () {
    console.log(cmd_colors_1.default.Magenta("Listening To Port : "), cmd_colors_1.default.Orange(`${port}`));
});
function paths_from_gsutil(command) {
    let file_name_and_extention = command.match(/[^\/]+\s\.$/gm)[0];
    let old_file_name = file_name_and_extention.split(".")[0].trim();
    let old_file_extention = file_name_and_extention.split('.')[1].trim();
    let folder_name = process.env.UPLOAD_FOLDER_NAME_TERA || "uploads";
    let old_file_path = `${__dirname}/${folder_name}/${old_file_name}.${old_file_extention}`;
    let new_file_path = create_file_path(old_file_name, old_file_extention, folder_name);
    return { old_file_path, new_file_path };
}
function create_file_path(file_name = "No_Name", file_extention, folder_name = "uploads") {
    let new_file_name = timestamp_file_name(file_name, file_extention);
    let new_file_path = `${__dirname}/${folder_name}/${new_file_name}`;
    return new_file_path;
}
function timestamp_file_name(file_name = "No_Name", file_extention) {
    const today = new Date(Date.now());
    const today_string = today.toDateString().replace(/\s/g, "-");
    const HOURS = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
    const MINUTES = today.getMinutes();
    const SECONDS = today.getSeconds();
    const timestamp = Date.now();
    const time_in_hh_mm_ss = `(_${HOURS}H-${MINUTES}M-${SECONDS}S_)`;
    return `${file_name}-${today_string}_${time_in_hh_mm_ss}_${timestamp}.${file_extention}`;
}
process.on('uncaughtException', function (err) {
    console.log(cmd_colors_1.default.Red(`uncaughtException : ${JSON.stringify(err)}`));
});
process.on('unhandledRejection', function (err) {
    console.log(cmd_colors_1.default.Red(`unhandledRejection : ${JSON.stringify(err)}`));
});
