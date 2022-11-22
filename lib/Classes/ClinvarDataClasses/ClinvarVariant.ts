import GnomadData from "./GnomadData"
export class ClinvarVariant extends GnomadData {
    [key: string]: any
    clinical_significance: string = "NA"
    clinvar_variation_id: string = "NA"
    gnomad: {} = {}
    gold_stars: number = 0
    hgvsc: string = "NA"
    hgvsp: string = "NA"
    in_gnomad: boolean = false
    major_consequence: string = "NA"
    pos: number = 0
    review_status: string = "NA"
    transcript_id: string = "NA"
    variant_id: string = "NA"
    symbol: string = "NA"

    constructor(rowOfValues: string[], gnomadToVcfMap: string[], vcfFieldsToIndices: any[], isEmptyConstruct?: boolean) {
        super()
        if (isEmptyConstruct) return
        let variant: string = this.getValueByField("pos", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let hgvsc = this.getValueByField("hgvsc", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1]
        let hgvsp = this.getValueByField("hgvsp", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1]
        let chrom: string = this.getValueByField("chrom", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let chromNum: string = chrom.match(/[0-9]+/gm) ? chrom.match(/[0-9]+/gm)![0] : "NA"
        let ref:string          = this.getValueByField("ref", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let alt:string          = this.getValueByField("alt", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
     
        this.clinical_significance = this.getValueByField("clinical_significance", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.clinvar_variation_id = this.getValueByField("clinvar_variation_id", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.gnomad = { exome: null, genome: null }
        this.gold_stars = 5
        this.hgvsc = hgvsc ? hgvsc : "NA"
        this.hgvsp = hgvsp ? hgvsp : "NA"
        this.in_gnomad = true
        this.major_consequence = this.getValueByField("major_consequence", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.pos = Number(this.getValueByField("pos", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues))
        this.review_status = this.getValueByField("review_status", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.transcript_id = this.getValueByField("transcript_id", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        // this.variant_id = this.feature_to_variant_value("variant_id", row, gnomad_json_features, gnomad_to_indices_mapp)
        this.symbol = this.getValueByField("symbol", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.variant_id = `${chromNum}-${variant}-${ref}-${alt}`
    }
}
