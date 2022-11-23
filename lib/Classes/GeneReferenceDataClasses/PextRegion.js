"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PextRegion = void 0;
const PextRegionTissue_1 = require("./PextRegionTissue");
class PextRegion {
    constructor() {
        this.start = 0;
        this.stop = 0;
        this.mean = 0;
        this.tissues = new PextRegionTissue_1.PextRegionTissue();
    }
}
exports.PextRegion = PextRegion;
//# sourceMappingURL=PextRegion.js.map