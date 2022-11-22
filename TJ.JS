"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VariantExome_1 = require("./lib/Classes/ClinvarDataClasses/VariantExome");
console.log(new VariantExome_1.VariantExome());
let variant = new VariantExome_1.VariantExome();
let myJson = {};
for (let x in variant) {
    console.log(variant[x]);
    myJson[x] = variant[x];
}
console.log(myJson);
//# sourceMappingURL=TJ.js.map