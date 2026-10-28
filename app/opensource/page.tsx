import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import type { ElementType } from "react"
import { INK, PageTitle, SiteHeader, Sticker, buttonClass, display, halftone, hardShadow, ink, tilts } from "@/components/comic"
import { Reveal } from "@/components/comic-motion"
import {
  ArrowRight,
  Boxes,
  ExternalLink,
  Music4,
  Cpu,
  Database,
  PackageOpen,
  Layers,
  Lock,
  TerminalSquare,
  Zap,
  Activity,
  Server,
} from "lucide-react"

type Module = {
  icon: ElementType
  title: string
  body: string
}

type Product = {
  id: string
  name: string
  tagline: string
  description: string
  status: "active" | "beta" | "maintained"
  /** The product's ink, used for its header strip and module tabs. */
  color: string
  icon: ElementType
  href?: string
  externalHref?: string
  externalLabel?: string
  modules?: Module[]
}

const products: Product[] = [
  {
    id: "chopin",
    name: "Chopin",
    tagline: "High-speed modular web framework for Rust",
    description:
      "A full-stack Rust web framework built around zero-cost abstractions. Chopin provides a composable module system covering HTTP routing, authentication, database access, and developer tooling — designed to be assembled only what your project needs.",
    status: "active",
    color: INK.purple,
    icon: Music4,
    href: "/opensource/chopin",
    modules: [
      { icon: Layers, title: "chopin-core", body: "High-performance HTTP engine, router, and middleware pipeline." },
      { icon: Lock, title: "chopin-auth", body: "Fine-grained RBAC, session management, and JWT integration." },
      { icon: Database, title: "chopin-orm", body: "Lightweight, type-safe async database abstraction layer." },
      { icon: TerminalSquare, title: "chopin-cli", body: "Project scaffolding and developer productivity tooling." },
    ],
  },
  {
    id: "kowito-json",
    name: "kowito-json",
    tagline: "SIMD-accelerated JSON parsing for data-heavy workloads",
    description:
      "A specialized JSON parsing suite that leverages SIMD and ARM NEON instructions for hardware-level throughput. Focuses on zero-decode parsing and JIT-bound schemas to maximize serialization speed in high-volume data pipelines.",
    status: "maintained",
    color: INK.cyan,
    icon: Cpu,
    externalHref: "https://crates.io/users/kowito",
    externalLabel: "crates.io/users/kowito",
    modules: [
      { icon: Zap, title: "SIMD / ARM NEON", body: "Vectorised parsing paths for x86_64 and AArch64 targets." },
      { icon: Activity, title: "Zero-decode API", body: "Parse directly into typed structs with no intermediate allocations." },
    ],
  },
  {
    id: "chopin-pg",
    name: "chopin-pg",
    tagline: "io_uring async PostgreSQL driver",
    description:
      "A high-concurrency PostgreSQL driver built on the Monoio io_uring runtime. Eliminates blocking I/O overhead in the database-to-application pipeline by exploiting modern Linux kernel async I/O primitives for near-zero-cost data access.",
    status: "beta",
    color: INK.green,
    icon: Server,
    modules: [
      { icon: Database, title: "io_uring back-end", body: "Non-blocking I/O via Linux io_uring for minimal syscall overhead." },
      { icon: Layers, title: "Monoio runtime", body: "Tight integration with the Monoio single-threaded async executor." },
    ],
  },
]


const statusLabel: Record<Product["status"], { label: string; color: string }> = {
  active: { label: "Active!", color: INK.green },
  beta: { label: "Beta", color: INK.yellow },
  maintained: { label: "Maintained", color: INK.cyan },
}

export default function OpenSourcePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader className="max-w-4xl" />

      <main className="container mx-auto flex-1 max-w-4xl px-4 pb-24">

        {/* ── Page header ── */}
        <PageTitle
          kicker={
            <span className="inline-flex items-center gap-1.5">
              <Boxes className="h-3.5 w-3.5" strokeWidth={3} />
              Open Source
            </span>
          }
          title="Products!" color={INK.purple} className="mb-14">
          <p className="max-w-2xl text-lg leading-relaxed">
            A vertical stack of Rust libraries — from hardware-level JSON parsing to a full web framework —
            each layer tuned for zero-cost abstractions and real-world developer ergonomics.
          </p>
          <Link
            href="https://crates.io/users/kowito"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass("sm", "bg-[#4CC9F0]")}
          >
            <PackageOpen className="h-4 w-4" strokeWidth={2.5} />
            crates.io/users/kowito
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
          </Link>
        </PageTitle>

        {/* ── Product list ── */}
        <div className="space-y-10">
          {products.map((product, i) => {
            const Icon = product.icon
            const status = statusLabel[product.status]
            return (
              <Reveal key={product.id}>
                <article className={`overflow-hidden bg-white ${ink} shadow-[8px_8px_0_0_#000] ${i % 2 ? "rotate-[0.4deg]" : "-rotate-[0.4deg]"}`}>
                  {/* Product header, printed in the product's ink */}
                  <div
                    className="flex flex-col gap-4 border-b-[3px] border-black p-5 sm:flex-row sm:items-center sm:justify-between md:px-7"
                    style={{ backgroundColor: product.color, ...halftone("rgba(0,0,0,0.14)", 6) }}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="grid h-14 w-14 shrink-0 place-items-center border-[3px] border-black bg-white shadow-[3px_3px_0_0_#000]">
                        <Icon className="h-7 w-7" strokeWidth={2.5} />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className={`${display} text-4xl leading-none`}>{product.name}</h2>
                          <Sticker color={status.color} className="-rotate-3 uppercase tracking-wider">
                            {status.label}
                          </Sticker>
                        </div>
                        <p className="mt-1 text-sm font-bold">{product.tagline}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                      {product.externalHref && (
                        <Link href={product.externalHref} target="_blank" rel="noopener noreferrer" className={buttonClass("sm")}>
                          <ExternalLink className="h-4 w-4" strokeWidth={2.5} />
                          {product.externalLabel}
                        </Link>
                      )}
                      {product.href && (
                        <Link href={product.href} className={buttonClass("sm", "bg-[#FFD400]")}>
                          View details
                          <ArrowRight className="h-4 w-4" strokeWidth={3} />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6 p-5 md:p-7">
                    {/* Description */}
                    <p className="max-w-3xl leading-relaxed">{product.description}</p>

                    {/* Modules */}
                    {product.modules && (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {product.modules.map((mod, j) => {
                          const ModIcon = mod.icon
                          return (
                            <div key={mod.title} className={`group bg-white ${ink} ${hardShadow} ${tilts[j % tilts.length]}`}>
                              <div className="flex items-center gap-2 border-b-[3px] border-black px-3 py-1.5" style={{ backgroundColor: product.color }}>
                                <ModIcon className="h-4 w-4 shrink-0 group-hover:animate-wiggle motion-reduce:animate-none" strokeWidth={2.5} />
                                <p className="font-mono text-sm font-bold">{mod.title}</p>
                              </div>
                              <p className="px-3 py-2.5 text-sm leading-relaxed">{mod.body}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </main>

      <SiteFooter className="max-w-4xl px-4" />
    </div>
  )
}
