export interface GnomadReferenceConstraint {
    exp_lof: number
    exp_mis: number
    exp_syn: number
    obs_lof: number
    obs_mis: number
    obs_syn: number
    oe_lof: number
    oe_lof_lower: number
    oe_lof_upper: number
    oe_mis: number
    oe_mis_lower: number
    oe_mis_upper: number
    oe_syn: number
    oe_syn_lower: number
    oe_syn_upper: number
    lof_z: number
    mis_z: number
    syn_z: number
    pLI: number
    flags: any[]

}