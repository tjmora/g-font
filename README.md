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
import styled from "styled-components";

const StyledDiv = styled.div`
  display: block;
  width: 100%;
  h1 {
    font-size: 1.8rem;
    ${g.font("Raleway", "Verdana, sans-serif", "semibold").css}
  }
  p {
    font-size: 1rem;
    ${g.font("Roboto", "Arial, sans-serif").css}
  }
  blockquote {
    font-size: 1.2rem;
    ${g.font("Lora", "Georgia, serif", "500", "italic").css}
  }
`;

export default function MyComponent({children}: {children?: React.ReactNode}) {
  return (
    <StyledDiv>
      {children}
      <a href="/" style={{...g.font("Roboto Flex", "Arial, sans-serif", "750", "slnt:-10", "wdth:130.0").obj}}>Some Link</a>
    <StyledDiv>
  )
}
```

The `font` method takes the following arguments:

* **name** - The name of the font.
* **fallback** - The fallback font in case the Google font doesn't load.
* **weight** - The weight of the font. Defaults to `"regular"` or `"400"` if not provided. The value can be semantic or string-numeric. Semantic values include `"thin"`, `"extralight"`, `"light"`, `"regular"`, `"medium"`, `"semibold"`, `"bold"`, `"extrabold"`, and `"black"`.
* **variation** - An optional rest or variadic parameter. Takes the style and other variation settings for the font. Its value can be `"normal"` (for non-italic), or `"italic"`, or `"slnt:-5"` if the font has a slant axis, or `"wdth:120.0"` if the font has a width axis, or other variation settings possible for a font.

In VSCode, hit `CTRL` + `SPACE` when the cursor is on the name, weight or variation parameter to expose all the possible values for the parameter.

The `font` method has two types of return values:

* `font(...).css` is a string formatted in a valid css syntax.
* `font(...).obj` is an object with camelCased style props and their values.


## `font` vs `font_` methods

The `font` method, in Typescript, enforces the custom font/value types which were created 
to help your code editor's code completion system recommend valid values to you.

The `font_` method, do not enforce those custom font/value types. Those custom types aren't 
perfect, and the `font` method may sometimes be wrongly linted as erroneous and won't compile. 
If you're sure the parameters you provided are valid despite that, simply add an underscore to 
the method to disable the enforcing of those types. 


## Development vs Production

In our context file **gfont.ts**, we constructed a new GFont instance by passing a boolean, 
whether the `process.env.NODE_ENV === "development"` is true or not. We do this because the 
`font` method is supposed to behave differently between the developmental and production 
environments.

If **true** is passed to `new GFont(...)`, the `font` method automatically collects all the 
fonts and their weights, styles and variation settings, and automatically inserts a 
stylesheet `<link>` tag with an automatically-generated href to the DOM. This will allow you 
to quickly see how the different fonts you try get rendered by the browser. The fonts load 
slowly at page load and at hydration. This slow font-rendering behavior is really only 
tolerable in a developmental environment.

If **false** is passed to `new GFont(...)`, the `font` method still returns the `.css` string of 
valid css syntax, and the `.obj` object of valid inline style prop values. So you don't need to 
refactor those `font` method calls into native css or inline style props. However, there will be 
no attempt in collecting the fonts and their weights, styles and variation settings, and 
no attempt as well in dynamically inserting any stylesheet `<link>` tag to the DOM. You are 
supposed to collect your final selection of fonts on your own and then add all the necessary 
stylesheet `<link>` tags to your App or Document file/component. This is the only pragmatic way 
of speeding up the load up times of your chosen fonts in production.

You don't need to generate the stylesheet URL using Google Fonts' website, you can do the 
following instead:

1. Place the following `link` tags somewhere in your app, document or layout file/component (within  `<head>` or `<Head>` tags):

```
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
<link href="CHANGE_THIS" rel="stylesheet">
```

2. Do everything your website can in developmental mode, making sure all the 
hydration events lead up to the collection of all the fonts your website needs, and making 
sure you're not refreshing the tab.

3. Bring up the browser's inspection tool and look for the 
`<link id="tjmora-g-font-..." rel="stylesheet" href="...">` tag in your document's head. 
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

One thing you can do solve this problem on page load, is to include the stylesheet `<link>` tag 
yourself. For example, here's how it should be done in Next.js:

`_app.tsx`

```typescript
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

The `g.buildLink()` will build a Google Font stylesheet link of all the fonts (and their 
weights and styles) collected so far. **It needs to be included after every component is already 
included.** That's why we placed the `<Head>` and `<link>` tags after the `<Component>` tag.

This manually-added `<link>` tag is only important for the page loads. For hydration, the `font` 
method works as expected. In development, it collects fonts, weights, styles and variation settings, 
and dynamically inserts a stylesheet `<link>` tag to the DOM. In production, it doesn't do the 
collecting and the dynamic insertion of `<link>` tags. You need to place the necessary 
`<link>` tags yourself as discussed previously in the **Development vs Production** section.


## Test

The test for this package is a [separate repo](https://github.com/tjmora/g-font-test).