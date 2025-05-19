import Image from "next/image"
import Link from "next/link"
import { Github, ExternalLink, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100 flex flex-col">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-indigo-900/20 to-purple-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-blue-900/20 to-cyan-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-50"></div>
      </div>

      <header className="container mx-auto py-8 px-4 flex items-center justify-between">
        <span className="font-light tracking-wider text-lg text-white">K.</span>
        <ThemeToggle />
      </header>

      <main className="container mx-auto flex-1 px-6 py-16 md:py-32 max-w-2xl">
        <section className="space-y-20">
          {/* Hero */}
          <div className="relative">
            <div className="flex flex-col gap-12">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 p-[2px]">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-900">
                      <Image
                        src="/placeholder.svg?height=128&width=128"
                        alt="Kowit C."
                        width={128}
                        height={128}
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-gray-900"></div>
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white">Kowit C.</h1>
                  <p className="text-gray-400 mt-1 text-sm md:text-base font-light">Digital Craftsman</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-5xl font-light tracking-tighter leading-tight text-white">
                
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Software Engineer &  BBQ Arsonist
                  </span>{" "}
                  – Faking competence in code, blockchain & charred meat for 30 years.
                </h2>

                <div className="mt-6 text-gray-300 leading-relaxed text-lg font-light space-y-4">
                  <p>
                    I'm Kowito—a "veteran" software engineer who's been faking it for just under three decades. I've spent the better part of that time convincing teams that my rubber-duck debugging counts as "innovative problem solving." When I'm not heroically patching legacy code, you'll find me unleashing my "expertise" on Python, TypeScript, and Solidity projects—because someone has to keep the blockchain circus running.
                  </p>
                  <p>
                    By night, I trade semicolons for skewers, incinerating meat in pursuit of BBQ godhood, or I become a passport-stamp addict, hoarding travel tales like rare coins.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-white">Web3 & Blockchain:</p>
                      <p>Because plain-old CRUD apps were putting me into a coma.</p>
                    </div>
                    <div>
                      <p className="font-medium text-white">Rust:</p>
                      <p>My favorite self-inflicted torture device—nothing says "I love pain" like borrow checkers at 2 AM.</p>
                    </div>
                    <div>
                      <p className="font-medium text-white">BBQ:</p>
                      <p>On a relentless quest to char meat into legend (and occasionally my grill).</p>
                    </div>
                    <div>
                      <p className="font-medium text-white">Globetrotter:</p>
                      <p>Collecting airport lounges, questionable street-food souvenirs, and delayed-flight war stories.</p>
                    </div>
                    <div>
                      <p className="font-medium text-white">Remote Work:</p>
                      <p>Master of distracting Zoom backgrounds and "Sorry, I was muted" excuses.</p>
                    </div>
                    <div>
                      <p className="font-medium text-white">Conference Circuit:</p>
                      <p>Champion of awkward small talk and unintentional door prizes.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0"
                  asChild
                >
                  <Link href="mailto:contact@example.com">
                    Connect
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-5 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                  asChild
                >
                  <Link href="https://github.com/kowito" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-5 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                  asChild
                >
                  <Link href="https://www.kowito.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Portfolio
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="relative">
            <div className="space-y-8">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-medium">Expertise</h3>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-2 text-white">
                  Technical Proficiency
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors">
                  <h4 className="font-medium text-white">Frontend</h4>
                  <p className="text-sm text-gray-400 mt-1">React, Next.js & endless states of confusion</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors">
                  <h4 className="font-medium text-white">Backend</h4>
                  <p className="text-sm text-gray-400 mt-1">Where my bugs hide from the UI team</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors">
                  <h4 className="font-medium text-white">Blockchain</h4>
                  <p className="text-sm text-gray-400 mt-1">Smart contracts & dumb mistakes</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors">
                  <h4 className="font-medium text-white">Languages</h4>
                  <p className="text-sm text-gray-400 mt-1">Fluent in Googling & Stack Overflow</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors">
                  <h4 className="font-medium text-white">DevOps</h4>
                  <p className="text-sm text-gray-400 mt-1">Breaking production with confidence</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-gray-700 transition-colors">
                  <h4 className="font-medium text-white">Rust</h4>
                  <p className="text-sm text-gray-400 mt-1">Fighting the borrow checker & losing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="relative">
            <div className="space-y-6">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-gray-400 font-medium">Let's Connect</h3>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-2 text-white">Start a Conversation</h2>
              </div>

              <p className="text-gray-300 font-light">
              Looking for a code-crashing sidekick to share the burden of bug hunts? A foolproof rib rub recipe that doesn't lead to literal smoking? Or a travel story so tall it needs its own zip code? Let's connect—if you dare.
              </p>

              <div className="inline-block">
                <Button
                  className="rounded-full px-6 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white border-0"
                  asChild
                >
                  <Link href="mailto:contact@example.com">
                    Send a message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-light">
          <div>
            <p>© {new Date().getFullYear()} Kowit C. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
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
            <Link
              href="https://www.kowito.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
