import GnomadData from "./GnomadData"
export class Variant extends GnomadData {
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


    constructor(rowOfValues: string[], gnomadToVcfMap: string[], vcfFieldsToIndices: any[]) {
        super()
        let variant: string     = this.getValueByField("pos", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let hgvsc: string       = this.getValueByField("hgvsc", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1]
        let hgvsp: string       = this.getValueByField("hgvsp", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1]
        let hgvs: string        = this.getValueByField("hgvs", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues).split(":")[1]
        let chrom: string       = this.getValueByField("chrom", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let chromNum: string    = chrom.match(/[0-9]+/gm) ? chrom.match(/[0-9]+/gm)![0] : "NA"
        let ref:string          = this.getValueByField("ref", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let alt:string          = this.getValueByField("alt", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let genomeAc:number     = Number(this.getValueByField("ac", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues))
        let genomeAcHemi:number = Number(this.getValueByField("ac_hemi", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues))
        let genomeAcHom:number  = Number(this.getValueByField("ac_hom", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues))
        let genomeAn:number     = Number(this.getValueByField("an", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)) * 2
        let genomeAf:number     = Number(this.getValueByField("af", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues))
        let consequence:string  = this.getValueByField("consequence", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let pos: number         = Number(this.getValueByField("pos", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues))
        let rsids:string        = this.getValueByField("rsids", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let transcript_id       = this.getValueByField("transcript_id", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)
        let transcript_version  = this.getValueByField("transcript_version", gnomadToVcfMap, vcfFieldsToIndices, rowOfValues)

        this.consequence = consequence
        this.flags = []
        this.hgvsc = hgvsc ? hgvsc : "NA"
        this.hgvsp = hgvsp ? hgvsp : "NA"
        this.hgvs = hgvs ? hgvs : "NA"
        this.lof = null
        this.lof_filter = null
        this.lof_flags = null
        this.pos = pos
        this.rsids.push(rsids)
        this.transcript_id = transcript_id
        this.transcript_version = transcript_version
        this.variant_id = `${chromNum}-${variant}-${ref}-${alt}`
        this.lof_curation = null
        this.exome = null
        this.genome = {
            ac: genomeAc,
            ac_hemi: genomeAcHemi,
            ac_hom: genomeAcHom,
            an: genomeAn,
            af: genomeAf,
            filters: [],
            populations: []
        }
        
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