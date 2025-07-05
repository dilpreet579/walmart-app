'use client'

import Navbar from './Navbar'
import Footer from './Footer'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
