import { Bangers, Comic_Neue } from "next/font/google";

/** Comic lettering for headlines, and a friendly hand for body text. Countries page only. */
export const bangers = Bangers({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-bangers" });

export const comicNeue = Comic_Neue({ subsets: ["latin"], weight: ["400", "700"], display: "swap", variable: "--font-comic" });
