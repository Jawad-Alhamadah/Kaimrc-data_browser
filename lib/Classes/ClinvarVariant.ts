
export class ClinvarVariant {

    clinical_significance: string
    clinvar_variation_id: string
    gnomad: {}
    gold_stars: number
    hgvsc: string
    hgvsp: string
    in_gnomad: true
    major_consequence: string
    pos: number
    review_status: string
    transcript_id: string
    variant_id: string
    symbol: string

    constructor(row: string[], gnomadToVcfMap: string[], vcfFieldsToIndices: any[]) {
        let variant:string = this.getValueByField("pos", row, gnomadToVcfMap, vcfFieldsToIndices)
        let hgvsc = this.getValueByField("hgvsc", row, gnomadToVcfMap, vcfFieldsToIndices).split(":")[1]
        let hgvsp = this.getValueByField("hgvsp", row, gnomadToVcfMap, vcfFieldsToIndices).split(":")[1]
        let chrom  :string = this.getValueByField("chrom", row, gnomadToVcfMap, vcfFieldsToIndices)
        let chromNum :string = chrom.match(/[0-9]+/gm)? chrom.match(/[0-9]+/gm)![0] : "NA"
       // if(variant==="-")
        //    variant="1234567"
        this.clinical_significance = this.getValueByField("clinical_significance", row, gnomadToVcfMap, vcfFieldsToIndices)
        this.clinvar_variation_id = this.getValueByField("clinvar_variation_id", row, gnomadToVcfMap, vcfFieldsToIndices)
        this.gnomad = {exome:null , genome:null}
        this.gold_stars = 5
        this.hgvsc = hgvsc? hgvsc :"NA"
        this.hgvsp = hgvsp? hgvsp : "NA"
        this.in_gnomad = true
        this.major_consequence = this.getValueByField("major_consequence", row, gnomadToVcfMap, vcfFieldsToIndices)
        this.pos = Number(this.getValueByField("pos", row, gnomadToVcfMap, vcfFieldsToIndices))
        this.review_status = this.getValueByField("review_status", row, gnomadToVcfMap, vcfFieldsToIndices)
        this.transcript_id = this.getValueByField("transcript_id", row, gnomadToVcfMap, vcfFieldsToIndices)
       // this.variant_id = this.feature_to_variant_value("variant_id", row, gnomad_json_features, gnomad_to_indices_mapp)
        this.symbol = this.getValueByField("symbol", row, gnomadToVcfMap, vcfFieldsToIndices)
        this.variant_id = chromNum+"-"+variant+"-"+
                        this.getValueByField("ref", row, gnomadToVcfMap, vcfFieldsToIndices)+
                        "-"+
                        this.getValueByField("alt", row, gnomadToVcfMap, vcfFieldsToIndices)
    }
    getValueByField(feature: string, rowOfValues: string[], gnomadToVcfMap: string[], vcfFieldsToIndices: number[]) {
        //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
        return rowOfValues[this.retriveMappedValue(this.retriveMappedValue(feature, gnomadToVcfMap), vcfFieldsToIndices)]

    }
    retriveMappedValue(name: string, map: any) {
        return map[name]
    }
    toJson() {
        return {
            clinical_significance: this.clinical_significance,
            clinvar_variation_id: this.clinvar_variation_id,
            gnomad: this.gnomad,
            gold_stars: this.gold_stars,
            hgvsc: this.hgvsc,
            hgvsp: this.hgvsp,
            in_gnomad: this.in_gnomad,
            major_consequence: this.major_consequence,
            pos: this.pos,
            review_status: this.review_status,
            transcript_id: this.transcript_id,
            variant_id: this.variant_id,
            symbol: this.symbol
        }
    }
}
