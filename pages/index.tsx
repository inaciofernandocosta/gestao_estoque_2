import type { NextPage } from 'next'
import Head from 'next/head'
import Dashboard from '../components/Dashboard'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>NexaCapital - Gestão de Estoque</title>
        <meta name="description" content="Sistema de gestão de estoque" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Dashboard />
      </main>
    </div>
  )
}

export default Home
