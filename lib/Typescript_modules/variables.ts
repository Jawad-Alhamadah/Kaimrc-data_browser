
let vcfFeaturesList: string[] = [
  'clinvar_sept_5_22_clnsig',     'clinvar_sept_5_22_id',
  'num_samples',                  'alt_allele_count',
  'het_count',                    'alt_allele_ratio',
  'hgvsc',                        'hgvsp',
  'consequence',                  'pos',
  'clinvar_sept_5_22_clnrevstat', 'feature',
  'clinvar_sept_5_22',            'consequence',
  'rs_dbsnp',                     'feature',
  'alt_count',                    'hgvsc',
  '5',                            'gene',
  'uploaded_variation',           'symbol',
  'ref',                          'alt',
  'chrom',                        'existing_variation'
]

export let VCF_FEATURES = vcfFeaturesList.map(feature =>feature.toLowerCase())

//variantID_  existing variation
//gene symbols is just Symbol
//
let gnomadFieldnamesList: string[] =
[
  'clinical_significance', 'clinvar_variation_id',
  'an',                    'ac',
  'ac_hemi',               'af',
  'hgvsc',                 'hgvsp',
  'major_consequence',     'pos',
  'review_status',         'transcript_id',
  'variant_id',            'consequence',
  'rsids',                 'transcript_id',
  'ac_hom',                'hgvs',
  'transcript_version',    'gene',
  'upload_var',            'symbol',
  'ref',                   'alt',
  'chrom',                 'existing_variation'
]

export let GNOMAD_FIELDS: string[] = gnomadFieldnamesList.map(feature =>feature.toLowerCase())

export let GNOMAD_TO_VCF =  createDictionary (GNOMAD_FIELDS,VCF_FEATURES)
// for (let index = 0; index < gnomadFieldnames.length; index++) {
//   GNOMAD_TO_VCF[gnomadFieldnames[index]] = vcfFeatures[index]
//     }

export let GNOMAD_REFERENCE_FEATURES =  
[
  'chrom',            'source',
  'feature_type',     'start',
  'stop',             'score',
  'strand',           'frame',
  'gene_id',          'canonical_transcript_id',
  'hgnc_id',          'transcript_version',
  'symbol',           'transcript_id'
]
                    
export let GENECODE_FEATURES =  
[
  'chrom',              'source',
  'feature_type',       'start',
  'end',                'score',
  'strand',             'frame',
  'gene_id',            'transcript_id',
  'hgnc_id',            'level',
  'gene_name',          'transcript_id'
]                               
export let GENECODE_TO_GNOMAD_REFERENCE: any =  createDictionary(GNOMAD_REFERENCE_FEATURES,GENECODE_FEATURES)
export let GENE_CODE_GFT_FEATURES = ['chrom', 'source', 'feature_type', 'start', 'end', 'score', 'strand', 'frame']


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
]

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
]

export function createDictionary(keysList: any, valuesList: any) {
  let mapDict: any = {}
  for (let i = 0; i < valuesList.length; i++) {
      const key: string = keysList[i]
      mapDict[key] = valuesList[i]

  }
  return mapDict
}


//for (let index = 0; index < refFeatures.length; index++) {
 // GFT_TO_REFERENCE[refFeatures[index]] = gftFeatures[index]
  //  }



