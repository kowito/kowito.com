"use client"

import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { buttonClass, lettering } from "@/components/comic"
import { ErrorSplash } from "@/components/error-splash"
import { Home, RefreshCcw } from "lucide-react"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <ErrorSplash sound="KA-BOOM!" caption="500 · Something exploded…" title="Server error">
        <p className="mt-6 max-w-lg text-balance text-lg">
          We hit an unexpected issue while loading this page. Please try again.
        </p>

        {error?.digest ? <p className="mt-2 text-xs font-bold text-black/60">Error ID: {error.digest}</p> : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button onClick={() => reset()} className={buttonClass("md", "bg-[#FF3B30] text-white")} style={lettering(1.5, 2)}>
            <RefreshCcw className="h-5 w-5" strokeWidth={2.5} />
            Try again
          </button>
          <Link href="/" className={buttonClass("md")}>
            <Home className="h-5 w-5" strokeWidth={2.5} />
            Back home
          </Link>
        </div>
      </ErrorSplash>

      <SiteFooter />
    </div>
  )
}
