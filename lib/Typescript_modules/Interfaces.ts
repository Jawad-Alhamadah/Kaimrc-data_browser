import { ClinvarVariant } from "../Classes/ClinvarVariant"
import { Variant } from "../Classes/Variant"

// export interface ClinvarVariant extends Object {
//     clinical_significance: string,
//     clinvar_variation_id: string,
//     gnomad?: { exome: { ac: number, an: number, filters: string[] } | null, genome: { ac: number, an: number, filters: string[] } | null } | null,
//     gold_stars: number,
//     hgvsc: string,
//     hgvsp: string,
//     in_gnomad: true,
//     major_consequence: string,
//     pos: number,
//     review_status: string,
//     transcript_id: string,
//     variant_id: string

//   }

//   export interface Variant extends Object {
//     consequence: string,
//     flags: [],
//     hgvs: string,
//     hgvsc: string,
//     hgvsp: string,
//     lof: string|null,
//     lof_filter: string|null,
//     lof_flags: string|null,
//     pos: number,
//     rsids: string[],
//     transcript_id: string,
//     transcript_version: string,
//     variant_id: string,
//     exome: {
//       ac: number,
//       ac_hemi: number,
//       ac_hom: number,
//       an: number,
//       af: number,
//       filters: any[],
//       populations: null
//     }|null,
//     genome: {
//       ac: number,
//       ac_hemi: number,
//       ac_hom: number,
//       an: number,
//       af: number,
//       filters: any[],
//       populations: null
//     }|null,
//     lof_curation: null
//   }
export interface GnomadDataJson {
    data: {
        meta: {},
        gene: {
            clinvar_variants: object[],
            variants: object[]

        }
    }
}