import {
  GFontName,
  IMapForWeights,
  IMapForVariations,
} from "./gFontInterfaces";

interface FontStyles {
  // We need to keep track of all the tags used in all entries
  tags: string[];

  // Each entry has its own set of tags
  entries: {
    [key: string]: number;
  }[];

  // When the Google Font API URL is to be built, we need entries with default values.
  entriesWithDefaults: {
    [key: string]: number;
  }[];
}

interface CollectedFonts {
  [key: string]: FontStyles;
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
  ital: 0,
  opsz: 14,
  slnt: 0,
  wdth: 100,
  wght: 400,
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
};

function pushUniqueTag(arr: string[], newTag: string): [boolean, boolean] {
  // returns [success, error]
  if (DefaultValues[newTag] === undefined) {
    console.log(
      `@tjmora/g-font:: Warning: The style variation setting "${newTag}" has no undocumented default value. It was ignored.`
    );
    return [false, true];
  }
  for (let i = 0, l = arr.length; i < l; i++) {
    if (arr[i] === newTag) return [false, false];
  }
  arr.push(newTag);
  arr.sort((a, b) => {
    // sorts alphabetized but all lowercase comes before all uppercase (Google Font's css2 api requirement)
    let a0 = a.charCodeAt(0),
      b0 = b.charCodeAt(0);
    if ((a0 <= 90 && b0 <= 90) || (a0 >= 97 && b0 >= 97))
      return a.localeCompare(b);
    else return b0 - a0;
  });
  return [true, false];
}

function areKeysTheSame(tags1: string[], tags2: string[]): boolean {
  let result = true;
  if (tags1.length !== tags2.length) return false;
  for (let i = 0, l = tags1.length; i < l; i++) {
    if (tags1[i] !== tags2[i]) {
      result = false;
      break;
    }
  }
  return result;
}

function pushUniqueEntry(
  arr: { [key: string]: number }[],
  newEntry: { [key: string]: number }
): boolean {
  let unique = true;
  for (let i = 0, l = arr.length; i < l; i++) {
    let same = true;
    let keys1 = Object.keys(arr[i]);
    let keys2 = Object.keys(newEntry);
    if (!areKeysTheSame(keys1, keys2)) same = false;
    else {
      for (let j = 0, k = keys1.length; j < k; j++) {
        if (arr[i][keys1[j]] !== newEntry[keys1[j]]) {
          same = false;
          break;
        }
      }
    }
    if (same) {
      unique = false;
      break;
    }
  }
  if (unique) arr.push(newEntry);
  return unique;
}

function generateEntriesWithDefaults(fonts: CollectedFonts) {
  for (const key in fonts) {
    fonts[key].entriesWithDefaults = [];
    fonts[key].entries.forEach((entry) => {
      let entryWithDefaults: { [key: string]: number } = {};
      fonts[key].tags.forEach((tag) => {
        if (entry[tag] === undefined)
          entryWithDefaults[tag] = DefaultValues[tag];
        else entryWithDefaults[tag] = entry[tag];
      });
      pushUniqueEntry(fonts[key].entriesWithDefaults, entryWithDefaults);
    });
    fonts[key].entriesWithDefaults.sort((a, b) => {
      // Google Font's css2 api requires sorted tuples of values
      let result = 0;
      for (let i = 0, l = fonts[key].tags.length; i < l; i++) {
        result = a[fonts[key].tags[i]] - b[fonts[key].tags[i]];
        if (result !== 0) break;
      }
      return result;
    });
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
  if (variations) {
    variations.forEach((variation) => {
      if (variation === "normal" || variation === "italic")
        result += "font-style: " + variation + ";\n";
      else {
        let parts = variation.trim().split(":");
        switch (parts[0]) {
          case "ital":
            result +=
              "font-style: " + (parts[1] === "1" ? "italic" : "normal") + ";";
            break;
          case "slnt":
            // slnt and oblique use opposite signs
            result += "font-style: oblique " + -parseInt(parts[1]) + "deg;\n";
            break;
          case "wdth":
            result += "font-stretch: " + parts[1] + "%;\n";
            break;
          case "wght":
            result += "font-weight: " + parts[1] + ";\n";
            break;
          default:
            subset.push([parts[0], parts[1]]);
        }
      }
    });
    if (subset.length) {
      result += "font-variation-settings: ";
      subset.forEach(([tag, value]) => {
        result += `"${tag}" ${value},`;
      });
      
      // remove trailing comma
      result = result.slice(0, -1) + ";\n";
    }
  }
  return result;
}

function variationsToObj(variations?: string[]): {
  [key: string]: string | number;
} {
  let result: { [key: string]: string | number } = {};
  let subset: [string, string][] = [];
  if (variations) {
    variations.forEach((variation) => {
      if (variation === "normal" || variation === "italic")
        result["fontStyle"] = variation;
      else {
        let parts = variation.trim().split(":");
        switch (parts[0]) {
          case "ital":
            result["fontStyle"] = parts[1] === "1" ? "italic" : "normal";
            break;
          case "slnt":
            // slnt and oblique use opposite signs
            result["fontStyle"] = "oblique " + -parseInt(parts[1]) + "deg";
            break;
          case "wdth":
            result["fontStretch"] = parseFloat(parts[1]) + "%";
            break;
          case "wght":
            result["fontWeight"] = parseInt(parts[1]);
            break;
          default:
            subset.push([parts[0], parts[1]]);
        }
      }
    });
    if (subset.length) {
      result["fontVariationSettings"] = subset.reduce((acc, cur) => {
        return acc + `"${cur[0]}" ${cur[1]},`;
      }, "");
      
      // slice is for removing trailing comma
      result["fontVariationSettings"] = result["fontVariationSettings"].slice(
        0,
        -1
      );
    }
  }
  return result;
}

export default class GFont {
  private linkTagId: string;

  private collector: CollectedFonts = {};

  private isCollecting: boolean;

  private isServerRendered: boolean;

  private latestLock = 1;

  constructor(cond: boolean) {
    this.isCollecting = cond;
    this.isServerRendered =  !(
      typeof window !== "undefined" &&
      window.document &&
      window.document.createElement
    );
    this.linkTagId =
      // add random letters to our id
      "tjmora-g-font-" + (Math.random() + 1).toString(36).substring(7);
  }

  private attemptProvideLink(delay: number) {
    // The lock is to minimize the number of times that the style link tag's href
    // is dynamically changed in client-rendered components
    let lock: number = ++this.latestLock;

    setTimeout(() => {
      if (lock === this.latestLock) {
        let linkTag = document.getElementById(
          this.linkTagId
        ) as HTMLLinkElement;
        if (typeof linkTag !== "undefined") {
          linkTag!.href = this.buildLink();
        }

        // delay more to wait for linkTag's creation,
        // also fails to recursive exponential delaying
        else this.attemptProvideLink(delay * 2);
      }
    }, delay);
  }

  private collectFont(
    name: string,
    weight?: number,
    variations: string[] = []
  ): boolean {
    let collectorIsChanged = false;
    let entry: { [key: string]: number } = {};

    if (!this.collector[name]) {
      this.collector[name] = { tags: [], entries: [], entriesWithDefaults: [] };
      collectorIsChanged = true;
    }

    if (weight !== undefined) {
      [collectorIsChanged] = pushUniqueTag(this.collector[name].tags, "wght");
      entry["wght"] = weight;
    }

    let temp = false;
    variations.forEach((variation) => {
      if (variation === "normal" || variation === "italic") {
        [temp] = pushUniqueTag(this.collector[name].tags, "ital");
        if (variation === "normal") entry["ital"] = 0;
        else entry["ital"] = 1;
      } else if (variation.match(/^\s*[a-zA-Z]+:-?[0-9]+(\.[0-9]+)?\s*$/)) {
        let parts = variation.trim().split(":");
        let err = false;
        [temp, err] = pushUniqueTag(this.collector[name].tags, parts[0]);
        if (!err) entry[parts[0]] = parseFloat(parts[1]);
      } else
        console.log(
          `@tjmora/g-font:: Warning: The style variation "${variation}" for font ${name} has an invalid value or syntax.`
        );
    });
    if (!collectorIsChanged) collectorIsChanged = temp;

    temp = pushUniqueEntry(this.collector[name].entries, entry);
    if (!collectorIsChanged) collectorIsChanged = temp;

    return collectorIsChanged;
  }

  public buildLink(): string {
    generateEntriesWithDefaults(this.collector);
    let href = "https://fonts.googleapis.com/css2?";
    for (const key in this.collector) {
      href += "family=" + key.replace(" ", "+");
      const tagsLength = this.collector[key].tags.length;
      if (tagsLength) {
        href += ":" + this.collector[key].tags.join(",") + "@";
        for (
          let i = 0, l = this.collector[key].entriesWithDefaults.length;
          i < l;
          i++
        ) {
          for (let j = 0; j < tagsLength; j++) {
            href +=
              this.collector[key].entriesWithDefaults[i][
                this.collector[key].tags[j]
              ];
            if (j !== tagsLength - 1) href += ",";
          }
          if (i !== l - 1) href += ";";
        }
      }
      href += "&";
    }
    href += "display=block";
    if (!this.isServerRendered) {
      console.log("Google Font API URL: " + href);
    }
    return href;
  }

  public font_(
    name: string,
    fallback: string,
    weight?: string,
    ...variations: string[]
  ): {
    css: string;
    obj: { [key: string]: string | number };
  } {
    let wght = -1;
    if (weight && typeof weight !== "number") {
      if (Weights[weight]) wght = Weights[weight];
      else wght = parseInt(weight);
    }

    if (this.isCollecting) {
      if (!this.isServerRendered && this.latestLock === 1)
        // true only in very first call to gFont for client-rendered components
        insertLinkTag(this.linkTagId);

      let collectorIsChanged = this.collectFont(
        name,
        weight ? wght : undefined,
        variations
      );

      if (!this.isServerRendered && collectorIsChanged) this.attemptProvideLink(8);
    }

    const css = `
      font-family: "${name}", ${fallback};
      ${weight ? "font-weight: " + wght + ";" : ""}
      ${variationsToCss(variations)}
    `;

    let obj: {[key: string]: any} = {
      fontFamily: "'" + name + "', " + fallback,
    }
    if (weight) obj["fontWeight"] = wght;
    obj = {...obj, ...variationsToObj(variations)};

    return {
      css: css,
      obj: obj,
    };
  }

  public font<T extends GFontName>(
    name: T,
    fallback: string,
    weight?: IMapForWeights[T],
    ...variations: IMapForVariations[T][]
  ): {
    css: string;
    obj: { [key: string]: string | number };
  } {
    return this.font_(name, fallback, weight, ...variations);
  }
}
