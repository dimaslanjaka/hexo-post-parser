"use strict";
/**
 * Get information date of files
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModifiedDateOfFile = void 0;
const fs = __importStar(require("fs"));
/**
 * get modified date of file
 * @param path
 * @returns
 */
function getModifiedDateOfFile(path) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path))
            throw new Error(path + ' is not exist');
        // fetch file details
        fs.stat(path, (err, stats) => {
            if (err) {
                return reject(err);
            }
            // print file last modified date
            //console.log(`File Data Last Modified: ${stats.mtime}`);
            //console.log(`File Status Last Modified: ${stats.ctime}`);
            const obj = {
                mtime: stats.mtime,
                ctime: stats.ctime,
                'Status Last Modified': stats.ctime,
                'Data Last Modified': stats.mtime
            };
            return resolve(obj);
        });
    });
}
exports.getModifiedDateOfFile = getModifiedDateOfFile;
//# sourceMappingURL=dateFile.js.map