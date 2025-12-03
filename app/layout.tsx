import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { ScrollSmooth } from "@/components/scroll-smooth"
import { ScrollProgress } from "@/components/scroll-progress"
import { RouteChangeHandler } from "@/components/route-change-handler"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Shadikart - Your Perfect Wedding Package",
  description: "Plan your dream wedding with our curated packages",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans page-transition`}>
        <ScrollSmooth />
        <ScrollProgress />
        <RouteChangeHandler />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

