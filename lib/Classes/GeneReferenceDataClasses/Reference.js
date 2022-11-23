"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
const GnomadData_1 = __importDefault(require("../ClinvarDataClasses/GnomadData"));
const GnomadReferenceConstraint_1 = require("./GnomadReferenceConstraint");
const ExacReferenceConstraint_1 = require("./ExacReferenceConstraint");
const Pext_1 = require("./Pext");
class Reference extends GnomadData_1.default {
    // source: string
    // feature_type: string
    // score: string
    // frame: number
    //  transcript_version: string
    constructor(gnomadToFeatures, featuresToValue) {
        super();
        this.exons = [];
        this.gnomad_constraint = new GnomadReferenceConstraint_1.GnomadReferenceConstraint();
        this.exac_constraint = new ExacReferenceConstraint_1.ExacReferenceConstraint();
        this.transcripts = [];
        this.pext = new Pext_1.Pext();
        let hgnc = this.getValueByField("hgnc_id", gnomadToFeatures, featuresToValue);
        this.reference_genome = "gencode.v38.annotation";
        this.gene_id = this.getValueByField("gene_id", gnomadToFeatures, featuresToValue);
        this.gene_version = "9";
        this.symbol = this.getValueByField("symbol", gnomadToFeatures, featuresToValue);
        this.gencode_symbol = this.getValueByField("gencode_symbol", gnomadToFeatures, featuresToValue);
        this.name = "unknown";
        this.canonical_transcript_id = this.getValueByField("canonical_transcript_id", gnomadToFeatures, featuresToValue);
        this.mane_select_transcript = null;
        this.hgnc_id = hgnc ? hgnc : "NA";
        this.ncbi_id = "NA";
        this.omim_id = "NA";
        this.chrom = this.getValueByField("chrom", gnomadToFeatures, featuresToValue);
        this.start = Number(this.getValueByField("start", gnomadToFeatures, featuresToValue));
        this.stop = Number(this.getValueByField("stop", gnomadToFeatures, featuresToValue));
        this.strand = this.getValueByField("strand", gnomadToFeatures, featuresToValue);
        this.exons = [];
        this.flags = [];
        this.gnomad_constraint = new GnomadReferenceConstraint_1.GnomadReferenceConstraint();
        this.exac_constraint = new ExacReferenceConstraint_1.ExacReferenceConstraint();
        this.transcripts = [];
        this.pext = new Pext_1.Pext();
        this.exac_regional_missense_constraint_regions = null;
    }
    pushTranscripts(transcripts) {
        this.transcripts = transcripts;
    }
}
exports.Reference = Reference;
//# sourceMappingURL=Reference.js.map