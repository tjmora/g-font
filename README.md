# @tjmora/g-font

**In development mode:**

* Use the `g.font(...)` method to try different Google Fonts as much as you want without 
  needing to regenerate Google Font API URl over and over again.
* You also don't need to import individual fonts. Just change the `g.font(...)` parameters 
  to any font and style that you want. 
* The stylesheet `<link>` tags with auto-generated href is dynamically inserted to the DOM.
* If used with Typescript, invalid style values will be linted as erroneous. Use 
  `CTRL + SPACE` in VSCode to see all valid values.

**In production mode:**

All the things you can do in development mode, except:

* The Google Fonts API URL is not auto-generated and no stylesheet `<link>` tag is inserted 
  the DOM. Check the **Production Steps** section for the additional steps you must do.


## Installation

```
npm i @tjmora/g-font
```


## Usage

<details>
<summary><h3>Show usage in React</h3></summary>

### Context

First we create a context. Somewhere in your project, create a **gfont.ts** or **gfont.js** 
file.

```typescript
import GFont from "@tjmora/g-font" // for Typescript
// const GFont = require("@tjmora/g-font").default; // for Javascript

const g = new GFont(process.env.NODE_ENV === "development");

export default g;
```

### Within inline style props

Use `font(...).obj` which returns an object of camelCased style props. Make sure to 
spread the props using the `...` operator.

```tsx
import g from "./gfont" // imports the context

export default function SomeComponent () {
  return (
    <>
      <h1 style={{
        fontSize: "1.8rem",
        ...g.font("Roboto Flex", "Verdana, sans-serif", "semibold", "slnt:-10", "wdth:130.0").obj
      }}>
        Some Headline
      </h1>
      <blockquote style={{
        paddingLeft: "1rem",
        borderLeft: "solid 5px darkgreen",
        ...g.font("Lora", "Georgia, serif", "500", "italic").obj 
      }}>
        Some quote by Einstein.
      </blockquote>
      <p style={{
        fontSize: "1rem",
        ...${g.font("Roboto", "Arial, sans-serif").obj
      }}>
        Some paragraph
      </p>
    </>
  )
}
```

### Within CSS-in-JS

Use `font(...).css` which returns a string of valid syntax of CSS rules.

```typescript
import g from "./gfont" // imports the context
import styled from "styled-components"

const SomeComponent = styled.div`
  h1 {
    font-size: 1.8rem;
    ${g.font("Roboto Flex", "Verdana, sans-serif", "semibold", "slnt:-10", "wdth:130.0").css}
  }
  blockquote {
    padding-left: 1rem;
    border-left: solid 5px darkgreen;
    ${g.font("Lora", "Georgia, serif", "500", "italic").css}
  }
  p {
    font-size: 1rem;
    ${g.font("Roboto", "Arial, sans-serif").css}
  }
`;
```

### Next.js

Look for the **SSG** section below this document to know additional steps you need for Next.js.

</details>

<details>
<summary><h3>Show usage in Angular</h3></summary>

### Context

First we create a context. In the `src` folder, create a **gfont.ts** file.

```typescript
import GFont from "@tjmora/g-font";
import { environment} from "./environments/environment";

const g = new GFont(!environment.production);

export default g;
```

### In your .component.ts file

```typescript
import { Component, OnInit } from '@angular/core';
import g from "../../../gfont"; // let's import the context

@Component({
  selector: 'app-some',
  templateUrl: './some.component.html',
  styleUrls: ['./some.component.css']
})
export class SomeComponent implements OnInit {

  g = g; // Just copy the context here

  // If a style applies to multiple elements, create a styling function
  styleP = () => g.font("Roboto", "Arial, sans-serif").obj;

  constructor() { }

  ngOnInit(): void {
  }
}
```

### In your .component.html

The `.obj` at the end of the method is a return value of type `{[key: string]: string}`. 
There's also a purely-string return type `.css` but it's only used in CSS-in-JS libraries.

```html
<h1 [ngStyle]="g.font('Roboto Flex', 'Verdana, sans-serif', 'semibold', 'slnt:-10', 'wdth:130.0').obj">
  Some Headline
</h1>
<blockquote [ngStyle]="g.font('Lora', 'Georgia, serif', '500', 'italic').obj">
  Some quote by Einstein.
</blockquote>
<p [ngStyle]="styleP()">
  Some paragraph
</p>
<p [ngStyle]="styleP()">
  Another Paragraph
</p>
```

</details>

### `font` method parameters

The `font` method takes the following arguments:

* **name** - The name of the font.
* **fallback** - The fallback font in case the Google font doesn't load.
* **weight** - The weight of the font. Defaults to `"regular"` or `"400"` if not provided. The value can be semantic or numeric-string. Semantic values include `"thin"`, `"extralight"`, `"light"`, `"regular"`, `"medium"`, `"semibold"`, `"bold"`, `"extrabold"`, and `"black"`.
* **variation** - An optional rest or variadic parameter. Takes the style and other variation settings for the font. Its value can be `"normal"` (for non-italic), or `"italic"`, or `"slnt:-5"` if the font has a slant axis, or `"wdth:120.0"` if the font has a width axis, or other variation settings possible for a font.

> **_TIP:_** In VSCode, when coding with Typescript, hit `CTRL` + `SPACE` when the cursor is on 
> the name, weight or variation parameter to expose all the possible values for the parameter.

> **_TIP:_** The `font_` method (with trailing underscore) is the non-typed version of the 
> `font` method. If you're sure you're using valid values but the `font` method keeps on 
> putting red squiggly lines under those values (and fails to compile because of that), 
> try adding un underscore to the method you're using. The problem may be due to the 
> imperfections of the custom types.


## Production Steps

The auto-generation of Google Fonts API URL and the dynamic insertion of stylesheet `<link>` 
tags to the DOM only happen in development mode. The mechanism employed here results to slow 
font downloads that you may see your fonts flicker every page load or hydration, something 
that is tolerable only in development mode.

The fonts need to be downloaded or preloaded when in production mode. You need to include the 
Google Fonts API URL of the final selection of fonts you decided upon. Fortunately, you don't 
need to generate that URL through the Google Fonts' website. Simply do the following:

1. Copy and paste the following `link` tags somewhere in your app, document or layout 
file/component (within  `<head>` or `<Head>` tags):

```
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
<link href="CHANGE_THIS" rel="stylesheet" />
```

2. Start a development server for your website. In the browser, open the log console.

3. Do everything your website can in developmental mode, making sure all the 
hydration events lead up to the collection of all the fonts your website needs, and making 
sure you're not refreshing the tab. You also need to visit all the routes that has their own 
fonts that needs to be collected. You will notice the log console gets logged with Google Font 
API URLs.

4. Once you're confident all your needed fonts are already collected in the background, 
look at the log console again. Copy the latest (or longest) Google Font API URL from the 
browser's console. Change the `CHANGE_THIS` href value from step no. 1 into what you just 
copied. You may also want to replace the `&display=block` part of the link with 
`&display=swap`.
[Check this out to learn more about block vs swap](https://developer.chrome.com/blog/font-display/#font-download-timelines).


## SSG Frameworks (e.g., Next.js)

When the `font` method gets executed during the build process of SSGs (for the generation) of 
static pages, the method behaves differently. It still collects all the fonts, weights, 
styles and variation settings, but as it has no access to the DOM, it doesn't dynamically 
insert any stylesheet `<link>` tag anywhere. You need to place the stylesheet `<link>` tag 
yourself. For example, here's how it can be done in Next.js.

In _app.tsx:

```tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import g from '../gfont' // this is our context

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Head>
        <link rel="stylesheet" type="text/css" href={g.buildLink()} />
      </Head>
    </>
  )
}
```

The `buildLink()` will build a Google Font stylesheet link of all the fonts (and their 
weights and styles) collected so far.

> **_WARNING:_** The `buildLink()` must execute only after all other components of your app 
> is already included. That's why we placed the `<Head>` and `<link>` tags after the 
> `<Component>` tag in the example code above.

This manually-added `<link>` tag is only important for the page loads. For hydration, the 
`font` method works as expected. In development, it collects fonts, weights, styles and 
variation settings, and dynamically inserts a stylesheet `<link>` tag to the DOM. In production, 
it doesn't do the collecting and the dynamic insertion of `<link>` tags. You need to place the 
necessary `<link>` tags yourself as discussed previously in the later part of the 
**Development vs Production** section.
