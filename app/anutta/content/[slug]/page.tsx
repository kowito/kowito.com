import { notFound } from "next/navigation"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ChevronLeft } from "lucide-react"

const CONTENT_DIR = join(process.cwd(), "app/anutta/content")

export async function generateStaticParams() {
  const files = readdirSync(CONTENT_DIR).filter(
    (f) => !f.startsWith(".") && !f.startsWith("[")
  )
  return files.map((f) => ({ slug: f }))
}

function slugToTitle(slug: string) {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

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

  const title = slugToTitle(slug)

  return (
    <main className="min-h-[100dvh] bg-[#FAF8F5] px-5 py-10 md:px-10">
      <div className="mx-auto w-full max-w-3xl">
        {/* Back link */}
        <Link
          href="/anutta"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-[#9B8E84] hover:text-[#5C5046] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Anutta
        </Link>

        {/* Article */}
        <article className="prose prose-stone max-w-none prose-headings:font-display prose-h1:text-3xl prose-h1:font-bold prose-h1:text-[#1E1A17] prose-h2:text-xl prose-h2:font-semibold prose-h2:text-[#1E1A17] prose-h3:text-base prose-h3:font-semibold prose-h3:text-[#1E1A17] prose-p:text-[#4A3F37] prose-p:leading-relaxed prose-a:text-[#D4715A] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#1E1A17] prose-li:text-[#4A3F37] prose-code:text-[#D4715A] prose-code:bg-[#FDF3F0] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-normal prose-pre:bg-[#1E1A17] prose-pre:text-[#F5F0EB] prose-blockquote:border-l-[#D4715A] prose-blockquote:text-[#7B6D62] prose-table:text-sm prose-th:text-[#1E1A17] prose-hr:border-[#E8E2DA]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>

        {/* Footer back link */}
        <div className="mt-12 border-t border-[#E8E2DA] pt-6">
          <Link
            href="/anutta"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7A5A1E] bg-[#FFF4DF] border border-[#D7B882] px-4 py-2 rounded-full hover:bg-[#FEECC9] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to all posts
          </Link>
        </div>
      </div>
    </main>
  )
}
