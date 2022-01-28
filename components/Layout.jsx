import React, { useContext } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'

import { Store } from '../utils/Store';

export default function Layout({ title, description, children }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state
  
  return (
    <div>

      <Head>
        <title>{title ? `${title} - Ecommerce` : `Ecommerce` } </title>
        {description && <meta name='description' content={description}></meta> }
      </Head>

      <Navbar items={cart.cartItems.length} />

      <main className="max-w-full mx-auto px-4 mt-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className='w-full fixed bottom-0 left-0 bg-indigo-600 p-3 text-sm text-center text-white' >
        All rights reserved
      </footer>

    </div>
  )
}


