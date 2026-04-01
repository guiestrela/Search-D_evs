import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Developer Search",
  description: "GitHub profile search using Next.js, Chakra UI v2, i18next, and Zod",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${nunito.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
