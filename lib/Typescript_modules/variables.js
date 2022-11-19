"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gftToReference = exports.GnomadFeaturesToVcfDictionary = exports.gnomadFieldnames = exports.vcfFeatures = void 0;
let vcfFeatureStr = "ClinVar_sept_5_22_CLNSIG|ClinVar_sept_5_22_ID|num_samples|alt_allele_count|" +
    "het_count|alt_allele_ratio|HGVSc|HGVSp|Consequence|POS|ClinVar_sept_5_22_CLNREVSTAT|" +
    "Feature|ClinVar_sept_5_22|Consequence|rs_dbSNP|Feature|alt_count|HGVSc|5|gene|" +
    "Uploaded_variation|symbol|ref|alt|chrom|existing_variation";
vcfFeatureStr = vcfFeatureStr.toLowerCase();
exports.vcfFeatures = vcfFeatureStr.split(/\|/g);
//variantID_  existing variation
//gene symbols is just Symbol
//
let gnomadFieldnamesStr = "clinical_significance|clinvar_variation_id|an|ac|ac_hemi|" +
    "af|hgvsc|hgvsp|major_consequence|pos|review_status|transcript_id|" +
    "variant_id|consequence|rsids|transcript_id|ac_hom|hgvs|transcript_version|" +
    "gene|upload_var|symbol|ref|alt|chrom|existing_variation";
gnomadFieldnamesStr = gnomadFieldnamesStr.toLowerCase();
exports.gnomadFieldnames = gnomadFieldnamesStr.split(/\|/g);
exports.GnomadFeaturesToVcfDictionary = [];
for (let index = 0; index < exports.gnomadFieldnames.length; index++) {
    exports.GnomadFeaturesToVcfDictionary[exports.gnomadFieldnames[index]] = exports.vcfFeatures[index];
}
let gftFeatures = ['chrom', 'source', 'feature', 'start', 'end', 'score', 'strand', 'frame'];
exports.gftToReference = [];
for (let index = 0; index < exports.gnomadFieldnames.length; index++) {
    exports.GnomadFeaturesToVcfDictionary[exports.gnomadFieldnames[index]] = exports.vcfFeatures[index];
}
//# sourceMappingURL=variables.js.map