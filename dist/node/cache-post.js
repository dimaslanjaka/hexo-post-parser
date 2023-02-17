"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const cache_1 = __importDefault(require("./cache"));
class CachePost extends cache_1.default {
    constructor() {
        super('posts');
    }
}
exports.default = CachePost;
exports.Post = CachePost;
//# sourceMappingURL=cache-post.js.map