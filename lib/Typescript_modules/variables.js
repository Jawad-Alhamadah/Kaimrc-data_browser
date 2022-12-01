"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDictionary = exports.GENE_CODE_GFT_FEATURES = exports.GENECODE_TO_GNOMAD_REFERENCE = exports.GENECODE_FEATURES = exports.GNOMAD_REFERENCE_FEATURES = exports.GNOMAD_TO_VCF = exports.GNOMAD_FIELDS = exports.VCF_FEATURES = void 0;
let vcfFeaturesList = [
    'clinvar_sept_5_22_clnsig', 'clinvar_sept_5_22_id',
    'num_samples', 'alt_allele_count',
    'het_count', 'alt_allele_ratio',
    'hgvsc', 'hgvsp',
    'consequence', 'pos',
    'clinvar_sept_5_22_clnrevstat', 'feature',
    'clinvar_sept_5_22', 'consequence',
    'rs_dbsnp', 'feature',
    'alt_count', 'hgvsc',
    '5', 'gene',
    'uploaded_variation', 'symbol',
    'ref', 'alt',
    'chrom', 'existing_variation'
];
exports.VCF_FEATURES = vcfFeaturesList.map(feature => feature.toLowerCase());
//variantID_  existing variation
//gene symbols is just Symbol
//
let gnomadFieldnamesList = [
    'clinical_significance', 'clinvar_variation_id',
    'an', 'ac',
    'ac_hemi', 'af',
    'hgvsc', 'hgvsp',
    'major_consequence', 'pos',
    'review_status', 'transcript_id',
    'variant_id', 'consequence',
    'rsids', 'transcript_id',
    'ac_hom', 'hgvs',
    'transcript_version', 'gene',
    'upload_var', 'symbol',
    'ref', 'alt',
    'chrom', 'existing_variation'
];
exports.GNOMAD_FIELDS = gnomadFieldnamesList.map(feature => feature.toLowerCase());
exports.GNOMAD_TO_VCF = createDictionary(exports.GNOMAD_FIELDS, exports.VCF_FEATURES);
// for (let index = 0; index < gnomadFieldnames.length; index++) {
//   GNOMAD_TO_VCF[gnomadFieldnames[index]] = vcfFeatures[index]
//     }
exports.GNOMAD_REFERENCE_FEATURES = [
    'chrom', 'source',
    'feature_type', 'start',
    'stop', 'score',
    'strand', 'frame',
    'gene_id', 'canonical_transcript_id',
    'hgnc_id', 'transcript_version',
    'symbol', 'transcript_id'
];
exports.GENECODE_FEATURES = [
    'chrom', 'source',
    'feature_type', 'start',
    'end', 'score',
    'strand', 'frame',
    'gene_id', 'transcript_id',
    'hgnc_id', 'level',
    'gene_name', 'transcript_id'
];
exports.GENECODE_TO_GNOMAD_REFERENCE = createDictionary(exports.GNOMAD_REFERENCE_FEATURES, exports.GENECODE_FEATURES);
exports.GENE_CODE_GFT_FEATURES = ['chrom', 'source', 'feature_type', 'start', 'end', 'score', 'strand', 'frame'];
const GNOMAD_COVERAGE_FEATURES = [
    "pos",
    "mean",
    "median",
    "over_1",
    "over_5",
    "over_10",
    "over_15",
    "over_20",
    "over_25",
    "over_30",
    "over_50",
    "over_100",
];
const GENECODE_COVERAGE_FEATURES = [
    'Gene',
    'total_coverage',
    'average_coverage',
    '01MD2000150A_total_cvg',
    '01MD2000150A_mean_cvg',
    '01MD2000150A_granular_Q1',
    '01MD2000150A_granular_median',
    '01MD2000150A_granular_Q3',
    '01MD2000150A_%_above_15'
];
function createDictionary(keysList, valuesList) {
    let mapDict = {};
    for (let i = 0; i < valuesList.length; i++) {
        const key = keysList[i];
        mapDict[key] = valuesList[i];
    }
    return mapDict;
}
exports.createDictionary = createDictionary;
//for (let index = 0; index < refFeatures.length; index++) {
// GFT_TO_REFERENCE[refFeatures[index]] = gftFeatures[index]
//  }
//# sourceMappingURL=variables.js.map