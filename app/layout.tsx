import type React from "react"
import type { Metadata, Viewport } from "next"
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://kowito.com"),
  title: {
    default: "Kowit C. | Digital Craftsman",
    template: "%s | Kowit C.",
  },
  description: "Software engineer building high-quality web and open source experiences with TypeScript and Rust.",
  applicationName: "kowito.com",
  keywords: [
    "Kowit C",
    "Kowito",
    "software engineer",
    "full-stack developer",
    "TypeScript",
    "Rust",
    "Next.js",
    "open source",
  ],
  authors: [{ name: "Kowit C.", url: "https://kowito.com" }],
  creator: "Kowit C.",
  publisher: "Kowit C.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://kowito.com",
    siteName: "kowito.com",
    title: "Kowit C. | Digital Craftsman",
    description: "Software engineer building high-quality web and open source experiences with TypeScript and Rust.",
    images: [
      {
        url: "/kowito.jpg",
        width: 320,
        height: 320,
        alt: "Kowit C.",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kowit C. | Digital Craftsman",
    description: "Software engineer building high-quality web and open source experiences with TypeScript and Rust.",
    images: ["/kowito.jpg"],
    creator: "@kowito",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
