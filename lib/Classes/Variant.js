"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variant = void 0;
class Variant {
    constructor(row, gnomadToVcfMap, vcfFieldsToIndices) {
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
        let variant = this.getValueByField("pos", row, gnomadToVcfMap, vcfFieldsToIndices);
        let hgvsc = this.getValueByField("hgvsc", row, gnomadToVcfMap, vcfFieldsToIndices).split(":")[1];
        let hgvsp = this.getValueByField("hgvsp", row, gnomadToVcfMap, vcfFieldsToIndices).split(":")[1];
        let hgvs = this.getValueByField("hgvs", row, gnomadToVcfMap, vcfFieldsToIndices).split(":")[1];
        let chrom = this.getValueByField("chrom", row, gnomadToVcfMap, vcfFieldsToIndices);
        let chromNum = chrom.match(/[0-9]+/gm) ? chrom.match(/[0-9]+/gm)[0] : "NA";
        this.consequence = this.getValueByField("consequence", row, gnomadToVcfMap, vcfFieldsToIndices);
        this.flags = [];
        this.hgvsc = hgvsc ? hgvsc : "NA";
        this.hgvsp = hgvsp ? hgvsp : "NA";
        this.hgvs = hgvs ? hgvs : "NA";
        this.lof = null;
        this.lof_filter = null;
        this.lof_flags = null;
        this.pos = Number(this.getValueByField("pos", row, gnomadToVcfMap, vcfFieldsToIndices));
        this.rsids = [];
        this.transcript_id = this.getValueByField("transcript_id", row, gnomadToVcfMap, vcfFieldsToIndices);
        this.transcript_version = this.getValueByField("transcript_version", row, gnomadToVcfMap, vcfFieldsToIndices);
        this.variant_id = chromNum + "-" + variant + "-" +
            this.getValueByField("ref", row, gnomadToVcfMap, vcfFieldsToIndices) +
            "-" +
            this.getValueByField("alt", row, gnomadToVcfMap, vcfFieldsToIndices);
        // this.variant_id = this.getValueByField("variant_id", row, gnomadToVcfMap, vcfFieldsToIndices)
        //this.variant_id = "1-1-"+this.feature_to_variant_value("ref", row, gnomadJsonFeatures, gnomadToIndicesMap)+"-"+this.feature_to_variant_value("alt", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.exome = null;
        this.genome = {
            ac: Number(this.getValueByField("ac", row, gnomadToVcfMap, vcfFieldsToIndices)),
            ac_hemi: Number(this.getValueByField("ac_hemi", row, gnomadToVcfMap, vcfFieldsToIndices)),
            ac_hom: Number(this.getValueByField("ac_hom", row, gnomadToVcfMap, vcfFieldsToIndices)),
            an: Number(this.getValueByField("an", row, gnomadToVcfMap, vcfFieldsToIndices)) * 2,
            af: Number(this.getValueByField("af", row, gnomadToVcfMap, vcfFieldsToIndices)),
            filters: [],
            populations: []
        };
        this.lof_curation = null;
    }
    getValueByField(feature, valuesRow, gnomadToVcfMap, vcfFieldsToIndices) {
        //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
        return valuesRow[this.retriveMappedValue(this.retriveMappedValue(feature, gnomadToVcfMap), vcfFieldsToIndices)];
    }
    retriveMappedValue(name, map) {
        return map[name];
    }
    toJson() {
        return {
            consequence: this.consequence,
            flags: this.flags,
            hgvs: this.hgvs,
            hgvsc: this.hgvsc,
            hgvsp: this.hgvsp,
            lof: this.lof,
            lof_filter: this.lof_filter,
            lof_flags: this.lof_flags,
            pos: this.pos,
            rsids: this.rsids,
            transcript_id: this.transcript_id,
            transcript_version: this.transcript_version,
            variant_id: this.variant_id,
            exome: this.exome,
            genome: this.genome,
            lof_curation: this.lof_curation
        };
    }
}
exports.Variant = Variant;
//# sourceMappingURL=Variant.js.map