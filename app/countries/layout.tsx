import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Countries — Kowito",
  description: "30 countries I want to visit. Each one is a story waiting to be lived.",
};

export default function CountriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
