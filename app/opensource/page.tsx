import Link from "next/link"
import type { ElementType } from "react"
import {
  ArrowLeft,
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
  accent: string
  accentBg: string
  accentBorder: string
  accentText: string
  barFrom: string
  barTo: string
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
    accent: "violet",
    accentBg: "bg-violet-500/10",
    accentBorder: "border-violet-500/30",
    accentText: "text-violet-300",
    barFrom: "from-violet-500",
    barTo: "to-indigo-500",
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
    accent: "cyan",
    accentBg: "bg-cyan-500/10",
    accentBorder: "border-cyan-500/30",
    accentText: "text-cyan-300",
    barFrom: "from-cyan-500",
    barTo: "to-blue-500",
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
    accent: "emerald",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/30",
    accentText: "text-emerald-300",
    barFrom: "from-emerald-500",
    barTo: "to-teal-500",
    icon: Server,
    modules: [
      { icon: Database, title: "io_uring back-end", body: "Non-blocking I/O via Linux io_uring for minimal syscall overhead." },
      { icon: Layers, title: "Monoio runtime", body: "Tight integration with the Monoio single-threaded async executor." },
    ],
  },
]

const statusLabel: Record<Product["status"], { label: string; cls: string }> = {
  active: { label: "Active", cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
  beta: { label: "Beta", cls: "border-amber-500/30 bg-amber-500/10 text-amber-300" },
  maintained: { label: "Maintained", cls: "border-blue-500/30 bg-blue-500/10 text-blue-300" },
}

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[700px] w-[700px] rounded-full bg-gradient-to-b from-violet-900/20 to-indigo-900/20 blur-3xl translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-t from-cyan-900/20 to-emerald-900/20 blur-3xl -translate-x-1/3 translate-y-1/3 opacity-40" />
      </div>

      <header className="container mx-auto max-w-4xl px-4 py-8 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-medium tracking-[0.22em] text-white">
          Kowit C.
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      <main className="container mx-auto max-w-4xl px-4 pb-24">

        {/* ── Page header ── */}
        <div className="mb-14 space-y-4">
          <div className="flex items-center gap-3">
            <Boxes className="h-5 w-5 text-gray-400 shrink-0" />
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Open Source</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white">Products</h1>
          <p className="max-w-2xl text-gray-400 leading-relaxed">
            A vertical stack of Rust libraries — from hardware-level JSON parsing to a full web framework —
            each layer tuned for zero-cost abstractions and real-world developer ergonomics.
          </p>
          <Link
            href="https://crates.io/users/kowito"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900/60 px-4 py-1.5 text-xs text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
          >
            <PackageOpen className="h-3.5 w-3.5" />
            crates.io/users/kowito
            <ExternalLink className="h-3 w-3 opacity-60" />
          </Link>
        </div>

        {/* ── Product list ── */}
        <div className="space-y-6">
          {products.map((product) => {
            const Icon = product.icon
            const { label, cls } = statusLabel[product.status]
            return (
              <article
                key={product.id}
                className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden"
              >
                <div className={`h-[2px] bg-gradient-to-r ${product.barFrom} ${product.barTo}`} />
                <div className="p-6 md:p-8 space-y-6">

                  {/* Product header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-xl p-2 ${product.accentBg} border ${product.accentBorder}`}>
                        <Icon className={`h-5 w-5 ${product.accentText}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="text-xl font-semibold tracking-tight text-white">{product.name}</h2>
                          <span className={`text-[10px] font-medium rounded-full border px-2 py-0.5 ${cls}`}>
                            {label}
                          </span>
                        </div>
                        <p className={`mt-0.5 text-sm ${product.accentText}`}>{product.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {product.externalHref && (
                        <Link
                          href={product.externalHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${product.accentBorder} ${product.accentBg} ${product.accentText} hover:brightness-125`}
                        >
                          <ExternalLink className="h-3 w-3" />
                          {product.externalLabel}
                        </Link>
                      )}
                      {product.href && (
                        <Link
                          href={product.href}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${product.accentBorder} ${product.accentBg} ${product.accentText} hover:brightness-125`}
                        >
                          View details
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">{product.description}</p>

                  {/* Modules */}
                  {product.modules && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.modules.map((mod) => {
                        const ModIcon = mod.icon
                        return (
                          <div
                            key={mod.title}
                            className={`rounded-2xl border ${product.accentBorder} ${product.accentBg} px-4 py-3.5`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <ModIcon className={`h-3.5 w-3.5 shrink-0 ${product.accentText}`} />
                              <p className={`text-xs font-semibold font-mono ${product.accentText}`}>{mod.title}</p>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed">{mod.body}</p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </main>
    </div>
  )
}
