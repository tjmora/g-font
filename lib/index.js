"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLink = void 0;
const LINKTAG_ID = "load-gFont-pkg-linktag";
let collector = [];
let latestLock = 1, stylesheetIsLoading = true;
function findInsertionPoint(arr, item) {
    let i = 0, len = arr.length;
    for (; i < len; i++) {
        if (item < arr[i])
            return i;
    }
    return i;
}
function insertLinkTag() {
    let linkTag = document.createElement("link");
    linkTag.id = LINKTAG_ID;
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
function attemptProvideLink(delay) {
    let lock = ++latestLock;
    /* The lock is to minimize the number of times that the linkTag's href
     * is dynamically changed, so as to minimize the number of GET requests
     * for Google Font's stylesheets */
    setTimeout(() => {
        if (lock === latestLock) {
            let linkTag = document.getElementById(LINKTAG_ID);
            if (typeof linkTag !== "undefined") {
                linkTag.href = buildLink();
                setTimeout(() => {
                    stylesheetIsLoading = false;
                }, 2000);
            }
            else
                attemptProvideLink(delay * 2);
            /* delay more to wait for linkTag's creation,
             * also fails to recursive exponential delaying */
        }
    }, delay);
}
function collectFont(name, style, weight) {
    let l = collector.length, s = -1, pos = 0;
    let collectorIsChanged = false;
    for (let i = 0; i < l; i++) {
        if (collector[i]["name"] === name) {
            s = i;
            break;
        }
    }
    if (s > -1) {
        // if font is already collected
        if (style === "normal") {
            if (collector[s].normWeights.indexOf(weight) === -1) {
                pos = findInsertionPoint(collector[s].normWeights, weight); /* sorted */
                collector[s].normWeights.splice(pos, 0, weight); /* push   */
                collectorIsChanged = true;
            }
        }
        else if (style === "italic") {
            if (collector[s].italWeights.indexOf(weight) === -1) {
                pos = findInsertionPoint(collector[s].italWeights, weight); /* sorted */
                collector[s].italWeights.splice(pos, 0, weight); /* push   */
                collectorIsChanged = true;
            }
        }
    }
    else {
        // if font needs to be collected
        collector.push({
            name: name,
            normWeights: style === "normal" ? [weight] : [],
            italWeights: style === "italic" ? [weight] : [],
        });
        collectorIsChanged = true;
    }
    return collectorIsChanged;
}
function buildLink() {
    let href = "https://fonts.googleapis.com/css2?";
    let i = 0, l = collector.length, lr = 0, li = 0;
    for (; i < l; i++) {
        lr = collector[i].normWeights.length;
        li = collector[i].italWeights.length;
        href += "family=" + collector[i].name.split(" ").join("+");
        if (lr === 1 && collector[i].normWeights[0] === 400 && li === 0) {
            // do nothing
        }
        else if (lr === 0 && li === 1 && collector[i].italWeights[0] === 400) {
            href += ":ital@1";
        }
        else if (lr === 1 &&
            collector[i].normWeights[0] === 400 &&
            li === 1 &&
            collector[i].italWeights[0] === 400) {
            href += ":ital@0;1";
        }
        else if (lr > 0 && li === 0) {
            href += ":wght@" + collector[i].normWeights.reduce((acc, cur) => acc + cur + ";", "");
            href = href.slice(0, href.length - 1); // remove last semi-colon
        }
        else {
            href +=
                ":ital,wght@" +
                    collector[i].normWeights.reduce((acc, cur) => acc + "0," + cur + ";", "") +
                    collector[i].italWeights.reduce((acc, cur) => acc + "1," + cur + ";", "");
            href = href.slice(0, href.length - 1); // remove last semi-colon
        }
        href += "&";
    }
    href += "display=block";
    return href;
}
exports.buildLink = buildLink;
function gFont(name, trail, style = "normal", weight = 400) {
    const isServer = !(typeof window !== "undefined" &&
        window.document &&
        window.document.createElement);
    if (!isServer && latestLock === 1)
        // true only in very first call to loadGFont
        insertLinkTag();
    let collectorIsChanged = collectFont(name, style, weight);
    if (!isServer && collectorIsChanged) {
        stylesheetIsLoading = true;
        attemptProvideLink(8);
        /* use tiny delay to minimize the split-second improper
         * rendering of the page on load */
    }
    return {
        css: "font-family: '" +
            name +
            "', " +
            trail +
            "; font-style: " +
            style +
            "; font-weight: " +
            weight +
            ";",
        obj: {
            fontFamily: "font-family: '" + name + "', " + trail,
            fontStyle: style,
            fontWeight: weight + "",
        },
    };
}
exports.default = gFont;
