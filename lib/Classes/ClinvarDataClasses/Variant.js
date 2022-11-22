"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variant = void 0;
const GnomadData_1 = __importDefault(require("./GnomadData"));
class Variant extends GnomadData_1.default {
    constructor(rowOfValues, gnomadToVcfMap, vcfFieldsToIndices, isEmptyConstruct) {
        super();
        this.consequence = "";
        this.flags = null;
        this.hgvs = "";
        this.hgvsc = "";
        this.hgvsp = "";
        this.lof = null;
        this.lof_filter = null;
        this.lof_flags = null;
        this.pos = 0;
        this.rsids = [];
        this.transcript_id = "";
        this.transcript_version = "";
        this.variant_id = "";
        this.exome = null;
        this.genome = null;
        this.lof_curation = null;
        if (isEmptyConstruct)
            return;
        let variant = this.getValueByField("pos", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let hgvsc = this.getValueByField("hgvsc", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1];
        let hgvsp = this.getValueByField("hgvsp", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1];
        let hgvs = this.getValueByField("hgvs", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1];
        let chrom = this.getValueByField("chrom", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let chromNum = chrom.match(/[0-9]+/gm) ? chrom.match(/[0-9]+/gm)[0] : "NA";
        let ref = this.getValueByField("ref", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let alt = this.getValueByField("alt", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let genomeAc = Number(this.getValueByField("ac", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues));
        let genomeAcHemi = Number(this.getValueByField("ac_hemi", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues));
        let genomeAcHom = Number(this.getValueByField("ac_hom", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues));
        let genomeAn = Number(this.getValueByField("an", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)) * 2;
        let genomeAf = Number(this.getValueByField("af", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues));
        let consequence = this.getValueByField("consequence", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let pos = Number(this.getValueByField("pos", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues));
        let rsids = this.getValueByField("rsids", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let transcript_id = this.getValueByField("transcript_id", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        let transcript_version = this.getValueByField("transcript_version", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues);
        this.consequence = consequence;
        this.flags = [];
        this.hgvsc = hgvsc ? hgvsc : "NA";
        this.hgvsp = hgvsp ? hgvsp : "NA";
        this.hgvs = hgvs ? hgvs : "NA";
        this.lof = null;
        this.lof_filter = null;
        this.lof_flags = null;
        this.pos = pos;
        this.rsids.push(rsids);
        this.transcript_id = transcript_id;
        this.transcript_version = transcript_version;
        this.variant_id = `${chromNum}-${variant}-${ref}-${alt}`;
        this.lof_curation = null;
        this.exome = null;
        this.genome = {
            ac: genomeAc,
            ac_hemi: genomeAcHemi,
            ac_hom: genomeAcHom,
            an: genomeAn,
            af: genomeAf,
            filters: [],
            populations: []
        };
    }
}
exports.Variant = Variant;
//# sourceMappingURL=Variant.js.map