'use client'

import Navbar from './Navbar'
import Footer from './Footer'

import { useEffect } from 'react'
import { initBotSessionTracking, resetBotSessionData } from '../utils/botSessionTracker'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      resetBotSessionData()
      initBotSessionTracking()
      console.log('Bot session tracking initialized')
    }
  }, [])
  return (
    <>
      <div className="fixed w-full top-0 z-50 bg-gradient-to-r from-walmart-blue to-blue-700"><Navbar /></div>
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
