"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let firstTime = true;
const trueLog = console.log;
// write logs to file
console.log = function (...msg) {
    const logfile = path_1.default.join(process.cwd(), '/tmp/log.log');
    if (!fs_1.default.existsSync(path_1.default.dirname(logfile)))
        fs_1.default.mkdirSync(path_1.default.dirname(logfile), { recursive: true });
    if (firstTime) {
        if (fs_1.default.existsSync(logfile))
            fs_1.default.unlinkSync(logfile);
        firstTime = false;
    }
    let text;
    if (msg.length === 1) {
        text = msg[0];
    }
    else {
        text = msg.join('\n');
    }
    if (text)
        fs_1.default.appendFile(logfile, text + '\n\n', function (err) {
            if (err) {
                return trueLog(err);
            }
        });
    // uncomment if you want logs
    if (msg.length === 1) {
        trueLog(msg[0]);
    }
    else if (msg.length > 1) {
        msg.forEach((log) => {
            trueLog(log);
        });
    }
};
// Just put this snippet on top of your nodejs code.
//# sourceMappingURL=console.js.map