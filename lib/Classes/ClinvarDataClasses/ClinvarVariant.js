"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinvarVariant = void 0;
const GnomadData_1 = __importDefault(require("./GnomadData"));
class ClinvarVariant extends GnomadData_1.default {
    constructor(rowOfValues, gnomadToVcfMap, vcfFieldsToIndices, isEmptyConstruct) {
        super();
        this.clinical_significance = "NA";
        this.clinvar_variation_id = "NA";
        this.gnomad = {};
        this.gold_stars = 0;
        this.hgvsc = "NA";
        this.hgvsp = "NA";
        this.in_gnomad = false;
        this.major_consequence = "NA";
        this.pos = 0;
        this.review_status = "NA";
        this.transcript_id = "NA";
        this.variant_id = "NA";
        this.symbol = "NA";
        if (isEmptyConstruct)
            return;
        let variant = this.getValueByField("pos", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let hgvsc = this.getValueByField("hgvsc", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1];
        let hgvsp = this.getValueByField("hgvsp", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1];
        let chrom = this.getValueByField("chrom", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let chromNum = chrom.match(/[0-9]+/gm) ? chrom.match(/[0-9]+/gm)[0] : "NA";
        // if(variant==="-")
        //    variant="1234567"
        this.clinical_significance = this.getValueByField("clinical_significance", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        this.clinvar_variation_id = this.getValueByField("clinvar_variation_id", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        this.gnomad = { exome: null, genome: null };
        this.gold_stars = 5;
        this.hgvsc = hgvsc ? hgvsc : "NA";
        this.hgvsp = hgvsp ? hgvsp : "NA";
        this.in_gnomad = true;
        this.major_consequence = this.getValueByField("major_consequence", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        this.pos = Number(this.getValueByField("pos", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues));
        this.review_status = this.getValueByField("review_status", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        this.transcript_id = this.getValueByField("transcript_id", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        // this.variant_id = this.feature_to_variant_value("variant_id", row, gnomad_json_features, gnomad_to_indices_mapp)
        this.symbol = this.getValueByField("symbol", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        this.variant_id = chromNum + "-" + variant + "-" +
            this.getValueByField("ref", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues) +
            "-" +
            this.getValueByField("alt", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
    }
}
exports.ClinvarVariant = ClinvarVariant;
//# sourceMappingURL=ClinvarVariant.js.map