import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Using Inter for a clean, modern, technological look
const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black`}>
        {children}
      </body>
    </html>
  );
}
