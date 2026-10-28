import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "@/components/site-footer";
import { BookOpen, ExternalLink, Library, type LucideIcon } from "lucide-react";
import {
  INK,
  PageTitle,
  Panel,
  SectionTitle,
  SiteHeader,
  buttonClass,
  display,
  halftone,
  hardShadow,
  ink,
  lettering,
  lift,
  tilts,
} from "@/components/comic";
import { CountUp, Reveal } from "@/components/comic-motion";
import { books, type Book, type Shelf } from "./data";

export const metadata: Metadata = {
  title: "Books",
  description: "The books on my shelf: business, behavioral economics, psychology, history, and a few classics.",
  alternates: {
    canonical: "/books",
  },
};

type ShelfStyle = {
  name: Shelf;
  id: string;
  /** The shelf's ink, shared by its spines, its jump chip and its section title. */
  color: string;
  /** Red and purple take white lettering; the lighter inks take black. */
  light?: boolean;
};

const shelves: ShelfStyle[] = [
  { name: "Life & Mind", id: "life-mind", color: INK.red, light: true },
  { name: "Business & Work", id: "business-work", color: INK.cyan },
  { name: "Economics & Behavior", id: "economics-behavior", color: INK.green },
  { name: "Money & Markets", id: "money-markets", color: INK.yellow },
  { name: "History & Fiction", id: "history-fiction", color: INK.purple, light: true },
];

const styleOf = (shelf: Shelf) => shelves.find((s) => s.name === shelf)!;

/** Short label for a spine: drop the subtitle and any parenthetical. */
const spineLabel = (book: Book) => book.title.replace(/\s*\(.*\)$/, "").split(":")[0];

/** Bangers has no Thai glyphs, so Thai text is set in the body font instead. */
const isThai = (text: string) => /[฀-๿]/.test(text);

/** Deterministic "random" spine size so the shelf looks lived-in but renders the same every build. */
const spineSize = (book: Book) => ({
  height: 150 + ((book.id * 7919) % 47),
  width: 24 + ((book.id * 131) % 9),
});

function Spine({ book, index }: { book: Book; index: number }) {
  const shelf = styleOf(book.shelf);
  const label = spineLabel(book);
  // Every other spine is printed with dots, so two books from the same shelf never blur into one.
  const dotted = index % 2 === 1;
  return (
    <a
      href={`#book-${book.id}`}
      title={`${book.title} — ${book.author}`}
      aria-label={`${book.title} by ${book.author}`}
      style={{
        ...spineSize(book),
        backgroundColor: shelf.color,
        ...(dotted ? halftone("rgba(0,0,0,0.2)", 5) : null),
        animationDelay: `${index * 25}ms`,
      }}
      className="relative flex shrink-0 origin-bottom justify-center overflow-hidden border-[2.5px] border-black pb-7 pt-5 transition-transform duration-200 animate-in fade-in zoom-in-50 fill-mode-backwards hover:z-10 hover:-translate-y-2 hover:-rotate-2 focus-visible:z-10 focus-visible:-translate-y-2 active:translate-y-0 motion-reduce:animate-none motion-reduce:transition-none"
    >
      <span aria-hidden className="absolute inset-x-0 top-2 h-[3px] bg-black" />
      <span
        lang={isThai(label) ? "th" : undefined}
        className={`truncate leading-none [writing-mode:vertical-rl] ${shelf.light ? "text-white" : "text-black"} ${
          isThai(label) ? "font-sans text-[11px] font-bold" : `${display} text-[13px]`
        }`}
      >
        {label}
      </span>
      <span aria-hidden className="absolute inset-x-0 bottom-3 h-[3px] bg-black" />
    </a>
  );
}

/** The real cover when we have one, otherwise a lettered stand-in in the shelf's ink. */
function Cover({ book }: { book: Book }) {
  if (book.cover) {
    return (
      <Image
        src={book.cover}
        alt={`Cover of ${book.thaiTitle ?? book.title}`}
        width={400}
        height={600}
        className="h-full w-full object-cover"
      />
    );
  }
  const shelf = styleOf(book.shelf);
  const thai = isThai(book.title);
  return (
    <div
      className={`flex h-full w-full flex-col justify-between p-3 pl-4 ${shelf.light ? "text-white" : "text-black"}`}
      style={{ backgroundColor: shelf.color, ...halftone("rgba(0,0,0,0.16)", 6) }}
    >
      <span
        lang={thai ? "th" : undefined}
        className={`line-clamp-6 leading-snug ${thai ? "text-sm font-bold" : `${display} text-xl`}`}
        style={shelf.light && !thai ? lettering(1.5, 2) : undefined}
      >
        {book.title}
      </span>
      <span className="text-[11px] font-bold leading-snug">{book.author}</span>
    </div>
  );
}

function BookCard({ book, index }: { book: Book; index: number }) {
  // Jumping here from the shelf rings the cover in purple and gives it a wiggle.
  const frame = `relative block aspect-[2/3] overflow-hidden bg-white ${ink} ${hardShadow} ${tilts[index % tilts.length]} group-target:outline group-target:outline-4 group-target:outline-offset-4 group-target:outline-[#A855F7] motion-safe:group-target:animate-wiggle`;
  const cover = (
    <>
      <Cover book={book} />
      {/* The hinge where the cover bends. */}
      <span aria-hidden className="absolute inset-y-0 left-2 w-0.5 bg-black/25" />
    </>
  );
  const thai = isThai(book.title);
  return (
    <article id={`book-${book.id}`} className="group scroll-mt-20">
      {book.link ? (
        <a
          href={book.link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${book.title} on ${book.link.store}`}
          className={`${frame} ${lift}`}
        >
          {cover}
        </a>
      ) : (
        <div className={frame}>{cover}</div>
      )}
      <h3
        lang={thai ? "th" : undefined}
        className={`mt-4 leading-tight text-black ${thai ? "font-sans text-base font-bold tracking-normal" : "text-xl"}`}
      >
        {book.title}
      </h3>
      {book.thaiTitle && (
        <p lang="th" className="mt-1 text-sm leading-snug text-black/70">
          {book.thaiTitle}
        </p>
      )}
      <p className="mt-1.5 text-sm font-bold">{book.author}</p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
        <span className="text-xs leading-snug text-black/60">{book.genre}</span>
        {book.link && (
          <a
            href={book.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 border-2 border-black bg-white px-1.5 py-0.5 text-[11px] font-bold leading-snug text-black shadow-[2px_2px_0_0_#000] transition-[transform,box-shadow,background-color] duration-150 hover:-translate-y-0.5 hover:bg-[#FFD400] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none motion-reduce:transition-none"
          >
            {book.link.store}
            <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
          </a>
        )}
      </div>
    </article>
  );
}

function Stat({ value, label, icon: Icon, color, className = "" }: { value: number; label: string; icon: LucideIcon; color: string; className?: string }) {
  return (
    <div className={`min-w-[7.5rem] px-3 py-2 text-black ${ink} ${hardShadow} ${className}`} style={{ backgroundColor: color, ...halftone("rgba(0,0,0,0.14)", 6) }}>
      <p className={`${display} text-4xl leading-none tabular-nums`}>
        <CountUp value={value} />
      </p>
      <p className="mt-1 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
        {label}
      </p>
    </div>
  );
}

export default function BooksPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <SiteHeader className="max-w-5xl" />

      <main className="container mx-auto max-w-5xl flex-1 px-4 pb-20">
        <PageTitle
          kicker={
            <span className="inline-flex items-center gap-1.5">
              <Library className="h-3.5 w-3.5" strokeWidth={2.5} />
              Bookshelf
            </span>
          }
          title="Books"
          color={INK.orange}
        >
          <p className="max-w-xl text-base leading-relaxed">
            Everything on my shelf, in the order it sits. Mostly business, behavioral economics, and books promising
            to fix my habits&mdash;results pending.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Stat value={books.length} label="books" icon={BookOpen} color={INK.pink} className="-rotate-1" />
            <Stat value={shelves.length} label="shelves" icon={Library} color={INK.cyan} className="rotate-1" />
          </div>
        </PageTitle>

        {/* The shelf */}
        <Panel className="mt-12 px-4 pb-6 pt-5 sm:px-6">
          {/* The scroller holds some headroom so a lifted spine and its focus ring aren't cut off. */}
          <div className="-mx-4 overflow-x-auto px-4 pt-4 sm:-mx-6 sm:px-6">
            <div className="mx-auto w-max">
              <div className="flex items-end gap-[3px] px-3">
                {books.map((book, i) => (
                  <Spine key={book.id} book={book} index={i} />
                ))}
              </div>
              {/* The plank, with its shadow printed in dots. */}
              <div className="h-3 bg-black" />
              <div aria-hidden className="mx-3 h-3" style={halftone("rgba(0,0,0,0.45)", 4)} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {shelves.map((shelf, i) => (
              <a
                key={shelf.id}
                href={`#${shelf.id}`}
                className={buttonClass("sm", `px-2.5 text-base sm:px-3 sm:text-lg ${tilts[i % tilts.length]} ${shelf.light ? "text-white" : ""}`)}
                style={{ backgroundColor: shelf.color }}
              >
                {shelf.name}
                <span className="ml-0.5 border-2 border-black bg-white px-1 font-sans text-xs font-bold leading-tight text-black">
                  {books.filter((b) => b.shelf === shelf.name).length}
                </span>
              </a>
            ))}
            <p className="w-full pt-1 text-xs font-bold text-black/60 sm:ml-auto sm:w-auto sm:pt-0">
              Tap a spine to jump to the book.
            </p>
          </div>
        </Panel>

        {/* Books by shelf */}
        <div className="mt-20 space-y-20">
          {shelves.map((shelf) => {
            const shelfBooks = books.filter((b) => b.shelf === shelf.name);
            return (
              <section key={shelf.id} id={shelf.id} className="scroll-mt-6 space-y-8">
                <Reveal>
                  <SectionTitle title={shelf.name} sub={`${shelfBooks.length} books`} color={shelf.color} />
                </Reveal>
                <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
                  {shelfBooks.map((book, i) => (
                    <Reveal key={book.id} delay={(i % 5) * 60}>
                      <BookCard book={book} index={i} />
                    </Reveal>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <SiteFooter className="max-w-5xl px-4" />
    </div>
  );
}
