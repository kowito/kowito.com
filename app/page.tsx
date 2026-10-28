import Image from "next/image"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import type { Metadata } from "next"
import { Github, ArrowRight, Flame, Globe, Video, Coffee, Wrench, Coins, Boxes, Music4, PackageOpen } from "lucide-react"
import type { ElementType } from "react"
import {
  Burst,
  Caption,
  INK,
  SectionTitle,
  SiteHeader,
  Sticker,
  buttonClass,
  display,
  halftone,
  hardShadow,
  ink,
  lettering,
  lift,
  tilts,
} from "@/components/comic"
import { Reveal } from "@/components/comic-motion"

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
    color: INK.purple,
    title: "Web3 & Blockchain",
    body: "Because plain-old CRUD apps were putting me into a coma.",
  },
  {
    icon: Wrench,
    color: INK.orange,
    title: "Rust",
    body: "My favorite self-inflicted torture device—borrow checkers at 2 AM.",
  },
  {
    icon: Flame,
    color: INK.red,
    title: "BBQ",
    body: "On a relentless quest to char meat into legend (and occasionally my grill).",
  },
  {
    icon: Globe,
    color: INK.cyan,
    title: "Globetrotter",
    body: "Collecting airport lounges, questionable street-food souvenirs, and delayed-flight war stories.",
  },
  {
    icon: Video,
    color: INK.green,
    title: "Remote Work",
    body: "Master of distracting Zoom backgrounds and “Sorry, I was muted” excuses.",
  },
  {
    icon: Coffee,
    color: INK.pink,
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

const stackInks = [INK.yellow, INK.cyan, INK.pink, INK.green, "#fff", INK.orange]

/** A colour-blocked panel: the interest's ink and icon on top, the punchline underneath. */
function InterestCard({ item, index }: { item: InterestItem; index: number }) {
  const Icon = item.icon
  return (
    <div className={`group h-full bg-white ${ink} ${hardShadow} ${tilts[index % tilts.length]} ${lift}`}>
      <div
        className="flex items-center gap-2 border-b-[3px] border-black px-3 py-2"
        style={{ backgroundColor: item.color, ...halftone("rgba(0,0,0,0.14)", 6) }}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-black bg-white group-hover:animate-wiggle motion-reduce:animate-none">
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <h3 className={`${display} text-xl leading-none`}>{item.title}</h3>
      </div>
      <p className="px-3 py-2.5 text-sm leading-snug">{item.body}</p>
    </div>
  )
}

/** A white speech bubble whose tail points up at whoever is talking. */
function SpeechBubble({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative rounded-[26px] bg-white p-5 text-black sm:p-6 ${ink} shadow-[6px_6px_0_0_#000] ${className}`}>
      <span aria-hidden className="absolute -top-[15px] left-16 h-7 w-7 rotate-45 border-l-[3px] border-t-[3px] border-black bg-white" />
      <div className="relative">{children}</div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader className="max-w-5xl" back={false} links={[{ href: "/opensource", label: "Open Source", icon: Boxes }]} />

      <main className="container mx-auto max-w-5xl flex-1 px-4 pb-24 pt-6 md:pt-10">
        <div className="space-y-24">

          {/* ── Hero ── */}
          <section className="space-y-10">
            <div className="grid items-center gap-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-14">
              {/* Portrait, printed in a tilted panel */}
              <div className="relative mx-auto w-60 animate-in fade-in zoom-in-90 duration-700 motion-reduce:animate-none md:w-72">
                <div className={`-rotate-3 p-3 ${ink} shadow-[8px_8px_0_0_#000]`} style={{ backgroundColor: INK.cyan, ...halftone("rgba(0,0,0,0.16)", 6) }}>
                  <div className="relative aspect-square overflow-hidden rounded-full border-[3px] border-black bg-white">
                    <Image src="/kowito.jpg" alt="Kowit C." width={320} height={320} className="h-full w-full object-cover" priority />
                    <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={halftone("rgba(0,0,0,0.18)", 5)} />
                  </div>
                </div>
                <Burst
                  text="30 YRS!"
                  className="absolute -right-8 -top-8 w-24 animate-in zoom-in-50 spin-in-12 fill-mode-both delay-300 duration-500 motion-reduce:animate-none md:w-28"
                />
                <Sticker color={INK.green} className="absolute -bottom-3 left-1/2 -translate-x-1/2 rotate-2 whitespace-nowrap text-xs">
                  <span className="h-2 w-2 rounded-full border border-black bg-white" />
                  Online &amp; coding
                </Sticker>
              </div>

              <div className="space-y-5 text-center animate-in fade-in slide-in-from-right-8 duration-700 motion-reduce:animate-none md:text-left">
                <Caption className="-rotate-2">Meanwhile, at the keyboard…</Caption>
                <div>
                  <h1 className={`${display} -rotate-2 text-7xl leading-[0.9] md:text-8xl`} style={{ ...lettering(3, 6), color: INK.yellow }}>
                    Kowit C.
                  </h1>
                  <p className={`${display} mt-3 text-2xl text-black/70`}>Digital Craftsman</p>
                </div>
                <h2 className={`${display} text-3xl leading-tight md:text-4xl`}>
                  <span className="bg-[#FF3B30] box-decoration-clone px-1.5 text-white" style={lettering(1.5, 2)}>
                    Software Engineer &amp; BBQ Arsonist
                  </span>
                  {" "}&mdash; Faking competence in code, blockchain &amp; charred meat for 30 years.
                </h2>
              </div>
            </div>

            <SpeechBubble className="animate-in fade-in zoom-in-95 delay-200 fill-mode-both duration-500 motion-reduce:animate-none">
              <div className="space-y-3 text-lg leading-relaxed">
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
            </SpeechBubble>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {interests.map((item, i) => (
                <Reveal key={item.title} delay={(i % 3) * 70}>
                  <InterestCard item={item} index={i} />
                </Reveal>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="mailto:hi@kowito.com" className={buttonClass("lg", "bg-[#FF3B30] text-white")} style={lettering(1.5, 2)}>
                Connect
                <ArrowRight className="h-5 w-5" strokeWidth={3} />
              </Link>
              <Link href="https://github.com/kowito" target="_blank" rel="noopener noreferrer" className={buttonClass("lg")}>
                <Github className="h-5 w-5" strokeWidth={2.5} />
                GitHub
              </Link>
              <Link href="/opensource" className={buttonClass("lg", "bg-[#FFD400]")}>
                <Boxes className="h-5 w-5" strokeWidth={2.5} />
                Open Source
              </Link>
            </div>
          </section>

          {/* ── Open Source ── */}
          <section className="space-y-7">
            <Reveal className="space-y-4">
              <SectionTitle title="Public Work!" sub="Open Source" color={INK.purple} />
              <p className="max-w-2xl leading-relaxed">
                I build Rust-first open source tooling, publish crates, and maintain public repos with practical docs,
                issue triage, and iterative releases. My focus is shipping useful developer workflows, not just demos.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                { href: "https://crates.io/users/kowito", external: true, icon: PackageOpen, title: "crates.io Profile", body: "crates.io/users/kowito", color: INK.cyan, tilt: "-rotate-1" },
                { href: "/opensource/chopin", external: false, icon: Music4, title: "Chopin", body: "Dedicated project page", color: INK.purple, tilt: "rotate-1" },
              ].map(({ href, external, icon: Icon, title, body, color, tilt }) => (
                <Reveal key={href}>
                  <Link
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`group flex items-center gap-4 bg-white p-4 ${ink} ${hardShadow} ${tilt} ${lift}`}
                  >
                    <span
                      className="grid h-14 w-14 shrink-0 place-items-center border-[3px] border-black group-hover:animate-wiggle motion-reduce:animate-none"
                      style={{ backgroundColor: color, ...halftone("rgba(0,0,0,0.16)", 5) }}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`${display} block text-2xl leading-none`}>{title}</span>
                      <span className="mt-1 block truncate text-sm font-bold text-black/60">{body}</span>
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                  </Link>
                </Reveal>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {[
                "Rust crates and package releases",
                "Repository maintenance and issue cleanup",
                "API ergonomics and developer tooling",
              ].map((item, i) => (
                <Sticker key={item} color={i === 1 ? INK.yellow : "#fff"} className={i % 2 ? "rotate-1" : "-rotate-1"}>
                  {item}
                </Sticker>
              ))}
            </div>

            <Link href="/opensource" className={buttonClass("md")}>
              <Boxes className="h-5 w-5" strokeWidth={2.5} />
              View All Open Source Work
            </Link>
          </section>

          {/* ── Tech Stack ── */}
          <section className="space-y-7">
            <Reveal>
              <SectionTitle title="Tech Stack!" sub="Expertise" color={INK.green} />
            </Reveal>
            <div className="flex flex-wrap gap-3">
              {stack.map((tag, i) => (
                <span
                  key={tag}
                  className={`${display} border-[3px] border-black px-3 py-1 text-xl shadow-[3px_3px_0_0_#000] transition-transform hover:-rotate-3 hover:scale-110 motion-reduce:transition-none ${tilts[i % tilts.length]}`}
                  style={{ backgroundColor: stackInks[i % stackInks.length] }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {/* ── Contact ── */}
          <section className="space-y-7">
            <Reveal>
              <SectionTitle title="Start a Conversation!" sub="Let's Connect" color={INK.red} />
            </Reveal>
            <Reveal>
              <div className="relative">
                <SpeechBubble className="pr-5 sm:pr-28">
                  <p className="text-lg leading-relaxed">
                    Looking for a code-crashing sidekick to share the burden of bug hunts? A foolproof rib rub recipe that
                    doesn&apos;t lead to literal smoking? Or a travel story so tall it needs its own zip code?
                    Let&apos;s connect&mdash;if you dare.
                  </p>
                  <Link href="mailto:hi@kowito.com" className={buttonClass("lg", "mt-5 bg-[#FF3B30] text-white")} style={lettering(1.5, 2)}>
                    Send a message
                    <ArrowRight className="h-5 w-5" strokeWidth={3} />
                  </Link>
                </SpeechBubble>
                <Burst text="HI!" className="absolute -bottom-10 -right-4 hidden w-28 rotate-12 sm:block" />
              </div>
            </Reveal>
          </section>

        </div>
      </main>

      <SiteFooter className="max-w-5xl px-4" />
    </div>
  )
}
