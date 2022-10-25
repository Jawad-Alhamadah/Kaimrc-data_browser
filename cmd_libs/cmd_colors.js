"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const Orange = chalk.hex('#ffa500');
const Cyan = chalk.hex("#3ADAE1");
const Turquoise = chalk.hex("3FE5B9");
const Green = chalk.hex("#36d600");
const Red = chalk.hex("#ff0000");
const Blue = chalk.hex("#0000ff");
const Magenta = chalk.hex("#D80096");
const Purple = chalk.hex("#A510DB");
const Yellow = chalk.hex("#ffff00");
const Indigo = chalk.hex("#4b0082");
const Violet = chalk.hex("#ee82ee");
const Magneta_Light = chalk.hex("#B8668D");
const Cyan_Gray = chalk.hex("#68AECF");
const Bold = chalk.bold();
//function Color(hex,text){return chalk.hex(hex)(text)}
function Colored_text(hex, text, option) {
    if (option === "bold")
        return chalk.bold.hex(hex)(text);
    if (option === "dim")
        return chalk.dim.hex(hex)(text);
    if (option === "inverse")
        return chalk.inverse.hex(hex)(text);
    return chalk.hex(hex)(text);
}
exports.default = {
    Orange, Cyan, Turquoise, Green, Red, Magenta, Purple, Yellow, Magneta_Light, Cyan_Gray, Colored_text,
    Violet, Indigo, Blue, Bold
};
