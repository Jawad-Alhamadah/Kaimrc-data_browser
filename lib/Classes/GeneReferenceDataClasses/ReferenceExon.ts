import GnomadData from "../ClinvarDataClasses/GnomadData"
export class  ReferenceTranscriptExon extends GnomadData{ 
    feature_type: string =""
    start: number=0 
    stop: number =0
    constructor(gnomadToFeatures: string[], featuresToValue: any[]) {
        super()
        this.feature_type = this.getValueByField("feature_type", gnomadToFeatures, featuresToValue)
        this.start=  this.getValueByField("start", gnomadToFeatures, featuresToValue)
        this.stop = this.getValueByField("stop", gnomadToFeatures, featuresToValue)
      

    }
 }
