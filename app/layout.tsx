import type React from "react"
import type { Metadata } from "next"

import "./globals.css"
import { FloatingActionButton } from "@/components/floating-action-button"
import { ThemeCustomizer } from "@/components/theme-customizer"

import {
  Montserrat,
  Montserrat as V0_Font_Montserrat,
  IBM_Plex_Mono as V0_Font_IBM_Plex_Mono,
  Vollkorn as V0_Font_Vollkorn,
  Poppins,
  Playfair_Display,
  Dancing_Script,
  Bebas_Neue,
  Inter,
} from "next/font/google"

// Initialize fonts
const _montserrat = V0_Font_Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})
const _ibmPlexMono = V0_Font_IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
})
const _vollkorn = V0_Font_Vollkorn({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] })

// Initialize Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-serif",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
})

const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
})

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
})

const poppinsBrand = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  title: "Plannify - Slimme uitnodigingen voor je event",
  description: "Plan je event in 30 seconden. Deel via WhatsApp of Instagram. Geen app download nodig.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className="bg-white" lang="nl">
      <body
        className={`${inter.variable} ${poppinsBrand.variable} ${montserrat.variable} ${poppins.variable} ${playfair.variable} ${dancing.variable} ${bebas.variable} font-sans bg-background text-foreground`}
      >
        {children}
        <FloatingActionButton />
        <ThemeCustomizer />
      </body>
    </html>
  )
}
