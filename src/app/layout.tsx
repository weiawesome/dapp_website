import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DApp-去中心化應用程序',
  description: 'This is a DApp. It can connect wallet and find information in blockchain and make transaction.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tw">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
