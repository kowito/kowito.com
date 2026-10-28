import { notFound } from "next/navigation"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"
import { isValidElement, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { ChevronLeft } from "lucide-react"
import { INK, Panel, RED_TEXT, buttonClass, hardShadow, ink, smallShadow } from "@/components/comic"
import { cn } from "@/lib/utils"

const CONTENT_DIR = join(process.cwd(), "app/anutta/content")

export async function generateStaticParams() {
  const files = readdirSync(CONTENT_DIR).filter(
    (f) => !f.startsWith(".") && !f.startsWith("[")
  )
  return files.map((f) => ({ slug: f }))
}

/* ───────────── Comic prose ───────────── */

/** Bangers has no Thai glyphs: a heading with any Thai in it is set in the bold body font instead. */
const THAI = /[฀-๿]/

function plainText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(plainText).join("")
  if (isValidElement<{ children?: ReactNode }>(node)) return plainText(node.props.children)
  return ""
}

/** Each level keeps the same frame whichever font it ends up in, so Latin and Thai headings read as one set. */
const headingStyles = {
  h1: {
    frame: `w-fit max-w-full -rotate-1 bg-[#FFD400] px-3 py-2 ${ink} ${hardShadow}`,
    latin: "text-4xl leading-none md:text-5xl",
    thai: "text-2xl leading-snug md:text-3xl",
  },
  h2: {
    frame: `w-fit max-w-full rotate-[0.5deg] bg-[#4CC9F0] px-3 py-1.5 ${ink} ${smallShadow}`,
    latin: "text-3xl leading-none md:text-4xl",
    thai: "text-xl leading-snug md:text-2xl",
  },
  h3: {
    frame: "border-l-[6px] border-[#FF3B30] pl-3",
    latin: "text-2xl leading-tight md:text-3xl",
    thai: "text-lg leading-snug md:text-xl",
  },
  h4: {
    frame: "",
    latin: "text-xl leading-tight md:text-2xl",
    thai: "text-base leading-snug md:text-lg",
  },
} as const

function heading(Tag: keyof typeof headingStyles) {
  const { frame, latin, thai } = headingStyles[Tag]
  function Heading({ children }: { children?: ReactNode }) {
    const font = THAI.test(plainText(children))
      ? `font-sans font-bold tracking-normal ${thai}`
      : `font-normal [&_strong]:font-normal ${latin}`
    return <Tag className={cn(frame, font)}>{children}</Tag>
  }
  return Heading
}

/** Tables scroll sideways inside their own inked box instead of pushing the page wider on phones. */
function Table({ children }: { children?: ReactNode }) {
  return (
    <div className={`my-8 overflow-x-auto bg-white ${ink} ${smallShadow}`}>
      <table className="my-0 [&_td+td]:border-l-2 [&_td]:min-w-[6.5rem] [&_td]:border-black [&_td]:px-3 [&_td]:py-2.5 [&_th+th]:border-l-2 [&_th]:min-w-[6.5rem] [&_th]:border-black [&_th]:bg-[#FFD400] [&_th]:px-3 [&_th]:py-2.5 [&_th]:font-bold [&_thead]:border-b-[3px] [&_tbody_tr]:border-b-2">
        {children}
      </table>
    </div>
  )
}

const components: Components = {
  h1: heading("h1"),
  h2: heading("h2"),
  h3: heading("h3"),
  h4: heading("h4"),
  table: Table,
}

/** Typography's palette, inked: black text and rules, red list markers, paper-coloured code boxes. */
const proseInk = {
  "--tw-prose-body": "#000",
  "--tw-prose-headings": "#000",
  "--tw-prose-lead": "#000",
  "--tw-prose-links": "#000",
  "--tw-prose-bold": "#000",
  "--tw-prose-counters": RED_TEXT,
  "--tw-prose-bullets": INK.red,
  "--tw-prose-hr": "#000",
  "--tw-prose-quotes": "#000",
  "--tw-prose-quote-borders": "#000",
  "--tw-prose-captions": "rgba(0,0,0,0.7)",
  "--tw-prose-code": "#000",
  "--tw-prose-pre-code": "#000",
  "--tw-prose-pre-bg": INK.paper,
  "--tw-prose-th-borders": "#000",
  "--tw-prose-td-borders": "#000",
} as CSSProperties

const proseComic = [
  "prose max-w-none break-words prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:font-bold",
  // Links: black, bold, with a thick purple underline; yellow highlight on hover.
  "prose-a:font-bold prose-a:decoration-[#A855F7] prose-a:decoration-[3px] prose-a:underline-offset-[3px] hover:prose-a:bg-[#FFD400]",
  // Inline code and code blocks as inked boxes.
  "prose-code:border-2 prose-code:border-black prose-code:bg-[#FFF4DC] prose-code:px-1 prose-code:py-0.5 prose-code:font-bold prose-code:before:content-none prose-code:after:content-none",
  `prose-pre:rounded-none prose-pre:border-[3px] prose-pre:border-black prose-pre:shadow-[4px_4px_0_0_#000] [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:font-normal`,
  // Blockquotes as yellow narration boxes.
  "prose-blockquote:-rotate-[0.5deg] prose-blockquote:border-[3px] prose-blockquote:border-black prose-blockquote:bg-[#FFD400] prose-blockquote:px-4 prose-blockquote:py-0.5 prose-blockquote:font-normal prose-blockquote:not-italic prose-blockquote:shadow-[3px_3px_0_0_#000] prose-blockquote:[quotes:none] [&_blockquote_p]:my-3",
  "prose-hr:my-10 prose-hr:border-t-[3px] prose-hr:border-black prose-img:border-[3px] prose-img:border-black",
].join(" ")

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let content: string
  try {
    content = readFileSync(join(CONTENT_DIR, slug), "utf-8")
  } catch {
    notFound()
  }

  return (
    <main className="min-h-[100dvh] overflow-x-clip px-4 py-8 md:px-10 md:py-12">
      <div className="mx-auto w-full max-w-3xl">
        {/* Back link */}
        <Link href="/anutta" className={buttonClass("sm", "mb-8")}>
          <ChevronLeft className="h-4 w-4" strokeWidth={3} />
          Anutta
        </Link>

        {/* Article */}
        <Panel className="p-5 animate-in fade-in zoom-in-95 duration-500 [animation-timing-function:cubic-bezier(.2,.9,.3,1.4)] motion-reduce:animate-none sm:p-8 md:p-10">
          <article className={proseComic} style={proseInk}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
              {content}
            </ReactMarkdown>
          </article>
        </Panel>

        {/* Footer back link */}
        <div className="mt-12 border-t-[3px] border-black pt-6">
          <Link href="/anutta" className={buttonClass("md", "bg-[#FFD400]")}>
            <ChevronLeft className="h-5 w-5" strokeWidth={3} />
            Back to all posts
          </Link>
        </div>
      </div>
    </main>
  )
}
