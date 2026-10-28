import Link from "next/link"
import { cn } from "@/lib/utils"

const links = [
  { href: "https://github.com/kowito", label: "GitHub", external: true },
  { href: "https://twitter.com/kowito", label: "Twitter", external: true },
  { href: "/personal-training", label: "Training" },
  { href: "/diet", label: "Diet" },
  { href: "/countries", label: "Countries" },
  { href: "/books", label: "Books" },
  { href: "/opensource", label: "Open Source" },
]

/** Site-wide footer. Pass a max-width class so it lines up with the page's own column. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("container mx-auto px-6 py-12 border-t border-gray-800", className)}>
      {/* Wraps instead of switching at a breakpoint, so it also fits pages with a narrow column. */}
      <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-8 gap-y-4 text-sm text-gray-400 font-light">
        <p className="whitespace-nowrap">&copy; {new Date().getFullYear()} Kowit C. All rights reserved.</p>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
