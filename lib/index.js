"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Weights = {
    thin: 100,
    "extra light": 200,
    light: 300,
    regular: 400,
    medium: 500,
    "semi-bold": 600,
    bold: 700,
    "extra bold": 800,
    black: 900,
};
function findInsertionPoint(arr, item) {
    let i = 0, len = arr.length;
    for (; i < len; i++) {
        if (item < arr[i])
            return i;
    }
    return i;
}
class GFont {
    constructor(cond) {
        this.collector = [];
        this.latestLock = 1;
        this.isCollecting = cond;
        this.linkTagId = "tjmora-g-font-" + (Math.random() + 1).toString(36).substring(7);
    }
    insertLinkTag() {
        let linkTag = document.createElement("link");
        linkTag.id = this.linkTagId;
        linkTag.rel = "stylesheet";
        linkTag.type = "text/css";
        linkTag.href = "";
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", (e) => {
                document.querySelector("head").appendChild(linkTag);
            }, false);
        }
        else {
            document.querySelector("head").appendChild(linkTag);
        }
    }
    attemptProvideLink(delay) {
        let lock = ++this.latestLock;
        /* The lock is to minimize the number of times that the style link tag's href
        * is dynamically changed in client-rendered components. */
        setTimeout(() => {
            if (lock === this.latestLock) {
                let linkTag = document.getElementById(this.linkTagId);
                if (typeof linkTag !== "undefined") {
                    linkTag.href = this.buildLink();
                }
                else
                    this.attemptProvideLink(delay * 2);
                /* delay more to wait for linkTag's creation,
                * also fails to recursive exponential delaying */
            }
        }, delay);
    }
    collectFont(name, style, weight) {
        let l = this.collector.length, s = -1, pos = 0;
        let collectorIsChanged = false;
        for (let i = 0; i < l; i++) {
            if (this.collector[i]["name"] === name) {
                s = i;
                break;
            }
        }
        if (s > -1) {
            // if font is already collected
            if (style === "normal") {
                if (this.collector[s].normWeights.indexOf(weight) === -1) {
                    pos = findInsertionPoint(this.collector[s].normWeights, weight);
                    this.collector[s].normWeights.splice(pos, 0, weight);
                    collectorIsChanged = true;
                }
            }
            else if (style === "italic") {
                if (this.collector[s].italWeights.indexOf(weight) === -1) {
                    pos = findInsertionPoint(this.collector[s].italWeights, weight);
                    this.collector[s].italWeights.splice(pos, 0, weight);
                    collectorIsChanged = true;
                }
            }
        }
        else {
            // if font needs to be collected
            this.collector.push({
                name: name,
                normWeights: style === "normal" ? [weight] : [],
                italWeights: style === "italic" ? [weight] : [],
            });
            collectorIsChanged = true;
        }
        return collectorIsChanged;
    }
    buildLink() {
        let href = "https://fonts.googleapis.com/css2?";
        let i = 0, l = this.collector.length, ln = 0, li = 0;
        for (; i < l; i++) {
            ln = this.collector[i].normWeights.length;
            li = this.collector[i].italWeights.length;
            href += "family=" + this.collector[i].name.split(" ").join("+");
            if (ln === 1 && this.collector[i].normWeights[0] === 400 && li === 0) {
                // do nothing
            }
            else if (ln === 0 && li === 1 && this.collector[i].italWeights[0] === 400) {
                href += ":ital@1";
            }
            else if (ln === 1 &&
                this.collector[i].normWeights[0] === 400 &&
                li === 1 &&
                this.collector[i].italWeights[0] === 400) {
                href += ":ital@0;1";
            }
            else if (ln > 0 && li === 0) {
                href +=
                    ":wght@" +
                        this.collector[i].normWeights.reduce((acc, cur) => acc + cur + ";", "");
                href = href.slice(0, href.length - 1); // remove last semi-colon
            }
            else {
                href +=
                    ":ital,wght@" +
                        this.collector[i].normWeights.reduce((acc, cur) => acc + "0," + cur + ";", "") +
                        this.collector[i].italWeights.reduce((acc, cur) => acc + "1," + cur + ";", "");
                href = href.slice(0, href.length - 1); // remove last semi-colon
            }
            href += "&";
        }
        href += "display=block";
        return href;
    }
    font(name, fallback, weight = 400, style = "normal") {
        if (typeof weight !== "number")
            weight = Weights[weight];
        if (this.isCollecting) {
            const isServerRendered = !(typeof window !== "undefined" &&
                window.document &&
                window.document.createElement);
            if (!isServerRendered && this.latestLock === 1)
                // true only in very first call to gFont for client-rendered components
                this.insertLinkTag();
            let collectorIsChanged = this.collectFont(name, style, weight);
            if (!isServerRendered && collectorIsChanged)
                this.attemptProvideLink(8);
        }
        return {
            css: "font-family: '" +
                name +
                "', " +
                fallback +
                "; font-style: " +
                style +
                "; font-weight: " +
                weight +
                ";",
            obj: {
                fontFamily: "'" + name + "', " + fallback,
                fontStyle: style,
                fontWeight: weight + "",
            },
        };
    }
}
exports.default = GFont;
