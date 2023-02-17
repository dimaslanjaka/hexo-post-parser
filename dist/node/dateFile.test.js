"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const dateFile_1 = require("./dateFile");
(0, dateFile_1.getModifiedDateOfFile)((0, path_1.join)(__dirname, 'cache.ts')).then(console.log);
//# sourceMappingURL=dateFile.test.js.map