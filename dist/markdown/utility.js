"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeListOf2Html = void 0;
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
function nodeListOf2Html(nodes) {
    return Array.prototype.reduce.call(nodes, function (html, node) {
        return html + (node.outerHTML || node.nodeValue);
    }, '');
}
exports.nodeListOf2Html = nodeListOf2Html;
//# sourceMappingURL=utility.js.map