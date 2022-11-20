import GnomadData from "./GnomadData"
export class ClinvarVariant extends GnomadData{

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

    constructor(rowOfValues: string[], gnomadToVcfMap: string[], vcfFieldsToIndices: any[]) {
        super()
        let variant:string = this.getValueByField("pos",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let hgvsc = this.getValueByField("hgvsc",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1]
        let hgvsp = this.getValueByField("hgvsp",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1]
        let chrom  :string = this.getValueByField("chrom",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let chromNum :string = chrom.match(/[0-9]+/gm)? chrom.match(/[0-9]+/gm)![0] : "NA"
       // if(variant==="-")
        //    variant="1234567"
        this.clinical_significance = this.getValueByField("clinical_significance",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.clinvar_variation_id = this.getValueByField("clinvar_variation_id",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.gnomad = {exome:null , genome:null}
        this.gold_stars = 5
        this.hgvsc = hgvsc? hgvsc :"NA"
        this.hgvsp = hgvsp? hgvsp : "NA"
        this.in_gnomad = true
        this.major_consequence = this.getValueByField("major_consequence",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.pos = Number(this.getValueByField("pos",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues))
        this.review_status = this.getValueByField("review_status",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.transcript_id = this.getValueByField("transcript_id",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
       // this.variant_id = this.feature_to_variant_value("variant_id", row, gnomad_json_features, gnomad_to_indices_mapp)
        this.symbol = this.getValueByField("symbol",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        this.variant_id = chromNum+"-"+variant+"-"+
                        this.getValueByField("ref",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)+
                        "-"+
                        this.getValueByField("alt",gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
    }
    // getValueByField(feature: string, rowOfValues: string[], gnomadToVcfMap: string[], vcfFieldsToIndices: number[]) {
    //     //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
    //     return rowOfValues[this.retriveMappedValue(this.retriveMappedValue(feature, gnomadToVcfMap), vcfFieldsToIndices)]

    // }
    // retriveMappedValue(name: string, map: any) {
    //     return map[name]
    // }
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
