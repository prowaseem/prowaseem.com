import './globals.css'
import { Inter, Montserrat } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({
  weight: [ '500', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata = {
  title: 'Muhammad Waseem Irshad | Senior Software Engineer',
  description: 'A showcase of my work and experience as a software engineer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${montserrat.variable} bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 min-h-screen`}>
        {children}
      </body>
    </html>
  )
}

