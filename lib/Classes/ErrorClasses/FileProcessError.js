"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessError = void 0;
class FileProcessError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.FileProcessError = FileProcessError;
//# sourceMappingURL=FileProcessError.js.map