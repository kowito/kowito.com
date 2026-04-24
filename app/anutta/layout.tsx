import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Anutta Parse Code",
  description: "Private presentation.",
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
