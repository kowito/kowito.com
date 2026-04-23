import Link from "next/link"
import { ArrowLeft, Boxes, ExternalLink, Github, PackageOpen, Music4, Cpu, Database, Shield } from "lucide-react"

const projects = [
  {
    name: "Chopin",
    subtitle: "A modular high-speed web framework for the modern Rust ecosystem",
    href: "/opensource/chopin",
    tag: "Featured",
  },
]

const chopinModules = [
  {
    title: "Chopin-Core",
    body: "High-performance HTTP engine and router.",
  },
  {
    title: "Chopin-Auth/RBAC",
    body: "Fine-grained security and access control modules.",
  },
  {
    title: "Chopin-ORM",
    body: "Lightweight, type-safe database abstraction layer.",
  },
  {
    title: "Chopin-CLI",
    body: "Scaffolding and developer productivity tooling.",
  },
]

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[650px] w-[650px] rounded-full bg-gradient-to-b from-emerald-900/20 to-cyan-900/20 blur-3xl translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 h-[650px] w-[650px] rounded-full bg-gradient-to-t from-indigo-900/20 to-blue-900/20 blur-3xl -translate-x-1/3 translate-y-1/3 opacity-40" />
      </div>

      <header className="container mx-auto max-w-6xl px-4 py-8 flex items-center justify-between">
        <Link href="/" className="font-light tracking-wider text-lg text-white hover:text-gray-300 transition-colors">
          Kowit C.
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      <main className="container mx-auto max-w-6xl px-4 pb-20">
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-3">
            <Boxes className="h-6 w-6 text-emerald-400 shrink-0" />
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">Open Source Work</h1>
          </div>
          <p className="max-w-2xl text-gray-400 text-sm leading-relaxed">
            I am the architect and maintainer of a high-performance Rust ecosystem focused on low-latency web
            infrastructure and hardware-accelerated data processing. My work pushes the boundaries of the zero-cost
            abstraction philosophy across a full vertical stack.
          </p>
        </div>

        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden mb-6">
          <div className="h-[2px] bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Music4 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold tracking-tight text-white">The Chopin Framework</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4 max-w-3xl">
              I developed Chopin, a modular, high-speed web framework built for the modern Rust ecosystem. It provides
              a full-stack foundation from core HTTP handling to auth, ORM, and developer tooling.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chopinModules.map((item) => (
                <div key={item.title} className="rounded-2xl border border-gray-800 bg-gray-900/40 px-4 py-4">
                  <p className="text-sm font-semibold text-emerald-300">{item.title}</p>
                  <p className="mt-1.5 text-xs text-gray-400 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden mb-6">
          <div className="h-[2px] bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold tracking-tight text-white">SIMD-Accelerated Data Systems</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
              I maintain kowito-json, a specialized JSON parsing suite that leverages SIMD and ARM NEON instructions.
              The project focuses on zero-decode parsing and JIT-bound schemas to maximize serialization and parsing
              throughput in data-heavy workloads.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden mb-6">
          <div className="h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500" />
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <Database className="h-5 w-5 text-violet-400" />
              <h2 className="text-xl font-semibold tracking-tight text-white">Async I/O & Database Drivers</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
              I contribute to the Monoio ecosystem, an io_uring-based runtime, and build high-concurrency drivers such
              as chopin-pg. My focus is reducing overhead in the database-to-application pipeline by using modern Linux
              kernel features for non-blocking I/O.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden mb-6">
          <div className="h-[2px] bg-gradient-to-r from-amber-500 to-rose-500" />
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-semibold tracking-tight text-white">Mission</h2>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-3xl">
              Build a vertical stack of Rust libraries where every layer, from hardware-level JSON parsing to top-level
              web framework modules, is tuned for maximum efficiency and developer ergonomics.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden mb-6">
          <div className="h-[2px] bg-gradient-to-r from-cyan-500 to-emerald-500" />
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <PackageOpen className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold tracking-tight text-white">crates.io Profile</h2>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Follow released Rust crates, version history, and package metadata.
            </p>
            <Link
              href="https://crates.io/users/kowito"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200 hover:bg-cyan-500/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              crates.io/users/kowito
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-indigo-500 to-violet-500" />
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <Github className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xl font-semibold tracking-tight text-white">Project Pages</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map((project) => (
                <Link
                  key={project.name}
                  href={project.href}
                  className="rounded-2xl border border-gray-800 bg-gray-900/40 px-4 py-4 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Music4 className="h-4 w-4 text-violet-400" />
                      <p className="text-base font-semibold text-white">{project.name}</p>
                    </div>
                    <span className="text-[10px] font-medium rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 px-2 py-0.5">
                      {project.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{project.subtitle}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
