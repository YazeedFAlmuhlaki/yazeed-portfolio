import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yazeed Almuhlaki — Data Engineer",
  description: "Data engineer in Riyadh building pipelines that move national-scale Saudi data from raw to serving. SQL, Python, AWS, PostgreSQL, DuckDB.",
  keywords: "Data Engineering, Data Pipelines, ETL, ELT, SQL, Python, AWS, Azure, PostgreSQL, PostGIS, DuckDB, Parquet, Data Modeling, Data Quality, Geospatial Data Engineering, Saudi Arabia, Vision 2030",
  authors: [{ name: "Yazeed Almuhlaki" }],
  openGraph: {
    title: "Yazeed Almuhlaki — Data Engineer",
    description: "Pipelines, data modeling, and quality gates for national-scale Saudi data.",
    url: "https://almuhlaki.dev",
    siteName: "Yazeed Almuhlaki",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yazeed Almuhlaki — Data Engineer",
    description: "Pipelines, data modeling, and quality gates for national-scale Saudi data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}