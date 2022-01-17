import React from 'react'
import Head from 'next/head'
import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div>

      <Head>
        <title>Ecommerce</title>
      </Head>

      <Navbar />

      <main className="max-w-full mx-auto px-4 mt-10 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className='fixed bottom-0 left-0 w-screen bg-indigo-600 p-3 text-sm text-center text-white' >
        All rights reserved
      </footer>

    </div>
  )
}


