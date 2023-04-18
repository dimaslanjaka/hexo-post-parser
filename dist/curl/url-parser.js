"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_parse_1 = __importDefault(require("url-parse"));
/**
 * Automatically parse url with the query strings to object (nullable)
 * @param src url string
 * @returns object parsed {@link URLParsed} combined with partial properties from {@link urlParse}
 */
function urlParser(src) {
    if (!src)
        return;
    const parser = (0, url_parse_1.default)(src);
    const searchObject = [];
    const queries = parser.query.replace(/^\?/, '').split('&');
    let split = [];
    for (let i = 0; i < queries.length; i++) {
        split = queries[i].split('=').map((str) => str.length > 0);
        if (0 in split) {
            searchObject[split[0]] = split[1];
        }
    }
    const parsed = {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        hash: parser.hash,
        protohost: parser.protocol + '//' + parser.host,
        search: parser.query,
        searchObject: searchObject,
        filename: parser.href.split('/').removeEmpties().unique().last(1)[0]
    };
    /*for (const key in parser) {
      if (Object.prototype.hasOwnProperty.call(parser, key)) {
        parsed[key] = parser[key];
      }
    }*/
    return Object.assign(parsed, parser);
}
exports.default = urlParser;
//# sourceMappingURL=url-parser.js.map