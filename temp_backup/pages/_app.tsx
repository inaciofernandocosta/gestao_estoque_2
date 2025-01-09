import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import ResponsiveLayout from '@/components/ResponsiveLayout'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>NexaCapital - Gestão de Estoque</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ResponsiveLayout>
        <Component {...pageProps} />
      </ResponsiveLayout>
    </>
  )
}
