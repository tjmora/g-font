import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import SectionSwitcher from '../components/SectionSwitcher'
import G from "../gfont";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <SectionSwitcher>
        <Component {...pageProps} />
      </SectionSwitcher>
      <Head>
        <link rel="stylesheet" type="text/css" href={G.buildLink()} />
      </Head>
    </>
  )
}
