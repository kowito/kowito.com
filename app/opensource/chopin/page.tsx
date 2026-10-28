import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { INK, PageTitle, Panel, SectionTitle, SiteHeader, Sticker, buttonClass, display, halftone, hardShadow, ink, tilts } from "@/components/comic"
import { Reveal } from "@/components/comic-motion"
import { ArrowRight, Music4, Github, ExternalLink, FileCode2 } from "lucide-react"

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
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <SiteHeader className="max-w-5xl" back={{ href: "/opensource", label: "Open Source" }} />

      <main className="container mx-auto flex-1 max-w-5xl px-4 pb-20">
        <PageTitle
          kicker={
            <span className="inline-flex items-center gap-1.5">
              <Music4 className="h-3.5 w-3.5" strokeWidth={3} />
              Open Source
            </span>
          }
          title="Chopin"
          color={INK.purple}
          className="mb-14"
        >
          <p className="max-w-2xl text-lg leading-relaxed">
            Chopin is an actively maintained open source project where I focus on practical engineering work:
            architecture refinement, usability improvements, and reliability hardening. This page explains what I am
            doing now and where contributors can plug in.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            {highlights.map((item, i) => (
              <Sticker key={item} color={[INK.purple, "#fff", INK.yellow][i % 3]} className={i % 2 ? "rotate-1" : "-rotate-1"}>
                {item}
              </Sticker>
            ))}
          </div>
        </PageTitle>

        <section className="mb-16 space-y-7">
          <Reveal>
            <SectionTitle title="Current Focus in Chopin" color={INK.cyan} />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {currentWork.map((item, i) => (
              <Reveal key={item} delay={i * 80}>
                <div className={`flex h-full items-start gap-3 bg-white p-4 ${ink} ${hardShadow} ${tilts[i % tilts.length]}`}>
                  <span
                    className={`${display} grid h-10 w-10 shrink-0 place-items-center border-[3px] border-black text-2xl`}
                    style={{ backgroundColor: INK.cyan, ...halftone("rgba(0,0,0,0.14)", 5) }}
                  >
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="space-y-3 pt-2">
            <p className={`${display} text-2xl`}>How collaboration usually works</p>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
              {contributionFlow.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  <Sticker color={INK.yellow} className="text-xs">
                    {item}
                  </Sticker>
                  {i < contributionFlow.length - 1 && <ArrowRight aria-hidden className="h-5 w-5 shrink-0" strokeWidth={3} />}
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <Reveal>
          <Panel color={INK.green} dots className="rotate-[0.5deg] p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center border-[3px] border-black bg-white shadow-[3px_3px_0_0_#000]">
                <FileCode2 className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <h2 className={`${display} text-4xl leading-none`}>Repository</h2>
            </div>
            <p className="mt-4 font-bold">Main source and contribution entry point:</p>
            <Link
              href="https://github.com/kowito/chopin"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("md", "mt-4 max-w-full")}
            >
              <Github className="h-5 w-5 shrink-0" strokeWidth={2.5} />
              <span className="truncate">github.com/kowito/chopin</span>
              <ExternalLink className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            </Link>
          </Panel>
        </Reveal>
      </main>

      <SiteFooter className="max-w-5xl px-4" />
    </div>
  )
}
