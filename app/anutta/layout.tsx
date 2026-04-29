import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Anutta Parse Code",
  description: "A personal blog by Anutta Parse Code on travel, tech, and smart lifestyle stories.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AnuttaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
