"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs"); //mycomment
const readline = require("readline");
const { promises: fsPromise } = require("fs");
let responseCode = require("./lib/Typescript_modules/responseCodes");
var path = require('path');
//given two lists, this function returns a filter list
//that contains indices where both values match.
// async function getFilenamesFromDir(dir: string, res: Response, errorCode?: number) {
//     try {
//         return await fs.readdir(dir);
//     } catch (error) {
//         res.status(errorCode ? errorCode : 500).send()
//         console.log(CMD.Orange(`error in reading the filenames from ${dir} function : getFileNamesFromDir \n`), error);
//         throw error
//     }
// }
// export async function deleteFile(req: Request, res: Response, path: string, errorCode?: number) {
//     try {
//         await fsPromise.unlink(path)
//     }
//     catch (error) {
//         res.status(errorCode ? errorCode : 500).send()
//         console.log("couldn't delete File")
//         throw error
//     }
// }
let foldername = path.join(__dirname, "genome_data_files");
//processReferenceLinebyLine(path.join(foldername,"gencode.v38.annotation.gtf"),null,null)
//# sourceMappingURL=myRef.js.map