import './globals.css'

import ClientWrapper from '../components/ClientWrapper'

export const metadata = {
  title: 'MegaMart - Save Money. Live Better.',
  description: 'Shop online for electronics, home, groceries, and more at MegaMart.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </div>
      </body>
    </html>
  )
}