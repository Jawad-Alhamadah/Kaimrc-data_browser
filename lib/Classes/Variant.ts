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


    constructor(row: string[], gnomadJsonFeatures: string[], gnomadToIndicesMap: any[]) {
        this.consequence = this.feature_to_variant_value("consequence", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.flags = []
        this.hgvs = this.feature_to_variant_value("hgvs", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.hgvsc = this.feature_to_variant_value("hgvsc", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.hgvsp = this.feature_to_variant_value("hgvsp", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.lof = null
        this.lof_filter = null
        this.lof_flags = null
        this.pos = Number(this.feature_to_variant_value("pos", row, gnomadJsonFeatures, gnomadToIndicesMap))
        this.rsids = []
        this.transcript_id = this.feature_to_variant_value("transcript_id", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.transcript_version = this.feature_to_variant_value("transcript_version", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.variant_id = this.feature_to_variant_value("variant_id", row, gnomadJsonFeatures, gnomadToIndicesMap)
        this.exome = null
        this.genome = {
            ac: Number(this.feature_to_variant_value("ac", row, gnomadJsonFeatures, gnomadToIndicesMap)),
            ac_hemi: Number(this.feature_to_variant_value("ac_hemi", row, gnomadJsonFeatures, gnomadToIndicesMap)),
            ac_hom: Number(this.feature_to_variant_value("ac_hom", row, gnomadJsonFeatures, gnomadToIndicesMap)),
            an: Number(this.feature_to_variant_value("an", row, gnomadJsonFeatures, gnomadToIndicesMap)) * 2,
            af: Number(this.feature_to_variant_value("af", row, gnomadJsonFeatures, gnomadToIndicesMap)),
            filters: [],
            populations: []
        }
        this.lof_curation = null

    }
    feature_to_variant_value(feature: string, valuesRow: string[], clinvarGnomadToIndicesMap: string[], indicesGnomadToIndicesMap: number[]) {
        //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
        return valuesRow[this.retrive_mapped_value(this.retrive_mapped_value(feature, clinvarGnomadToIndicesMap), indicesGnomadToIndicesMap)]

    }
    retrive_mapped_value(name: string, map: any) {
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