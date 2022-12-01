import { ReferenceTranscriptExon } from "./ReferenceTranscriptExon"
import { GtxTissueExpression } from "./GtxTissueExpression"
import GnomadData from "../ClinvarDataClasses/GnomadData"
export class ReferenceTranscript extends GnomadData {
    transcript_id: string = ""
    transcript_version: string = ""
    strand: string = ""
    exons: ReferenceTranscriptExon[] = []
    gtex_tissue_expression: GtxTissueExpression = new GtxTissueExpression()
    constructor(gnomadToFeatures: string[], featuresToValue: any[]) {
        super()
        this.transcript_id = this.getValueByField("transcript_id", gnomadToFeatures, featuresToValue)
        this.transcript_version = this.getValueByField("transcript_version", gnomadToFeatures, featuresToValue)
        this.strand = this.getValueByField("strand", gnomadToFeatures, featuresToValue)
        this.exons = []
        this.gtex_tissue_expression = new GtxTissueExpression()

    }

}