import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, ExternalLink, Library } from "lucide-react";
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
  dot: string;
  /** Two spine shades so neighbouring books on the same shelf don't blur together. */
  spine: [string, string];
  cover: string;
};

const shelves: ShelfStyle[] = [
  {
    name: "Life & Mind",
    id: "life-mind",
    dot: "bg-rose-400",
    spine: ["from-rose-500 to-rose-700", "from-rose-600 to-rose-800"],
    cover: "from-rose-500 to-rose-800",
  },
  {
    name: "Business & Work",
    id: "business-work",
    dot: "bg-blue-400",
    spine: ["from-blue-500 to-blue-700", "from-blue-600 to-blue-800"],
    cover: "from-blue-500 to-blue-800",
  },
  {
    name: "Economics & Behavior",
    id: "economics-behavior",
    dot: "bg-emerald-400",
    spine: ["from-emerald-500 to-emerald-700", "from-emerald-600 to-emerald-800"],
    cover: "from-emerald-500 to-emerald-800",
  },
  {
    name: "Money & Markets",
    id: "money-markets",
    dot: "bg-amber-400",
    spine: ["from-amber-500 to-amber-700", "from-amber-600 to-amber-800"],
    cover: "from-amber-500 to-amber-800",
  },
  {
    name: "History & Fiction",
    id: "history-fiction",
    dot: "bg-violet-400",
    spine: ["from-violet-500 to-violet-700", "from-violet-600 to-violet-800"],
    cover: "from-violet-500 to-violet-800",
  },
];

const styleOf = (shelf: Shelf) => shelves.find((s) => s.name === shelf)!;

/** Short label for a spine: drop the subtitle and any parenthetical. */
const spineLabel = (book: Book) => book.title.replace(/\s*\(.*\)$/, "").split(":")[0];

/** Deterministic "random" spine size so the shelf looks lived-in but renders the same every build. */
const spineSize = (book: Book) => ({
  height: 150 + ((book.id * 7919) % 47),
  width: 24 + ((book.id * 131) % 9),
});

function Spine({ book }: { book: Book }) {
  const style = styleOf(book.shelf);
  return (
    <a
      href={`#book-${book.id}`}
      title={`${book.title} — ${book.author}`}
      aria-label={`${book.title} by ${book.author}`}
      style={spineSize(book)}
      className={`relative flex shrink-0 justify-center overflow-hidden rounded-[3px] bg-gradient-to-r ${style.spine[book.id % 2]} pt-5 pb-7 shadow-[inset_-3px_0_0_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-2 focus-visible:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60`}
    >
      <span aria-hidden className="absolute inset-x-0 top-2.5 h-px bg-white/25" />
      <span className="truncate font-display text-[10px] font-medium leading-none tracking-wide text-white/90 [writing-mode:vertical-rl]">
        {spineLabel(book)}
      </span>
      <span aria-hidden className="absolute inset-x-0 bottom-3.5 h-px bg-white/25" />
    </a>
  );
}

/** The real cover when we have one, otherwise a typeset stand-in in the shelf's colour. */
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
  return (
    <div className={`flex h-full w-full flex-col justify-between bg-gradient-to-br ${styleOf(book.shelf).cover} p-3 pl-4`}>
      <span className="line-clamp-6 font-display text-sm font-medium leading-snug text-white/90">{book.title}</span>
      <span className="text-[11px] leading-snug text-white/70">{book.author}</span>
    </div>
  );
}

function BookCard({ book }: { book: Book }) {
  const coverClass =
    "relative block aspect-[2/3] overflow-hidden rounded-md bg-gray-900 shadow-xl shadow-black/50 ring-1 ring-white/10 group-target:ring-2 group-target:ring-white/70";
  const cover = (
    <>
      <Cover book={book} />
      <span aria-hidden className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/30 to-transparent" />
    </>
  );
  return (
    <article id={`book-${book.id}`} className="group scroll-mt-6">
      {book.link ? (
        <a
          href={book.link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${book.title} on ${book.link.store}`}
          className={`${coverClass} transition-transform duration-200 hover:-translate-y-1`}
        >
          {cover}
        </a>
      ) : (
        <div className={coverClass}>{cover}</div>
      )}
      <h3 className="mt-3 text-sm font-medium leading-snug text-white">{book.title}</h3>
      {book.thaiTitle && <p className="mt-0.5 text-xs leading-snug text-gray-400">{book.thaiTitle}</p>}
      <p className="mt-1.5 text-xs text-gray-300">{book.author}</p>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
        <span className="text-[11px] leading-snug text-gray-500">{book.genre}</span>
        {book.link && (
          <a
            href={book.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-[11px] text-gray-400 transition-colors hover:text-white"
          >
            {book.link.store}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}

export default function BooksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 right-0 h-[700px] w-[700px] rounded-full bg-gradient-to-b from-rose-900/20 to-violet-900/20 blur-3xl translate-x-1/3 opacity-50" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-gradient-to-t from-blue-900/20 to-emerald-900/20 blur-3xl -translate-x-1/3 translate-y-1/3 opacity-40" />
      </div>

      {/* Header */}
      <header className="container mx-auto max-w-5xl px-4 py-8 flex items-center justify-between">
        <Link href="/" className="font-display text-lg font-medium tracking-[0.22em] text-white">
          Kowit C.
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      <main className="container mx-auto max-w-5xl px-4 pb-20">

        {/* Page header */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-3">
            <Library className="h-5 w-5 text-gray-400 shrink-0" />
            <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Bookshelf</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight text-white">Books</h1>
          <p className="max-w-xl text-gray-400 leading-relaxed">
            Everything on my shelf, in the order it sits. Mostly business, behavioral economics, and books promising
            to fix my habits&mdash;results pending.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
              <BookOpen className="h-3 w-3" />
              {books.length} books
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300">
              <Library className="h-3 w-3" />
              {shelves.length} shelves
            </span>
          </div>
        </div>

        {/* The shelf */}
        <div className="mb-14 rounded-3xl border border-gray-800 bg-black/30 overflow-hidden">
          <div className="h-[2px] bg-gradient-to-r from-rose-500 via-blue-500 to-violet-500" />
          <div className="px-4 pt-10 pb-6 sm:px-6 space-y-6">
            <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
              <div className="mx-auto w-max">
                <div className="flex items-end gap-[3px] px-3">
                  {books.map((book) => (
                    <Spine key={book.id} book={book} />
                  ))}
                </div>
                <div className="h-2.5 rounded-sm bg-gradient-to-b from-gray-600 to-gray-800" />
                <div className="mx-3 h-3 bg-gradient-to-b from-black/50 to-transparent" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {shelves.map((shelf) => (
                <a
                  key={shelf.id}
                  href={`#${shelf.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-800 bg-gray-900/60 px-3 py-1 text-xs text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
                >
                  <span className={`h-2 w-2 rounded-full ${shelf.dot}`} />
                  {shelf.name}
                  <span className="text-gray-500">{books.filter((b) => b.shelf === shelf.name).length}</span>
                </a>
              ))}
              <p className="w-full pt-1 text-xs text-gray-500 sm:ml-auto sm:w-auto sm:pt-0">
                Tap a spine to jump to the book.
              </p>
            </div>
          </div>
        </div>

        {/* Books by shelf */}
        <div className="space-y-14">
          {shelves.map((shelf) => {
            const shelfBooks = books.filter((b) => b.shelf === shelf.name);
            return (
              <section key={shelf.id} id={shelf.id} className="scroll-mt-6 space-y-5 border-t border-gray-800/60 pt-10">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${shelf.dot}`} />
                    <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white">{shelf.name}</h2>
                  </div>
                  <span className="shrink-0 text-sm text-gray-500">{shelfBooks.length} books</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                  {shelfBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

      </main>
    </div>
  );
}
