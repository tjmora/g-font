import { GFontName, IMapForVariants } from "./gFontInterfaces";

const Weights: { [key: string]: number } = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

function findInsertionPoint(arr: number[], item: number): number {
  let i = 0,
    len = arr.length;
  for (; i < len; i++) {
    if (item < arr[i]) return i;
  }
  return i;
}

function insertLinkTag(linkTagId: string) {
  let linkTag = document.createElement("link");
  linkTag.id = linkTagId;
  linkTag.rel = "stylesheet";
  linkTag.type = "text/css";
  linkTag.href = "";
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      (e) => {
        document.querySelector("head")!.appendChild(linkTag);
      },
      false
    );
  } else {
    document.querySelector("head")!.appendChild(linkTag);
  }
}

export default class GFont {
  private linkTagId: string;

  private collector: {
    name: string;
    normWeights: number[];
    italWeights: number[];
  }[] = [];

  private isCollecting: boolean;

  private latestLock = 1;

  constructor(cond: boolean) {
    this.isCollecting = cond;
    this.linkTagId =
      "tjmora-g-font-" + (Math.random() + 1).toString(36).substring(7);
  }

  private attemptProvideLink(delay: number) {
    let lock: number = ++this.latestLock;
    /* The lock is to minimize the number of times that the style link tag's href
     * is dynamically changed in client-rendered components. */

    setTimeout(() => {
      if (lock === this.latestLock) {
        let linkTag = document.getElementById(
          this.linkTagId
        ) as HTMLLinkElement;
        if (typeof linkTag !== "undefined") {
          linkTag!.href = this.buildLink();
        } else this.attemptProvideLink(delay * 2);
        /* delay more to wait for linkTag's creation,
         * also fails to recursive exponential delaying */
      }
    }, delay);
  }

  private collectFont(name: string, style: string, weight: number): boolean {
    let l = this.collector.length,
      s = -1,
      pos = 0;
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
      } else if (style === "italic") {
        if (this.collector[s].italWeights.indexOf(weight) === -1) {
          pos = findInsertionPoint(this.collector[s].italWeights, weight);
          this.collector[s].italWeights.splice(pos, 0, weight);
          collectorIsChanged = true;
        }
      }
    } else {
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

  public buildLink(): string {
    let href = "https://fonts.googleapis.com/css2?";
    let i = 0,
      l = this.collector.length,
      ln = 0,
      li = 0;
    for (; i < l; i++) {
      ln = this.collector[i].normWeights.length;
      li = this.collector[i].italWeights.length;
      href += "family=" + this.collector[i].name.split(" ").join("+");
      if (ln === 1 && this.collector[i].normWeights[0] === 400 && li === 0) {
        // do nothing
      } else if (
        ln === 0 &&
        li === 1 &&
        this.collector[i].italWeights[0] === 400
      ) {
        href += ":ital@1";
      } else if (
        ln === 1 &&
        this.collector[i].normWeights[0] === 400 &&
        li === 1 &&
        this.collector[i].italWeights[0] === 400
      ) {
        href += ":ital@0;1";
      } else if (ln > 0 && li === 0) {
        href +=
          ":wght@" +
          this.collector[i].normWeights.reduce(
            (acc: string, cur) => acc + cur + ";",
            ""
          );
        href = href.slice(0, href.length - 1); // remove last semi-colon
      } else {
        href +=
          ":ital,wght@" +
          this.collector[i].normWeights.reduce(
            (acc: string, cur) => acc + "0," + cur + ";",
            ""
          ) +
          this.collector[i].italWeights.reduce(
            (acc: string, cur) => acc + "1," + cur + ";",
            ""
          );
        href = href.slice(0, href.length - 1); // remove last semi-colon
      }
      href += "&";
    }
    href += "display=block";
    return href;
  }

  public font<T extends GFontName>(
    name: T,
    fallback: string,
    variant?: IMapForVariants[T]
  ): {
    css: string;
    obj: {
      fontFamily: string;
      fontWeight: string;
      fontStyle?: string;
    };
  } {
    let style = "normal";
    let weight = 400;
    if (variant) {
      let variantParts = variant.split("-");
      if (variantParts.length > 1) style = variantParts[1];
      if (variantParts[0].match(/^[0-9]+$/)) weight = parseInt(variantParts[0]);
      else {
        if (Weights[variantParts[0]]) weight = Weights[variantParts[0]];
      }
    }

    if (this.isCollecting) {
      const isServerRendered = !(
        typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
      );

      if (!isServerRendered && this.latestLock === 1)
        // true only in very first call to gFont for client-rendered components
        insertLinkTag(this.linkTagId);

      let collectorIsChanged = this.collectFont(name, style, weight);

      if (!isServerRendered && collectorIsChanged) this.attemptProvideLink(8);
    }

    const css =
      "font-family: '" +
      name +
      "', " +
      fallback +
      "; font-weight: " +
      weight +
      (style === "italic" ? "; font-style: " + style : "") +
      ";";

    let obj: {
      fontFamily: string;
      fontWeight: string;
      fontStyle?: string;
    } = {
      fontFamily: "'" + name + "', " + fallback,
      fontWeight: weight + "",
    };

    if (style === "italic") obj["fontStyle"] = style;

    return {
      css: css,
      obj: obj,
    };
  }
}
