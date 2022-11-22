import { ReferenceExon } from "./ReferenceExon"
import { GtxTissueExpression } from "./GtxTissueExpression"
export class ReferenceTranscripts {
    transcript_id: string =""
    transcript_version: string=""
    strand: string=""
    exons: ReferenceExon[] = []
    gtex_tissue_expression: GtxTissueExpression = {} as GtxTissueExpression
    
}