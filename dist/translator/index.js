"use strict";
// renew flow
// GET https://translate.google.com/gen204?proxye=website&client=webapp&sl=id&tl=en&hl=en&u=https%253A%252F%252F9f9f7cf85cf1.ngrok.io%252F2020%252F6%252F10%252Fupdate-gen
// GET https://translate.google.com/translate?hl=en&sl=id&tl=en&u=https%3A%2F%2F9f9f7cf85cf1.ngrok.io%2F2020%2F6%2F10%2Fupdate-genshin-impact-1.6.0-1.6.1.html&sandbox=1
// GET https://translate.googleusercontent.com/translate_p?hl=en&sl=id&tl=en&u=https://9f9f7cf85cf1.ngrok.io/2020/6/10/update-genshin-impact-1.6.0-1.6.1.html&depth=1&rurl=translate.google.com&sp=nmt4&pto=aue,ajax,boq&usg=ALkJrhgAAAAAYMQSbrcRl2o4a3kZsbz6V0Mz1jPOGzly
// GET https://translate.google.com/website?depth=1&hl=en&pto=aue,ajax,boq&rurl=translate.google.com&sl=id&sp=nmt4&tl=en&u=https://9f9f7cf85cf1.ngrok.io/2020/6/10/update-genshin-impact-1.6.0-1.6.1.html&usg=ALkJrhgP3S6k0r9M1L0I0usu2YoSrco1KQ
// GET https://9f9f7cf85cf1-ngrok-io.translate.goog/2020/6/10/update-genshin-impact-1.6.0-1.6.1.html?_x_tr_sl=id&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=ajax
// GET https://translate.google.com/translate_un?sl=id&tl=en&u=https://9f9f7cf85cf1.ngrok.io/2020/6/10/update-genshin-impact-1.6.0-1.6.1.html&usg=ALkJrhg-dpAhmINQHidHIs0byhWyENzuSA
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const jsdom_1 = __importDefault(require("jsdom"));
const node_libcurl_1 = require("node-libcurl");
const path_1 = __importDefault(require("path"));
const { JSDOM } = jsdom_1.default;
const cookieJarFile = path_1.default.join(__dirname, '/../../build/cookiejar.txt');
class Translator {
    constructor(sourceLang, toLang) {
        this.sl = sourceLang;
        this.tl = toLang;
    }
    try1(url, callback) {
        const parseUrl = new URL(url);
        const self = this;
        this.request(`https://translate.google.com/gen204?proxye=website&client=webapp&sl=${this.sl}&tl=${this.tl}&hl=en&u=${encodeURIComponent(url)}`);
        this.request(`https://translate.google.com/translate?hl=en&sl=${this.sl}&tl=${this.tl}&u=${encodeURIComponent(url)}&sandbox=1`);
        this.request(`https://translate.googleusercontent.com/translate_p?hl=en&sl=${this.sl}&tl=${this.tl}&u=${decodeURIComponent(url)}&depth=1&rurl=translate.google.com&sp=nmt4&pto=aue,ajax,boq&usg=ALkJrhgAAAAAYMQSbrcRl2o4a3kZsbz6V0Mz1jPOGzly`);
        this.request(`https://translate.google.com/website?depth=1&hl=en&pto=aue,ajax,boq&rurl=translate.google.com&sl=${this.sl}&sp=nmt4&tl=${this.tl}&u=${decodeURIComponent(url)}&usg=ALkJrhgP3S6k0r9M1L0I0usu2YoSrco1KQ`);
        const parse = new URL(url);
        this.request(`https://${parse.host.replace(/\./, '-')}.translate.goog${parseUrl.pathname}?_x_tr_sl=${this.sl}&_x_tr_tl=${this.tl}&_x_tr_hl=en&_x_tr_pto=ajax`);
        this.request(`https://translate.google.com/translate_un?sl=${this.sl}&tl=${this.tl}&u=${decodeURIComponent(url)}&usg=ALkJrhg-dpAhmINQHidHIs0byhWyENzuSA`);
        this.request(`http://translate.google.com/translate?depth=1&nv=1&rurl=translate.google.com&sl=${this.sl}&sp=nmt4&tl=${this.tl}&u=${encodeURI(url)}`, function (_statusCode, data, _headers, _curlInstance) {
            self.result = data;
            if (typeof callback == 'function') {
                callback(String(data));
            }
        });
        return this;
    }
    try2(html, callback) {
        const self = this;
        let dom = new JSDOM(html);
        const contentFrame = dom.window.document.getElementById('contentframe');
        const iframe = contentFrame.getElementsByTagName('iframe');
        if (iframe.length > 0) {
            const frm = iframe.item(0);
            this.request(frm.src, function (_status, data, _headers, _curlInstance) {
                dom = new JSDOM(data);
                const hyperlinks = dom.window.document.getElementsByTagName('a');
                if (hyperlinks.length > 0) {
                    self.request(hyperlinks.item(0).href, function (_status, data, _headers, _curlInstance) {
                        self.result = data;
                        if (typeof callback == 'function') {
                            callback(String(data));
                        }
                    });
                }
            });
        }
        return this;
    }
    extractTranslated(html) {
        const dom = new JSDOM(html);
        // fix hyperlinks
        const hyperlinks = dom.window.document.getElementsByTagName('a');
        for (let i = 0; i < hyperlinks.length; i++) {
            const hyperlink = hyperlinks.item(i);
            const href = new URL(hyperlink.href);
            const getHref = href.searchParams.get('u');
            if (getHref && getHref.length > 0) {
                hyperlink.href = getHref;
            }
        }
        dom.window.document.getElementById('gt-nvframe').remove();
        const head = dom.window.document.head;
        const base = head.getElementsByTagName('base');
        Array.from(base).map((basehtml) => {
            basehtml.remove();
        });
        return dom.serialize();
    }
    capture(parentHtml) {
        const dom = new JSDOM(parentHtml);
        const script = dom.window.document.createElement('script');
        script.innerHTML = String(fs_1.default.readFileSync(path_1.default.join(__dirname, 'translate-capture.js')));
        dom.window.document.body.appendChild(script);
        return dom.serialize();
    }
    /**
     * Curl Requester
     * @param url
     * @param responseCallback
     */
    request(url, responseCallback) {
        if (this.debug)
            console.info(`GET ${url}`);
        const curl = new node_libcurl_1.Curl();
        curl.setOpt(node_libcurl_1.Curl.option.URL, url);
        curl.setOpt(node_libcurl_1.Curl.option.COOKIEFILE, cookieJarFile);
        curl.setOpt(node_libcurl_1.Curl.option.COOKIEJAR, cookieJarFile);
        if (!fs_1.default.existsSync(cookieJarFile)) {
            fs_1.default.writeFileSync(cookieJarFile, '');
        }
        // curl.setOpt(Curl.option.CONNECTTIMEOUT, 5)
        curl.setOpt(node_libcurl_1.Curl.option.FOLLOWLOCATION, true);
        curl.setOpt(node_libcurl_1.Curl.option.SSL_VERIFYHOST, false);
        curl.setOpt(node_libcurl_1.Curl.option.SSL_VERIFYPEER, false);
        curl.setOpt(node_libcurl_1.Curl.option.CUSTOMREQUEST, 'GET');
        //curl.setOpt(Curl.option.VERBOSE, true);
        curl.setOpt(node_libcurl_1.Curl.option.USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36');
        // eslint-disable-next-line no-unused-vars
        curl.on('end', (statusCode, data, headers, curlInstance) => {
            /*
            console.info(statusCode);
            console.info("---");
            console.info(data.length);
            console.info("---");
            console.info(curl.getInfo("TOTAL_TIME"));
            console.info("---");
            console.info(headers);
            */
            if (typeof responseCallback == 'function') {
                responseCallback(statusCode, data, headers, curlInstance);
            }
            curl.close();
        });
        // Error will be a JS error, errorCode will be the raw error code (as int) returned from libcurl
        // eslint-disable-next-line no-unused-vars
        curl.on('error', (_error, _errorCode) => {
            curl.close();
        });
        //curl.on("error", curl.close.bind(curl));
        // this triggers the request
        curl.perform();
        return this;
    }
    toString() {
        return this.result || 'Translator Class';
    }
}
exports.default = Translator;
//# sourceMappingURL=index.js.map