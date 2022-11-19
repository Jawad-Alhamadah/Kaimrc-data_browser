export class Variant {
    consequence: string = ""
    flags: [] | null = null
    hgvs: string = ""
    hgvsc: string = ""
    hgvsp: string = ""
    lof: string | null = null
    lof_filter: string | null = null
    lof_flags: string | null = null
    pos: number = 0
    rsids: string[] = []
    transcript_id: string = ""
    transcript_version: string = ""
    variant_id: string = ""
    exome: {
        ac: number,
        ac_hemi: number,
        ac_hom: number,
        an: number,
        af: number,
        filters: any[],
        populations: [] | null
    } | null = null
    genome: {
        ac: number,
        ac_hemi: number,
        ac_hom: number,
        an: number,
        af: number,
        filters: any[],
        populations: [] | null
    } | null = null
    lof_curation: null = null


    constructor(row: string[], gnomadToVcfMap: string[], vcfFieldsToIndices: any[]) {
        let variant:string = this.getValueByField("pos", row, gnomadToVcfMap, vcfFieldsToIndices)
        let hgvsc:string  = this.getValueByField("hgvsc", row, gnomadToVcfMap, vcfFieldsToIndices).split(":")[1]
        let hgvsp:string  = this.getValueByField("hgvsp", row, gnomadToVcfMap, vcfFieldsToIndices).split(":")[1]
        let hgvs:string  = this.getValueByField("hgvs", row, gnomadToVcfMap, vcfFieldsToIndices).split(":")[1]
        let chrom  :string = this.getValueByField("chrom", row, gnomadToVcfMap, vcfFieldsToIndices)
        let chromNum :string = chrom.match(/[0-9]+/gm)? chrom.match(/[0-9]+/gm)![0] : "NA"
        this.consequence = this.getValueByField("consequence", row, gnomadToVcfMap, vcfFieldsToIndices)
        this.flags = []
        this.hgvsc = hgvsc? hgvsc :"NA"
        this.hgvsp = hgvsp? hgvsp : "NA"
        this.hgvs =  hgvs? hgvs: "NA"
        this.lof = null
        this.lof_filter = null
        this.lof_flags = null
        this.pos = Number(this.getValueByField("pos", row, gnomadToVcfMap, vcfFieldsToIndices))
        this.rsids = []
        this.transcript_id = this.getValueByField("transcript_id", row, gnomadToVcfMap, vcfFieldsToIndices)
        this.transcript_version = this.getValueByField("transcript_version", row, gnomadToVcfMap, vcfFieldsToIndices)
        this.variant_id = chromNum+"-"+variant+"-"+
                        this.getValueByField("ref", row, gnomadToVcfMap, vcfFieldsToIndices)+
                        "-"+
                        this.getValueByField("alt", row, gnomadToVcfMap, vcfFieldsToIndices)
       // this.variant_id = this.getValueByField("variant_id", row, gnomadToVcfMap, vcfFieldsToIndices)
        //this.variant_id = "1-1-"+this.feature_to_variant_value("ref", row, gnomadJsonFeatures, gnomadToIndicesMap)+"-"+this.feature_to_variant_value("alt", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.exome = null
        this.genome = {
            ac: Number(this.getValueByField("ac", row, gnomadToVcfMap, vcfFieldsToIndices)),
            ac_hemi: Number(this.getValueByField("ac_hemi", row, gnomadToVcfMap, vcfFieldsToIndices)),
            ac_hom: Number(this.getValueByField("ac_hom", row, gnomadToVcfMap, vcfFieldsToIndices)),
            an: Number(this.getValueByField("an", row, gnomadToVcfMap, vcfFieldsToIndices)) * 2,
            af: Number(this.getValueByField("af", row, gnomadToVcfMap, vcfFieldsToIndices)),
            filters: [],
            populations: []
        }
        this.lof_curation = null

    }
    getValueByField(feature: string, valuesRow: string[], gnomadToVcfMap: string[], vcfFieldsToIndices: number[]) {
        //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
        return valuesRow[this.retriveMappedValue(this.retriveMappedValue(feature, gnomadToVcfMap), vcfFieldsToIndices)]

    }
    retriveMappedValue(name: string, map: any) {
        return map[name]
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
        }
    }
}