"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClinvarVariant = void 0;
class ClinvarVariant {
    constructor(row, gnomad_json_features, gnomad_to_indices_mapp) {
        this.clinical_significance = this.feature_to_variant_value("clinical_significance", row, gnomad_json_features, gnomad_to_indices_mapp);
        this.clinvar_variation_id = this.feature_to_variant_value("clinvar_variation_id", row, gnomad_json_features, gnomad_to_indices_mapp);
        this.gnomad = null;
        this.gold_stars = 1;
        this.hgvsc = this.feature_to_variant_value("hgvsc", row, gnomad_json_features, gnomad_to_indices_mapp);
        this.hgvsp = this.feature_to_variant_value("hgvsp", row, gnomad_json_features, gnomad_to_indices_mapp);
        this.in_gnomad = true;
        this.major_consequence = this.feature_to_variant_value("major_consequence", row, gnomad_json_features, gnomad_to_indices_mapp);
        this.pos = Number(this.feature_to_variant_value("pos", row, gnomad_json_features, gnomad_to_indices_mapp));
        this.review_status = this.feature_to_variant_value("review_status", row, gnomad_json_features, gnomad_to_indices_mapp);
        this.transcript_id = this.feature_to_variant_value("transcript_id", row, gnomad_json_features, gnomad_to_indices_mapp);
        this.variant_id = this.feature_to_variant_value("variant_id", row, gnomad_json_features, gnomad_to_indices_mapp);
    }
    feature_to_variant_value(feature, values_row, clinvar_gnomad_to_indices_mapp, indices_gnomad_to_indices_mapp) {
        //console.log(retrive_mapped_value(feature,clinvar_gnomad_to_indices_mapp))
        return values_row[this.retrive_mapped_value(this.retrive_mapped_value(feature, clinvar_gnomad_to_indices_mapp), indices_gnomad_to_indices_mapp)];
    }
    retrive_mapped_value(name, map) {
        return map[name];
    }
    toJson() {
        return {
            clinical_significance: this.clinical_significance,
            clinvar_variation_id: this.clinvar_variation_id,
            gnomad: this.gnomad,
            gold_stars: this.gold_stars,
            hgvsc: this.hgvsc,
            hgvsp: this.hgvsp,
            in_gnomad: this.in_gnomad,
            major_consequence: this.major_consequence,
            pos: this.pos,
            review_status: this.review_status,
            transcript_id: this.transcript_id,
            variant_id: this.variant_id
        };
    }
}
exports.ClinvarVariant = ClinvarVariant;
