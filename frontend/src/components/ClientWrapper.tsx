'use client'

import Navbar from './Navbar'
import Footer from './Footer'

import { useEffect } from 'react'
import { initBotSessionTracking } from '../utils/botSessionTracker'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initBotSessionTracking()
      console.log('Bot session tracking initialized')
    }
  }, [])
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
