"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceTranscript = void 0;
const GtxTissueExpression_1 = require("./GtxTissueExpression");
const GnomadData_1 = __importDefault(require("../ClinvarDataClasses/GnomadData"));
class ReferenceTranscript extends GnomadData_1.default {
    constructor(gnomadToFeatures, featuresToValue) {
        super();
        this.transcript_id = "";
        this.transcript_version = "";
        this.strand = "";
        this.exons = [];
        this.gtex_tissue_expression = new GtxTissueExpression_1.GtxTissueExpression();
        this.transcript_id = this.getValueByField("transcript_id", gnomadToFeatures, featuresToValue);
        this.transcript_version = this.getValueByField("transcript_version", gnomadToFeatures, featuresToValue);
        this.strand = this.getValueByField("strand", gnomadToFeatures, featuresToValue);
        this.exons = [];
        this.gtex_tissue_expression = new GtxTissueExpression_1.GtxTissueExpression();
    }
}
exports.ReferenceTranscript = ReferenceTranscript;
//# sourceMappingURL=ReferenceTranscript.js.map