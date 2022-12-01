"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptySearchTermError = void 0;
class EmptySearchTermError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.EmptySearchTermError = EmptySearchTermError;
//# sourceMappingURL=EmptySearchTermError.js.map