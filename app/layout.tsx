import type { Metadata, Viewport } from 'next'
import { Cairo, Jost } from 'next/font/google'
import './globals.css'

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'الطازج بيكري · Altazaj Bakery',
  description:
    'قائمة طعام الطازج بيكري — طازج كل يوم · Altazaj Bakery digital menu, Basra.',
  icons: { icon: '/favicon.svg' },
}

export const viewport: Viewport = {
  themeColor: '#ed1c24',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  )
}
