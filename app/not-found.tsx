import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { ArrowLeft, Home } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-400">404</p>
        <h1 className="mt-4 text-4xl font-light tracking-tight text-white md:text-5xl">Well, this is awkward</h1>
        <p className="mt-5 max-w-lg text-balance text-gray-300">
          We searched everywhere, including behind the semicolons, but this page is still missing.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-full px-6">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back home
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-full px-6 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
            <Link href="mailto:hi@kowito.com">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Contact
            </Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
