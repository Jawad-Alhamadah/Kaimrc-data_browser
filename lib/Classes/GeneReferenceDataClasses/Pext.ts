import { PextRegion } from "./PextRegion"
import GnomadData from "../ClinvarDataClasses/GnomadData"
export class Pext extends GnomadData{

    regions: PextRegion[] =[]
    flags: any[] = []
}