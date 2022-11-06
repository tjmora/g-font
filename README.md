# @tjmora/g-font

This will help you try different Google Fonts without needing to generate stylesheet URLs 
every time you change your fonts. The stylesheet URLs are automatically-generated while 
on you're on a development environment (A little more steps are needed for production 
environment). If used with Typescript, your code editor's code completion system can guide you 
to valid font names, valid weights, valid styles and valid variation settings for each font.


## Installation

```
npm i @tjmora/g-font
```


## Usage

### Context

First we create a context. Somewhere in your project, create a **gfont.ts** or **gfont.js** 
file.

```typescript
import GFont from "@tjmora/g-font"; // for Typescript
// const GFont = require("@tjmora/g-font").default; // for Javascript

const g = new GFont(process.env.NODE_ENV === "development");

export default g;
```

Next, we import this context to our component.

```typescript
import g from "./gfont";
```

### Use in Inline Style Props

Use `font(...).obj` which returns an object of camelCased style props. Make sure to 
spread the props using the `...` operator.

```tsx
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

### Use in CSS-in-JS

Use `font(...).css` which returns a string of valid syntax of CSS rules.

```typescript
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

### `font` method parameters

The `font` method takes the following arguments:

* **name** - The name of the font.
* **fallback** - The fallback font in case the Google font doesn't load.
* **weight** - The weight of the font. Defaults to `"regular"` or `"400"` if not provided. The value can be semantic or string-numeric. Semantic values include `"thin"`, `"extralight"`, `"light"`, `"regular"`, `"medium"`, `"semibold"`, `"bold"`, `"extrabold"`, and `"black"`.
* **variation** - An optional rest or variadic parameter. Takes the style and other variation settings for the font. Its value can be `"normal"` (for non-italic), or `"italic"`, or `"slnt:-5"` if the font has a slant axis, or `"wdth:120.0"` if the font has a width axis, or other variation settings possible for a font.

In VSCode, when coding with Typescript, hit `CTRL` + `SPACE` when the cursor is on the name, 
weight or variation parameter to expose all the possible values for the parameter.

> **_NOTE:_** The `font_` method (with trailing underscore) is the non-typed version of the 
> `font` method. If you're sure you're using valid values but the `font` method keeps on 
> putting red squiggly lines under those values or if Typescript fails to compile your values, 
> try adding un underscore to the method you're using. 


## Development vs Production

The `font` method is supposed to behave differently between the developmental and production 
environments.

In development, **true** is passed to `new GFont(...)`. The `font` method automatically 
collects all the fonts and their weights, styles and variation settings, and automatically 
inserts a stylesheet `<link>` tag with an automatically-generated href to the DOM. This will 
allow you to quickly see how the different fonts you try get rendered by the browser. The 
fonts load a bit slow, and they may flicker, at page load and at hydration. This slow 
font-rendering behavior is really only tolerable in a developmental environment.

In production, **false** is passed to `new GFont(...)`. The `font` method still returns the 
`.css` string of valid css syntax, and the `.obj` object of valid inline style prop values. 
So you don't need to refactor those `font` method calls into native css or inline style props. 
However, there will be no attempt in collecting the fonts and their weights, styles and 
variation settings, and no attempt as well in dynamically inserting any stylesheet `<link>` 
tag to the DOM. You are supposed to collect your final selection of fonts on your own and 
then add all the necessary stylesheet `<link>` tags to your App or Document file/component. 
This is the only pragmatic way of speeding up the load up times of your chosen fonts in 
production.

To generate the Google Font URL that you will need in production, you don't need to generate 
it using Google Fonts' website. You can instead do the following:

1. Place the following `link` tags somewhere in your app, document or layout file/component 
(within  `<head>` or `<Head>` tags):

```
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
<link href="CHANGE_THIS" rel="stylesheet" />
```

2. Do everything your website can in developmental mode, making sure all the 
hydration events lead up to the collection of all the fonts your website needs, and making 
sure you're not refreshing the tab. (For some static-generating frameworks like Next.js, you 
will need to go to all the routes that has their own Google fonts so those fonts can 
be collected. In Next.js, the <Link> elements actually lead to hydration, not new page loads 
despite the route change in the address bar. The hydration makes the font collection possible).

3. Once you're confident all your needed fonts are already collected in the background, 
bring up the browser's inspection tool and look for the 
`<link id="tjmora-g-font-..." rel="stylesheet" href="...">` tag within your document's head. 
Copy the generated value inside the `href` attribute, and replace the `CHANGE_THIS` href value 
from step no. 1 with it. You can opt to replace the `&display=block` part of the link with 
`&display=swap`.
[Check this out to learn more about block vs swap](https://developer.chrome.com/blog/font-display/#font-download-timelines).


## Server-Rendering/Static Generation (e.g., Next.js)

The `font` method can distinguish between being rendered on the client-sie or being rendered on 
the server-side. If server-rendered and the environment is development, the `font` method still 
collects all the fonts and their weights, styles and variation settings, but it makes no 
attempt in generating a stylesheet URL nor attempt to insert a stylesheet `<link>` tag to the 
DOM on page load (But on hydration, such attempt is made).

One thing you can do to solve this problem on page load is to include the stylesheet `<link>` 
tag yourself. For example, here's how it should be done in Next.js:

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


## Issues/Contributing

Before you create any issue or make a pull request, please consider the following:

1. The weight parameter for the `font` and `font_` will only be of type string for the 
meantime, even for the numeric values. This makes the custom font/value types simpler and 
the code editor will have easier time generating the set of valid values.

2. Only the variation settings or axes included [here](https://fonts.google.com/variablefonts#axis-definitions) 
are supported as these have documented default values. A few Google fonts have exotic 
variation settings but this library chose to ignore those axes.

3. Some fonts from this [repo](https://github.com/google/fonts) have missing METADATA files. 
Those fonts are not even present in the Google Fonts website so this library also chose to 
ignore those fonts.

## Test

The test for this package is a [separate repo](https://github.com/tjmora/g-font-test).