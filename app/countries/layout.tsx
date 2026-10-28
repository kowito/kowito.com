import type { Metadata } from "next";
import { bangers, comicNeue } from "./fonts";

export const metadata: Metadata = {
  title: "Countries",
  description: "A spinning globe of the countries I've visited and the ones still on the list, with every route from Bangkok.",
  alternates: {
    canonical: "/countries",
  },
};

export default function CountriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${bangers.variable} ${comicNeue.variable}`}>{children}</div>;
}
