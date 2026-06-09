import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://andyhsu10.github.io"),
  title: "An-Ting (Andy) Hsu — Software Engineer",
  description:
    "Taipei-based software engineer building full-stack products, developer tools, and distributed systems.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "An-Ting (Andy) Hsu — Software Engineer",
    description: "Full-stack products, developer tools, and distributed systems. Taipei-based.",
    images: ["/og.svg"],
    type: "website",
  },
};

const noFlash = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
