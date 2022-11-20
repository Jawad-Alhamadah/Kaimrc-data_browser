
export default class GnomadData{

    constructor(){}

    getValueByField(feature: string, values: string[], firstLayerMap: any[], secondLayerMap: any[]) {
        //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
        return values[this.retriveMappedValue(this.retriveMappedValue(feature, firstLayerMap), secondLayerMap)]

    }

    retriveMappedValue(name: string, map: any) {
        return map[name]
    }
}