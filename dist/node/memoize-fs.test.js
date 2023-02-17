"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memoize_fs_1 = __importDefault(require("./memoize-fs"));
const memoizer = new memoize_fs_1.default();
memoizer.verbose = true;
//console.log(memoizer);
// => {
//   fn: [Function: fn],
//   getCacheFilePath: [Function: getCacheFilePathBound],
//   invalidate: [Function: invalidateCache]
// }
let idx = 0;
const func = function foo(a, b) {
    idx += a + b;
    return idx;
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    const memoizedFn = memoizer.fn(func);
    //memoizer.clear(func);
    for (let index = 0; index < 2; index++) {
        const r = Math.floor(Math.random() * (10 - 0 + 1) + 0);
        const resultOne = memoizedFn(1, r);
        console.log(resultOne, idx, idx === 0 ? 'cached' : 'non-cached');
    }
}))();
//# sourceMappingURL=memoize-fs.test.js.map