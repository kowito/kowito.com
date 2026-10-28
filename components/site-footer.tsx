import Link from "next/link"
import { cn } from "@/lib/utils"

const links = [
  { href: "https://github.com/kowito", label: "GitHub", external: true },
  { href: "https://twitter.com/kowito", label: "Twitter", external: true },
  { href: "/personal-training", label: "Training" },
  { href: "/diet", label: "Diet" },
  { href: "/countries", label: "Countries" },
  { href: "/books", label: "Books" },
  { href: "/apple-prices", label: "Apple Prices" },
  { href: "/opensource", label: "Open Source" },
]

/** Site-wide footer: the black strip at the bottom of the comic page. Pass a max-width class so it lines up with the page's own column. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className="border-t-4 border-black bg-neutral-950 text-white">
      {/* Wraps instead of switching at a breakpoint, so it also fits pages with a narrow column. */}
      <div className={cn("container mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 py-10 md:justify-between", className)}>
        <p className="whitespace-nowrap font-display text-xl tracking-wide">
          <span className="text-[#FFD400]">The end!</span> &copy; {new Date().getFullYear()} Kowit C.
        </p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-gray-300 underline-offset-4 transition-colors hover:text-[#FFD400] hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
