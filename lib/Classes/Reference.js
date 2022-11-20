"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
const GnomadData_1 = __importDefault(require("./GnomadData"));
class Reference extends GnomadData_1.default {
    constructor(gnomadToFeatures, featuresToValue) {
        super();
        let hgnc = this.getValueByField("hgnc_id", gnomadToFeatures, featuresToValue);
        this.chrom = this.getValueByField("chrom", gnomadToFeatures, featuresToValue);
        this.source = this.getValueByField("source", gnomadToFeatures, featuresToValue);
        this.feature_type = this.getValueByField("feature_type", gnomadToFeatures, featuresToValue);
        this.start = Number(this.getValueByField("start", gnomadToFeatures, featuresToValue));
        this.stop = Number(this.getValueByField("stop", gnomadToFeatures, featuresToValue));
        this.score = this.getValueByField("score", gnomadToFeatures, featuresToValue);
        this.strand = this.getValueByField("strand", gnomadToFeatures, featuresToValue);
        this.frame = this.getValueByField("frame", gnomadToFeatures, featuresToValue);
        this.gene_id = this.getValueByField("gene_id", gnomadToFeatures, featuresToValue);
        this.hgnc_id = hgnc ? hgnc : "NA";
        this.transcript_version = this.getValueByField("transcript_version", gnomadToFeatures, featuresToValue);
        this.symbol = this.getValueByField("symbol", gnomadToFeatures, featuresToValue);
        this.canonical_transcript_id = this.getValueByField("canonical_transcript_id", gnomadToFeatures, featuresToValue);
    }
    toJson() {
        return {};
    }
}
exports.Reference = Reference;
//# sourceMappingURL=Reference.js.map