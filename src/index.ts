import { GFontName, IMapForWeights, IMapForVariations } from "./gFontInterfaces";

interface FontStyles {
  tags: string[],
  entries: {
    [key: string]: number;
  }[]
}

interface CollectedFonts {
  [key: string]: FontStyles;
}

interface VariationI {
  fontFamily?: string;
  fontWeight?: number;
  fontStyle?: string;
  fontStretch?: number;
  fontOpticalSizing?: number;
  fontVariationSettings?: string;
}

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

const DefaultValues: { [key: string]: number } = {
  CASL: 0,
  CRSV: 0.5,
  EDPT: 100,
  EHLT: 12,
  FILL: 0,
  GRAD: 0,
  MONO: 0,
  SOFT: 0,
  WONK: 0,
  XOPQ: 88,
  XTRA: 400,
  YOPQ: 116,
  YTAS: 750,
  YTDE: -250,
  YTFI: 600,
  YTLC: 0,
  YTUC: 725,
  ital: 0,
  opsz: 14,
  slnt: 0,
  wdth: 100,
  wght: 400,
}

function pushUniqueTag (arr: string[], newTag: string): boolean {
  for (let i = 0, l = arr.length; i < l; i++) {
    if (arr[i] === newTag) return false;
  }
  arr.push(newTag);
  arr.sort((a, b) => a.localeCompare(b)); // alphabetize
  return true;
}

function pushUniqueEntry (arr: {[key: string]: number}[], item: {[key: string]: number}): boolean {
  let unique = true;
  for (let i = 0, l = arr.length; i < length; i++) {
    let same = true;
    let keys = Object.keys(arr[i]);
    for (let j = 0, k = keys.length; j < k; j++) {
      if (!arr[i][keys[j]] || (arr[i][keys[j]] !== item[keys[j]])) {
        same = false;
        break;
      }
    }
    if (same) {
      unique = false;
      break;
    }
  }
  if (unique) arr.push(item);
  return unique;
}

function expandCollectedFontsWithDefaults(fonts: CollectedFonts) {
  for (const key in fonts) {
    fonts[key].tags.forEach(tag => {
      fonts[key].entries.forEach(entry => {
        if (!entry[tag])
          entry[tag] = DefaultValues[tag];
      })
    })
  }
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

function variationsToCss(variations?: string[]): string {
  let result = "";
  let subset: [string, string][] = [];
  if(variations) {
    variations.forEach(variation => {
      if (variation === "normal" || variation === "italic")
        result += "font-style: " + variation + ";\n"
      else {
        let parts = variation.trim().split("=");
        switch (parts[0]) {
          case "slnt":
            result += "font-style: oblique " + parts[1] + "deg;\n";
            break;
          case "wdth":
            result += "font-stretch: " + parts[1] + ";\n";
            break;
          case "opsz":
            result += "font-optical-sizing: " + parts[1] + ";\n";
            break;
          default:
            subset.push([parts[0], parts[1]]);
        }
      }
    })
    if (subset.length) {
      result += "font-variation-settings: ";
      subset.forEach(([tag, value]) => {
        result += `"${tag}" ${value},`;
      })
      result += ";\n";
    }
  }
  return result;
}

function variationsToObj(variations?: string[]): VariationI {
  let result: VariationI = {};
  let subset: [string, string][] = [];
  if(variations) {
    variations.forEach(variation => {
      if (variation === "normal" || variation === "italic")
        result["fontStyle"] = variation;
      else {
        let parts = variation.trim().split("=");
        switch (parts[0]) {
          case "slnt":
            result["fontStyle"] = "oblique " + parts[1] + "deg";
            break;
          case "wdth":
            result["fontStretch"] = parseFloat(parts[1]);
            break;
          case "opsz":
            result["fontOpticalSizing"] = parseFloat(parts[1]);
            break;
          default:
            subset.push([parts[0], parts[1]]);
        }
      }
    })
    if (subset.length) {
      result["fontVariationSettings"] = subset.reduce((acc, cur) => {
        return acc + `"${cur[0]}" ${cur[1]},`;
      }, "");
    }
  }
  return result;
}

export default class GFont {
  private linkTagId: string;

  private collector: CollectedFonts = {};

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

  private collectFont(name: string, weight?: number, variations: string[] = []): boolean {
    let collectorIsChanged = false;
    let entry: {[key: string]: number} = {};

    if (!this.collector[name]) {
      this.collector[name] = {tags: [], entries: []}
      collectorIsChanged = true;
    }

    if (weight !== undefined) {
      collectorIsChanged = pushUniqueTag(this.collector[name].tags, "wght");
      entry["wght"] = weight;
    }

    let temp = false;
    variations.forEach(variation => {
      if (variation === "normal" || variation === "italic") {
        temp = pushUniqueTag(this.collector[name].tags, "ital");
        if (variation === "normal") entry["ital"] = 0;
        else entry["ital"] = 1;
      }
      else if (variation.match(/^\s*[a-zA-Z]+=[0-9]+(\.[0-9]+)?\s*$/)) {
        let parts = variation.trim().split("=");
        temp = pushUniqueTag(this.collector[name].tags, parts[0]);
        entry[parts[0]] = parseFloat(parts[1]);
      }
      else
        throw `The style variation "${variation}" for font ${name} has an invalid syntax.`
    })
    if (!collectorIsChanged) collectorIsChanged = temp;

    temp = pushUniqueEntry(this.collector[name].entries, entry);
    if (!collectorIsChanged) collectorIsChanged = temp;

    return collectorIsChanged;
  }

  public buildLink(): string {
    expandCollectedFontsWithDefaults(this.collector);
    let href = "https://fonts.googleapis.com/css2?";
    for (const key in this.collector) {
      href += "family=" + key.replace(" ", "_");
      const tagsLength = this.collector[key].tags.length;
      if (tagsLength) {
        href += ":" + this.collector[key].tags.join(",") + "@";
        for (let i = 0, l = this.collector[key].entries.length; i < l; i++) {
          for (let j = 0; j < tagsLength; j++) {
            href += this.collector[key].entries[i][this.collector[key].tags[j]];
            if (j !== tagsLength - 1)
              href += ",";
          }
          if (i !== l - 1)
            href += ";";
        }
      }
      href += "&";
    }
    href += "display=block";
    return href;
  }

  public font_(
    name: string,
    fallback: string,
    weight?: string | number,
    ...variations: string[]
  ): {
    css: string;
    obj: VariationI;
  } {
    let wght = -1;
    if (weight && typeof weight !== "number") {
      if (Weights[weight]) wght = Weights[weight];
      else wght = parseInt(weight);
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

      let collectorIsChanged = this.collectFont(name, (weight ? wght : undefined), variations);

      if (!isServerRendered && collectorIsChanged) this.attemptProvideLink(8);
    }

    const css = `
      font-family: "${name}", ${fallback};
      ${weight ? ("font-weight: " + weight + ";") : ""}
      ${variationsToCss(variations)}
    `;

    let obj: VariationI = {
      fontFamily: "'" + name + "', " + fallback,
      fontWeight: wght,
      ...variationsToObj(variations)
    };

    return {
      css: css,
      obj: obj,
    };
  }

  public font<T extends GFontName>(
    name: T,
    fallback: string,
    weight?: IMapForWeights[T],
    ...variations: (IMapForVariations[T])[]
  ): {
    css: string;
    obj: VariationI;
  } {
    return this.font_(name, fallback, weight, ...variations);
  }
}
