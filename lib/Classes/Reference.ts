import GnomadData from "./GnomadData"
export class Reference extends GnomadData {

    chrom: string
    source: string
    feature_type: string
    start: number
    stop: number
    score: string
    strand: string
    frame: number
    gene_id: string
    hgnc_id: string
    transcript_version: string
    symbol: string
    canonical_transcript_id: string

    constructor(gnomadToFeatures: string[], featuresToValue: any[]) {
        super()
        let hgnc = this.getValueByField("hgnc_id", gnomadToFeatures, featuresToValue)
        this.chrom                   = this.getValueByField("chrom", gnomadToFeatures, featuresToValue)
        this.source                  = this.getValueByField("source", gnomadToFeatures, featuresToValue)
        this.feature_type            = this.getValueByField("feature_type", gnomadToFeatures, featuresToValue)
        this.start                   = Number(this.getValueByField("start", gnomadToFeatures, featuresToValue))
        this.stop                    = Number(this.getValueByField("stop", gnomadToFeatures, featuresToValue))
        this.score                   = this.getValueByField("score", gnomadToFeatures, featuresToValue)
        this.strand                  = this.getValueByField("strand", gnomadToFeatures, featuresToValue)
        this.frame                   = this.getValueByField("frame", gnomadToFeatures, featuresToValue)
        this.gene_id                 = this.getValueByField("gene_id", gnomadToFeatures, featuresToValue)
        this.hgnc_id                 = hgnc? hgnc : "NA"
        this.transcript_version      = this.getValueByField("transcript_version", gnomadToFeatures, featuresToValue)
        this.symbol                  = this.getValueByField("symbol", gnomadToFeatures, featuresToValue)
        this.canonical_transcript_id = this.getValueByField("canonical_transcript_id", gnomadToFeatures, featuresToValue)

    }

    toJson() {
        return {

        }
    }
}