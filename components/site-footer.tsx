import Link from "next/link"
import { ArrowUp, ArrowUpRight } from "lucide-react"
import { INK, display } from "@/components/comic"
import { cn } from "@/lib/utils"

type FooterLink = { href: string; label: string; external?: boolean }

const groups: { title: string; color: string; links: FooterLink[] }[] = [
  {
    title: "Built here",
    color: INK.yellow,
    links: [
      { href: "/safe", label: "Safe" },
      { href: "/apple-prices", label: "Apple Prices" },
      { href: "/countries", label: "Countries" },
      { href: "/books", label: "Books" },
    ],
  },
  {
    title: "Open source",
    color: INK.purple,
    links: [
      { href: "/opensource", label: "All projects" },
      { href: "/opensource/chopin", label: "Chopin" },
      { href: "https://crates.io/users/kowito", label: "crates.io", external: true },
    ],
  },
  {
    title: "Life",
    color: INK.green,
    links: [
      { href: "/personal-training", label: "Training" },
      { href: "/diet", label: "Diet" },
    ],
  },
  {
    title: "Elsewhere",
    color: INK.cyan,
    links: [
      { href: "https://github.com/kowito", label: "GitHub", external: true },
      { href: "https://twitter.com/kowito", label: "Twitter", external: true },
      { href: "mailto:hi@kowito.com", label: "Email" },
    ],
  },
]

/** Site-wide footer: the black strip at the bottom of the comic page. Pass a max-width class so it lines up with the page's own column. */
export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className="border-t-4 border-black bg-neutral-950 text-white">
      <div className={cn("container mx-auto px-6 pb-8 pt-12", className)}>
        {/* Sized by the column, not the viewport: pages pass anything from max-w-2xl to max-w-6xl. */}
        <div className="flex flex-wrap gap-x-12 gap-y-10">
          <div className="flex-[1_1_12rem] space-y-2">
            <Link href="/" className={`${display} text-3xl text-white transition-colors hover:text-[#FFD400]`}>
              Kowit C.
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-400">Software engineer &amp; BBQ arsonist, building things in Bangkok.</p>
          </div>

          <nav aria-label="Footer" className="grid flex-[3_1_26rem] grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-x-6 gap-y-8">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className={`${display} mb-3 text-lg`} style={{ color: group.color }}>
                  {group.title}
                </h2>
                <ul className="space-y-2 text-sm font-bold">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="inline-flex items-center gap-1 text-gray-300 underline-offset-4 transition-colors hover:text-[#FFD400] hover:underline"
                      >
                        {link.label}
                        {link.external && <ArrowUpRight aria-hidden className="h-3.5 w-3.5" strokeWidth={2.5} />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
          <p className={`${display} text-xl`}>
            <span className="text-[#FFD400]">The end!</span> &copy; {new Date().getFullYear()} Kowit C.
          </p>
          <a href="#" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-300 transition-colors hover:text-[#FFD400]">
            Back to top <ArrowUp aria-hidden className="h-4 w-4" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </footer>
  )
}
