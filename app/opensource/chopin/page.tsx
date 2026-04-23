import Link from "next/link"
import { ArrowLeft, Music4, Github, ExternalLink, FileCode2 } from "lucide-react"

const highlights = [
  "Open source project hosted on GitHub",
  "Built and maintained by Kowito",
  "Public repository for code, issues, and contributions",
]

const currentWork = [
  "Refining core architecture and internal module boundaries",
  "Improving developer UX through clearer APIs and safer defaults",
  "Hardening reliability with iterative fixes and cleanup",
]

const contributionFlow = [
  "Use issues for bug reports and feature requests",
  "Track implementation discussion in pull requests",
  "Ship changes in small, reviewable iterations",
]

export default function ChopinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[650px] w-[650px] rounded-full bg-gradient-to-b from-violet-900/20 to-indigo-900/20 blur-3xl translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 h-[650px] w-[650px] rounded-full bg-gradient-to-t from-emerald-900/20 to-cyan-900/20 blur-3xl -translate-x-1/3 translate-y-1/3 opacity-40" />
      </div>

      <header className="container mx-auto max-w-5xl px-4 py-8 flex items-center justify-between">
        <Link href="/opensource" className="font-light tracking-wider text-lg text-white hover:text-gray-300 transition-colors">
          Open Source
        </Link>
        <Link
          href="/opensource"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      <main className="container mx-auto max-w-5xl px-4 pb-20">
        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden mb-6">
          <div className="h-[2px] bg-gradient-to-r from-violet-500 to-indigo-500" />
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <Music4 className="h-6 w-6 text-violet-400 shrink-0" />
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white">Chopin</h1>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-2xl">
              Chopin is an actively maintained open source project where I focus on practical engineering work:
              architecture refinement, usability improvements, and reliability hardening. This page explains what I am
              doing now and where contributors can plug in.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs text-violet-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden mb-6">
          <div className="h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-500" />
          <div className="p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-white">Current Focus in Chopin</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentWork.map((item) => (
                <div key={item} className="rounded-2xl border border-gray-800 bg-gray-900/40 px-4 py-3.5">
                  <p className="text-xs text-gray-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <div className="pt-1">
              <p className="text-sm font-medium text-white mb-2">How collaboration usually works</p>
              <div className="flex flex-wrap gap-2">
                {contributionFlow.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-black/30 overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-emerald-500 to-cyan-500" />
          <div className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <FileCode2 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold tracking-tight text-white">Repository</h2>
            </div>
            <p className="text-sm text-gray-400">Main source and contribution entry point:</p>
            <Link
              href="https://github.com/kowito/chopin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20 transition-colors"
            >
              <Github className="h-4 w-4" />
              github.com/kowito/chopin
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
