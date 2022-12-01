"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceTranscriptExon = void 0;
const GnomadData_1 = __importDefault(require("../ClinvarDataClasses/GnomadData"));
class ReferenceTranscriptExon extends GnomadData_1.default {
    constructor(gnomadToFeatures, featuresToValue) {
        super();
        this.feature_type = "";
        this.start = 0;
        this.stop = 0;
        this.feature_type = this.getValueByField("feature_type", gnomadToFeatures, featuresToValue);
        this.start = Number(this.getValueByField("start", gnomadToFeatures, featuresToValue));
        this.stop = Number(this.getValueByField("stop", gnomadToFeatures, featuresToValue));
    }
}
exports.ReferenceTranscriptExon = ReferenceTranscriptExon;
//# sourceMappingURL=ReferenceTranscriptExon.js.map