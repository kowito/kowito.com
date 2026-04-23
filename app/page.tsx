import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { Github, ArrowRight, Flame, Globe, Video, Coffee, Wrench, Coins, Dumbbell, Utensils, Boxes, Music4, PackageOpen } from "lucide-react"
import type { ElementType } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata: Metadata = {
  title: "Home",
  description: "Kowit C. portfolio: software engineering work, open source projects, training plan, and diet plan.",
  alternates: {
    canonical: "/",
  },
}

type InterestItem = {
  icon: ElementType
  color: string
  title: string
  body: string
}

const interests: InterestItem[] = [
  {
    icon: Coins,
    color: "text-indigo-400",
    title: "Web3 & Blockchain",
    body: "Because plain-old CRUD apps were putting me into a coma.",
  },
  {
    icon: Wrench,
    color: "text-red-400",
    title: "Rust",
    body: "My favorite self-inflicted torture device\u2014borrow checkers at 2 AM.",
  },
  {
    icon: Flame,
    color: "text-amber-400",
    title: "BBQ",
    body: "On a relentless quest to char meat into legend (and occasionally my grill).",
  },
  {
    icon: Globe,
    color: "text-blue-400",
    title: "Globetrotter",
    body: "Collecting airport lounges, questionable street-food souvenirs, and delayed-flight war stories.",
  },
  {
    icon: Video,
    color: "text-green-400",
    title: "Remote Work",
    body: "Master of distracting Zoom backgrounds and \u201cSorry, I was muted\u201d excuses.",
  },
  {
    icon: Coffee,
    color: "text-pink-400",
    title: "Conference Circuit",
    body: "Champion of awkward small talk and unintentional door prizes.",
  },
]

const stack = [
  "Python",
  "TypeScript",
  "Rust",
  "Solidity",
  "React",
  "Next.js",
  "Node.js",
  "Web3",
  "Smart Contracts",
  "DevOps",
]

function InterestCard({ item }: { item: InterestItem }) {
  const Icon = item.icon
  return (
    <div className="group p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
        <h4 className="font-medium text-white text-sm">{item.title}</h4>
      </div>
      <p className="text-sm text-gray-400 leading-snug">{item.body}</p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[800px] w-[800px] rounded-full bg-gradient-to-b from-indigo-900/20 to-purple-900/20 blur-3xl translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-t from-blue-900/20 to-cyan-900/20 blur-3xl -translate-x-1/3 translate-y-1/3 opacity-50" />
      </div>

      <header className="container mx-auto py-8 px-4 flex items-center justify-between">
        <span className="font-display text-lg font-medium tracking-[0.22em] text-white">Kowit C.</span>
        <div className="flex items-center gap-4">
          <Link
            href="/opensource"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Boxes className="h-3.5 w-3.5" />
            Open Source
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto flex-1 px-6 py-16 md:py-28 max-w-2xl">
        <div className="space-y-20">

          {/* ── Hero ── */}
          <section className="flex flex-col gap-10">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 p-[2px]">
                  <div className="h-full w-full rounded-full overflow-hidden bg-gray-900">
                    <Image
                      src="/kowito.jpg"
                      alt="Kowit C."
                      width={128}
                      height={128}
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-400 ring-2 ring-gray-950" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">Kowit C.</h1>
                <p className="mt-0.5 text-sm md:text-base text-gray-400 font-light">Digital Craftsman</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-5xl font-medium leading-tight text-white">
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Software Engineer &amp; BBQ Arsonist
                </span>
                {" "}&mdash; Faking competence in code, blockchain &amp; charred meat for 30 years.
              </h2>

              <div className="text-gray-300 leading-relaxed text-lg font-light space-y-3">
                <p>
                  I&apos;m Kowito&mdash;a &ldquo;veteran&rdquo; software engineer who&apos;s been faking it for just
                  under three decades. I&apos;ve spent the better part of that time convincing teams that my
                  rubber-duck debugging counts as &ldquo;innovative problem solving.&rdquo; When I&apos;m not
                  heroically patching legacy code, you&apos;ll find me unleashing my &ldquo;expertise&rdquo; on
                  Python, TypeScript, and Solidity projects&mdash;because someone has to keep the blockchain circus
                  running.
                </p>
                <p>
                  By night, I trade semicolons for skewers, incinerating meat in pursuit of BBQ godhood, or I become
                  a passport-stamp addict, hoarding travel tales like rare coins.
                </p>
              </div>

              <div className="pt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
                {interests.map((item) => (
                  <InterestCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0"
                asChild
              >
                <Link href="mailto:hi@kowito.com">
                  Connect
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-5 border-gray-500 text-white bg-gray-800/50 hover:bg-gray-700 hover:border-gray-400"
                asChild
              >
                <Link href="https://github.com/kowito" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-5 border-gray-500 text-white bg-gray-800/50 hover:bg-gray-700 hover:border-gray-400"
                asChild
              >
                <Link href="/personal-training">
                  <Dumbbell className="mr-2 h-4 w-4" />
                  Training Plan
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-5 border-gray-500 text-white bg-gray-800/50 hover:bg-gray-700 hover:border-gray-400"
                asChild
              >
                <Link href="/diet">
                  <Utensils className="mr-2 h-4 w-4" />
                  Diet Plan
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-5 border-gray-500 text-white bg-gray-800/50 hover:bg-gray-700 hover:border-gray-400"
                asChild
              >
                <Link href="/opensource">
                  <Boxes className="mr-2 h-4 w-4" />
                  Open Source
                </Link>
              </Button>
            </div>
          </section>

          {/* ── Open Source ── */}
          <section className="space-y-6 border-t border-gray-800/60 pt-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Open Source</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-light tracking-tight text-white">Public Work</h2>
              <p className="mt-2 text-sm text-gray-400 leading-relaxed max-w-2xl">
                I build Rust-first open source tooling, publish crates, and maintain public repos with practical docs,
                issue triage, and iterative releases. My focus is shipping useful developer workflows, not just demos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                href="https://crates.io/users/kowito"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-4 hover:bg-cyan-500/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <PackageOpen className="h-4 w-4 text-cyan-300" />
                  <h3 className="text-sm font-semibold text-white">crates.io Profile</h3>
                </div>
                <p className="text-xs text-cyan-100/80">crates.io/users/kowito</p>
              </Link>

              <Link
                href="/opensource/chopin"
                className="rounded-2xl border border-violet-500/25 bg-violet-500/10 px-4 py-4 hover:bg-violet-500/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Music4 className="h-4 w-4 text-violet-300" />
                  <h3 className="text-sm font-semibold text-white">Chopin</h3>
                </div>
                <p className="text-xs text-violet-100/80">Dedicated project page</p>
              </Link>
            </div>

            <Button
              variant="outline"
              className="rounded-full px-5 border-gray-500 text-white bg-gray-800/50 hover:bg-gray-700 hover:border-gray-400"
              asChild
            >
              <Link href="/opensource">
                <Boxes className="mr-2 h-4 w-4" />
                View All Open Source Work
              </Link>
            </Button>

            <div className="flex flex-wrap gap-2">
              {[
                "Rust crates and package releases",
                "Repository maintenance and issue cleanup",
                "API ergonomics and developer tooling",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1.5 text-xs text-gray-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          {/* ── Tech Stack ── */}
          <section className="space-y-6 border-t border-gray-800/60 pt-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Expertise</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-light tracking-tight text-white">Tech Stack</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full px-3 py-1.5 text-sm bg-gray-900/60 border border-gray-800 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* ── Contact ── */}
          <section className="space-y-6 border-t border-gray-800/60 pt-12">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Let&apos;s Connect</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-light tracking-tight text-white">Start a Conversation</h2>
            </div>
            <p className="text-gray-300 font-light">
              Looking for a code-crashing sidekick to share the burden of bug hunts? A foolproof rib rub recipe that
              doesn&apos;t lead to literal smoking? Or a travel story so tall it needs its own zip code?
              Let&apos;s connect&mdash;if you dare.
            </p>
            <Button
              className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0"
              asChild
            >
              <Link href="mailto:hi@kowito.com">
                Send a message
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </section>

        </div>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-light">
          <p>&copy; {new Date().getFullYear()} Kowit C. All rights reserved.</p>
          <nav className="flex gap-6">
            <Link
              href="https://github.com/kowito"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://twitter.com/kowito"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Twitter
            </Link>
            <Link href="/personal-training" className="hover:text-white transition-colors">
              Training
            </Link>
            <Link href="/diet" className="hover:text-white transition-colors">
              Diet
            </Link>
            <Link href="/opensource" className="hover:text-white transition-colors">
              Open Source
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
