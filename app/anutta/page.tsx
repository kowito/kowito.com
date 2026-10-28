import Link from "next/link"
import { readdirSync } from "fs"
import { join } from "path"
import { INK, PageTitle, Panel, Sticker, buttonClass, display, halftone } from "@/components/comic"

const CONTENT_DIR = join(process.cwd(), "app/anutta/content")

/** Bangers has no Thai glyphs, so anything with Thai in it is set in the bold body font instead. */
const THAI = /[฀-๿]/
const titleFont = (text: string) => (THAI.test(text) ? "font-sans font-bold text-lg leading-snug" : `${display} text-2xl leading-none`)

function slugToTitle(slug: string) {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function getContentSlugs() {
  try {
    return readdirSync(CONTENT_DIR).filter(
      (f) => !f.startsWith(".") && !f.startsWith("[")
    )
  } catch {
    return []
  }
}

const staticSections = [
  {
    title: "Pitch Deck",
    description: "Private presentation for Anutta Parse Code.",
    href: "/anutta/pitch",
    type: "page",
  },
]

const typeInk: Record<string, string> = { post: INK.cyan, page: INK.green }

export default function AnuttaPage() {
  const contentSlugs = getContentSlugs()

  const contentSections = contentSlugs.map((slug) => ({
    title: slugToTitle(slug),
    description: `${slug}`,
    href: `/anutta/content/${slug}`,
    type: "post",
  }))

  const allSections = [...staticSections, ...contentSections]

  return (
    <main className="min-h-[100dvh] overflow-x-clip px-4 py-10 md:px-10 md:py-16">
      <div className="mx-auto w-full max-w-4xl">
        <PageTitle kicker="Travel · Tech · Smart lifestyle" title="Anutta">
          <p className="max-w-xl text-base font-bold leading-relaxed md:text-lg">
            A personal blog by Anutta Parse Code on travel, tech, and smart lifestyle stories.
          </p>
        </PageTitle>

        <Panel className="mt-10 animate-in fade-in zoom-in-95 fill-mode-both delay-150 duration-500 [animation-timing-function:cubic-bezier(.2,.9,.3,1.4)] motion-reduce:animate-none">
          <table className="w-full table-auto text-left">
            <thead className="border-b-[3px] border-black" style={{ backgroundColor: INK.yellow, ...halftone("rgba(0,0,0,0.12)", 6) }}>
              <tr>
                <th className={`px-4 py-3 ${display} text-xl font-normal md:px-5`}>Title</th>
                <th className={`hidden px-4 py-3 ${display} text-xl font-normal sm:table-cell md:px-5`}>Type</th>
                <th className={`px-4 py-3 ${display} text-xl font-normal md:px-5`}>Link</th>
              </tr>
            </thead>
            <tbody>
              {allSections.map((section, i) => (
                <tr key={section.href} className="border-t-2 border-black transition-colors hover:bg-[#FFF4DC] motion-reduce:transition-none">
                  <td className="px-4 py-4 md:px-5">
                    <Link
                      href={section.href}
                      className={`${titleFont(section.title)} underline decoration-transparent decoration-[3px] underline-offset-4 transition-colors hover:decoration-[#A855F7]`}
                    >
                      {section.title}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-4 sm:table-cell md:px-5">
                    <Sticker color={typeInk[section.type]} className={`px-2.5 text-xs uppercase tracking-wider ${i % 2 ? "rotate-2" : "-rotate-2"}`}>
                      {section.type}
                    </Sticker>
                  </td>
                  <td className="px-4 py-4 md:px-5">
                    <Link href={section.href} className={buttonClass("sm", "whitespace-nowrap bg-[#FFD400]")}>
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </main>
  )
}
