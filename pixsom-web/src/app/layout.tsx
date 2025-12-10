import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

// Using Inter for body copy
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Using Outfit for catchy headlines
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Pixsom | Studio Créatif & Technologique",
  description: "Pixsom est un studio créatif & technologique qui conçoit des expériences digitales, des contenus vidéos et des solutions sur mesure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
