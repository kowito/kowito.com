"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { Home, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-red-300">500</p>
        <h1 className="mt-4 text-4xl font-light tracking-tight text-white md:text-5xl">Server error</h1>
        <p className="mt-5 max-w-lg text-balance text-gray-300">
          We hit an unexpected issue while loading this page. Please try again.
        </p>

        {error?.digest ? <p className="mt-2 text-xs text-gray-500">Error ID: {error.digest}</p> : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => reset()} className="rounded-full px-6">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try again
          </Button>

          <Button asChild variant="outline" className="rounded-full px-6 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back home
            </Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
