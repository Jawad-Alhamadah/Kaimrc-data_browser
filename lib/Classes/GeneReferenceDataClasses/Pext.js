"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pext = void 0;
const GnomadData_1 = __importDefault(require("../ClinvarDataClasses/GnomadData"));
class Pext extends GnomadData_1.default {
    constructor() {
        super(...arguments);
        this.regions = [];
        this.flags = [];
    }
}
exports.Pext = Pext;
//# sourceMappingURL=Pext.js.map