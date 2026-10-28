import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { buttonClass } from "@/components/comic"
import { ErrorSplash } from "@/components/error-splash"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <ErrorSplash sound="404!" caption="Meanwhile, on a page that doesn't exist…" title="Well, this is awkward">
        <p className="mt-6 max-w-lg text-balance text-lg">
          We searched everywhere, including behind the semicolons, but this page is still missing.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className={buttonClass("md", "bg-[#FFD400]")}>
            <Home className="h-5 w-5" strokeWidth={2.5} />
            Back home
          </Link>
          <Link href="mailto:hi@kowito.com" className={buttonClass("md")}>
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
            Contact
          </Link>
        </div>
      </ErrorSplash>

      <SiteFooter />
    </div>
  )
}
