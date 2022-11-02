## @tjmora/g-font

Using Google Fonts is sometimes a trial-and-error undertaking. We try different combinations
of Google Fonts until we are satisfied with our designs. This library will make it easy 
try different Google Fonts while still on a development server.

### Installation

```
npm i @tjmora/g-font
```

### Usage

First we create a context. Somewhere in your project, create a `gfont.ts` or `gfont.js` file.

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
    ${g.font("Raleway", "Verdana, sans-serif", "semi-bold").css}
  }
  p {
    font-size: 1rem;
    ${g.font("Roboto", "Arial, sans-serif").css}
  }
  blockquote {
    font-size: 1.2rem;
    ${g.font("Lora", "Georgia, serif", 500, "italic").css}
  }
`;

export default function MyComponent({children}: {children?: React.ReactNode}) {
  return (
    <StyledDiv>
      {children}
      <a href="/" style={{...g.font("Nunito", "Arial, sans-serif", 600).obj}}>Back to Home</a>
    <StyledDiv>
  )
}
```

The `font` method takes the following arguments:

* **name** - the name of the font
* **fallback** - the fallback font in case the Google font doesn't load
* **weight** - The weight of the font either in numeral form, or as a name ("thin", "extra light", "light", "regular", "medium", "semi-bold", "bold", "extra bold", "black"). Defaults to "regular" or 400 if not provided.
* **style** - The font style, either "normal" or "italic". Defaults to "normal" if not provided.

The `font` method has two types of return values:

* `font(...).css` is a string formatted in a valid css syntax.
* `font(...).obj` is an object with camelCased style props and their values.

### Development vs Production

In our context file **gfont.ts**, we constructed a new GFont instance by passing a boolean, 
whether the `process.env.NODE_ENV === "development"` is true or not. We do this because the 
`font` method is supposed to behave differently between the developmental and production 
environments.

If **true** is passed to `new GFont(...)`, the `font` method automatically collects all the 
fonts and their weights and styles, and automatically inserts a stylesheet `<link>` tag with a 
automatically-generated href to the DOM. This will allow you to quickly see how the different 
fonts you try get rendered by the browser. The fonts load slowly at page load and at any 
re-hydration. This slow font-rendering behavior is really only tolerable in a developmental 
environment.

If **false** is passed to `new GFont(...)`, the `font` method still returns the `.css` string of 
valid css syntax, and the `.obj` object of valid inline style values. So you don't need to 
refactor those `font` method calls into native css or inline style props. However, there will be 
no attempt in collecting the fonts and their weights and their styles, and no attempt in 
dynamically inserting any stylesheet `<link>` tag to the DOM. You are supposed to collect your 
final selection of fonts on your own and then add all the necessary stylesheet `<link>` tags to 
your App or Document file/component. This is the only pragmatic way of speeding up the load up 
times of your chosen fonts.

### Stylesheet Link Generation

If you don't wish to generate the stylesheet link using Google Fonts' website, you can do the 
following:

1. Do everything your website can in developmental mode, making sure all the 
hydration events lead up to the collection of all the fonts your website needs (and making 
sure you're not refreshing the tab).

2. Bring up the browser's inspection tool in order 
to look for the `<link id="tjmora-g-font-..." rel="stylesheet" href="...">` tag in your 
document's head. Copy the generated value inside the `href` attribute, and paste it somewhere.

3. Place the following `link` tags somewhere in your App or Document file/component (within  
`<head>` or `<Head>` tags):

```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="CHANGE_THIS" rel="stylesheet">
```

Change the value of CHANGE_THIS to the value of the `href` you copied earlier. You can opt to 
replace the `&display=block` part of the link with `&display=swap`. [Check this out to learn 
more about block vs swap](https://developer.chrome.com/blog/font-display/#font-download-timelines).

### Server-Rendering/Static Generation (e.g., Next.js)

The `font` method can distinguish between being rendered on the client-sie or being rendered on 
the server-side. If server-rendered and the environment is development, the `font` method still 
collects all the fonts and their weights and styles, but it makes no attempt in generating a 
stylesheet link nor attempt to insert a stylesheet `<link>` tag to the DOM.

One thing you can do is to include the stylesheet `<link>` tag yourself. For example, here's 
how it should be done in Next.js:

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
weights and styles) collected so far. **It needs to be called after every component is already 
rendered.** That's why we placed the `<Head>` and `<link>` tags after the `<Component>` tag.

This manually-added `<link>` tag is only important for page loads. For re-hydration, the `font` 
method works as expected. In development, it collects fonts, weights and styles and dynamically 
inserts a stylesheet `<link>` tag to the DOM. In production, it doesn't do the collecting and 
the dynamic insertion of `<link>` tags. You need to place the necessary `<link>` tags yourself 
as discussed previously in the **Stylesheet Link Generation** section.

### Test

The test for this package is a [separate repo](https://github.com/tjmora/g-font-test).