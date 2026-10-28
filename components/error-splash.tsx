import type { ReactNode } from "react"
import { Burst, Caption, INK, display, lettering } from "@/components/comic"

/** The full-page splash shared by the 404 and error pages: a sound effect, a caption, a lettered headline. */
export function ErrorSplash({
  sound,
  caption,
  title,
  children,
}: {
  sound: string
  caption: string
  title: string
  children: ReactNode
}) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <Burst
        text={sound}
        color={INK.yellow}
        className="w-44 animate-in zoom-in-50 spin-in-12 duration-500 motion-reduce:animate-none md:w-56"
      />
      <Caption className="mt-6 -rotate-2">{caption}</Caption>
      <h1 className={`${display} mt-5 -rotate-1 text-5xl leading-none md:text-7xl`} style={{ ...lettering(2.5, 5), color: INK.cyan }}>
        {title}
      </h1>
      {children}
    </main>
  )
}
