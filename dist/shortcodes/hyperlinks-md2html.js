"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceMD2HTML = void 0;
const tslib_1 = require("tslib");
const color_1 = tslib_1.__importDefault(require("../node/color"));
// fix all hyperlinks endsWith .md
// [test](test.md) -> [test](test.html)
const regex = /\[([^\]]+)\]\(([^)]+(.md))\)/gim;
const logname = color_1.default['Blizzard Blue']('[replaceMD2HTML]');
/**
 * Replace hyperlinks endswith .md with .html
 * @param content body string
 * @returns
 */
function replaceMD2HTML(content) {
    if (content.match(regex)) {
        content = content.replace(regex, function (wholeMatch, _index1, index2, index3) {
            // act here or after the loop...
            //console.log(index2, index3);
            const toReplace = index2;
            const replacement = index2.replace(new RegExp(index3 + '$'), '.html');
            console.log(logname, color_1.default.redBright(toReplace), '->', color_1.default.greenBright(replacement));
            //return wholeMatch.replace(index3, '.html');
            return wholeMatch.replace(toReplace, replacement);
        });
    }
    return content;
}
exports.replaceMD2HTML = replaceMD2HTML;
exports.default = replaceMD2HTML;
//# sourceMappingURL=hyperlinks-md2html.js.map