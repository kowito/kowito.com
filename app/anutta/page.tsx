import Link from "next/link"
import { readdirSync } from "fs"
import { join } from "path"

const CONTENT_DIR = join(process.cwd(), "app/anutta/content")

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
    <main className="min-h-[100dvh] bg-[#FAF8F5] px-6 py-10 md:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-[#1E1A17] md:text-5xl">Anutta</h1>
        <p className="mt-3 text-base text-[#6B5F55] md:text-lg">Table of contents</p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-[#E8E2DA] bg-white shadow-sm">
          <table className="w-full table-auto text-left">
            <thead className="bg-[#F7F2EC]">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold text-[#6B5F55]">Title</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#6B5F55] hidden sm:table-cell">Type</th>
                <th className="px-5 py-4 text-sm font-semibold text-[#6B5F55]">Link</th>
              </tr>
            </thead>
            <tbody>
              {allSections.map((section) => (
                <tr key={section.href} className="border-t border-[#EFEAE3] hover:bg-[#FDFBF8] transition-colors">
                  <td className="px-5 py-4 font-medium text-[#1E1A17]">
                    <Link href={section.href} className="hover:text-[#D4715A] transition-colors">
                      {section.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      section.type === "post"
                        ? "bg-[#F0F8F9] text-[#2A7A87] border border-[#B8DDE3]"
                        : "bg-[#F2F3FC] text-[#4A57B0] border border-[#C5CAF0]"
                    }`}>
                      {section.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={section.href}
                      className="inline-flex rounded-full border border-[#D7B882] bg-[#FFF4DF] px-3 py-1 text-sm font-semibold text-[#7A5A1E] hover:bg-[#FEECC9] transition-colors"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
