var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// copy static files into docs
const { promises: fs } = require('fs');
const path = require('path');
function copyDir(src, dest) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fs.mkdir(dest, { recursive: true });
        let entries = yield fs.readdir(src, { withFileTypes: true });
        for (let entry of entries) {
            let srcPath = path.join(src, entry.name);
            let destPath = path.join(dest, entry.name);
            entry.isDirectory() ? yield copyDir(srcPath, destPath) : yield fs.copyFile(srcPath, destPath);
        }
    });
}
copyDir(path.join(__dirname, 'static'), path.join(__dirname, '/../docs'));
//# sourceMappingURL=copy.js.map