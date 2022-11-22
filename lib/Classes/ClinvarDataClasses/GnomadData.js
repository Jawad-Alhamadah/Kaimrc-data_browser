"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GnomadData {
    constructor() { }
    //this function gets values from column names maps.
    // gnomad has features named differently compared to Kaimrc data
    //feature - > first map[feature]  -> paired feature  - > second map[paired feature]  - > value 
    //if given a row of data, then the value produced would be an index that goes to the row of data to get the value
    //feature - > first map[feature]  -> paired feature  - > second map[paired feature]  - > index -> row[index] -> value 
    getValueByField(feature, firstLayerMap, secondLayerMap, rowOfData) {
        //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
        if (rowOfData)
            return rowOfData[this.retriveMappedValue(this.retriveMappedValue(feature, firstLayerMap), secondLayerMap)];
        return this.retriveMappedValue(this.retriveMappedValue(feature, firstLayerMap), secondLayerMap);
    }
    retriveMappedValue(name, map) {
        return map[name];
    }
    toJson() {
        //this is only used to get the propertynames.
        // let variant = new Class([],[],[],true)
        let json = {};
        for (let x in this) {
            json[x] = this[x];
        }
        return json;
        // return {
        //     clinical_significance: this.clinical_significance,
        //     clinvar_variation_id: this.clinvar_variation_id,
        //     gnomad: this.gnomad,
        //     gold_stars: this.gold_stars,
        //     hgvsc: this.hgvsc,
        //     hgvsp: this.hgvsp,
        //     in_gnomad: this.in_gnomad,
        //     major_consequence: this.major_consequence,
        //     pos: this.pos,
        //     review_status: this.review_status,
        //     transcript_id: this.transcript_id,
        //     variant_id: this.variant_id,
        //     symbol: this.symbol
        // }
    }
}
exports.default = GnomadData;
//# sourceMappingURL=GnomadData.js.map