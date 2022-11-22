import GnomadData from "../ClinvarDataClasses/GnomadData"
import { ReferenceExon } from "./ReferenceExon"
import { GnomadReferenceConstraint } from "./GnomadReferenceConstraint"
import { ExacReferenceConstraint } from "./ExacReferenceConstraint"
import { ReferenceTranscripts } from "./ReferenceTranscripts"
import { Pext } from "./Pext"
export class Reference extends GnomadData {
    reference_genome: string
    gene_id: string
    gene_version: string
    symbol: string
    gencode_symbol: string
    name: string
    canonical_transcript_id: string
    mane_select_transcript: string | null
    hgnc_id: string
    ncbi_id: string
    omim_id: string
    chrom: string
    start: number
    stop: number
    strand: string
    exons: ReferenceExon[]
    flags: []
    gnomad_constraint: GnomadReferenceConstraint
    exac_constraint: ExacReferenceConstraint
    transcripts: ReferenceTranscripts[]
    pext: Pext
    exac_regional_missense_constraint_regions: any[] | null
    // source: string
    // feature_type: string

    // score: string

    // frame: number

    //  transcript_version: string


    constructor(gnomadToFeatures: string[], featuresToValue: any[]) {
        super()
        let hgnc = this.getValueByField("hgnc_id", gnomadToFeatures, featuresToValue)
        this.reference_genome = "gencode.v38.annotation"
        this.gene_id = this.getValueByField("gene_id", gnomadToFeatures, featuresToValue)
        this.gene_version = "9"
        this.symbol = this.getValueByField("symbol", gnomadToFeatures, featuresToValue)
        this.gencode_symbol = this.getValueByField("gencode_symbol", gnomadToFeatures, featuresToValue)
        this.name = "unknown"
        this.canonical_transcript_id = this.getValueByField("canonical_transcript_id", gnomadToFeatures, featuresToValue)
        this.mane_select_transcript = null
        this.hgnc_id = hgnc ? hgnc : "NA"
        this.ncbi_id = "NA"
        this.omim_id = "NA"
        this.chrom = this.getValueByField("chrom", gnomadToFeatures, featuresToValue)
        this.start = Number(this.getValueByField("start", gnomadToFeatures, featuresToValue))
        this.stop = Number(this.getValueByField("stop", gnomadToFeatures, featuresToValue))
        this.strand = this.getValueByField("strand", gnomadToFeatures, featuresToValue)
        this.exons = []
        this.flags = []
        this.gnomad_constraint = {} as GnomadReferenceConstraint
        this.exac_constraint = {} as ExacReferenceConstraint
        this.transcripts = []
        this.pext = {} as Pext
        this.exac_regional_missense_constraint_regions = null
    }

    toJson() {
        return {
            reference_genome :  this.reference_genome,
            gene_id :  this.gene_id ,
            gene_version : this.gene_version ,
            symbol :  this.symbol,
            gencode_symbol : this.gencode_symbol,
            name :  this.name ,
            canonical_transcript_id :  this.canonical_transcript_id,
            mane_select_transcript :  this.mane_select_transcript,
            hgnc_id :  this.hgnc_id,
            ncbi_id :  this.ncbi_id,
            omim_id :  this.omim_id, 
            chrom :  this.chrom,
            start : this.start,
            stop : this.stop ,
            strand :   this.strand, 
            exons :  this.exons ,
            flags :  this.flags,
            gnomad_constraint : this.gnomad_constraint ,
            exac_constraint :  this.exac_constraint ,
            transcripts : this.transcripts,
            pext :  this.pext ,
            exac_regional_missense_constraint_regions :  this.exac_regional_missense_constraint_regions
        }
    }
}