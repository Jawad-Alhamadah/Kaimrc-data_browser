export class Reference {
    consequence: string = ""
    flags: [] | null = null
    hgvs: string = ""
    chrom:string
    source: string
    feature_type:string
    start:number
    stop:number
    score:string
    strand:string
    frame:number
    gene_id:string
    canonical_transcript_id:string
    hgnc_id:string
    level:string
    symbol:string


    constructor(gnomadToFeatures: string[], featuresToValue: any[]) {
        let variant:string = this.getValueByField("pos", gnomadToFeatures, featuresToValue)
        let hgvsc:string  = this.getValueByField("hgvsc", gnomadToFeatures, featuresToValue).split(":")[1]
        let hgvsp:string  = this.getValueByField("hgvsp", gnomadToFeatures, featuresToValue).split(":")[1]
        this.chrom = 

    }
    getValueByField(feature: string, gnomadFieldToFieldMap: string[], fieldsValueMap: number[]) {
        //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
        return this.retriveMappedValue(this.retriveMappedValue(feature, gnomadFieldToFieldMap), fieldsValueMap)

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