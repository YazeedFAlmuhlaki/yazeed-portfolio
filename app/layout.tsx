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
  title: "Yazeed Almuhlaki — Spatial Data Scientist & GeoAI Practitioner",
  description: "Spatial Data Scientist and GeoAI practitioner based in Riyadh. Building predictive systems from location data — groundwater mapping, environmental risk, and Earth observation AI.",
  keywords: "Spatial Data Science, GeoAI, Remote Sensing, Saudi Arabia, Vision 2030, Python, GeoPandas, Google Earth Engine",
  authors: [{ name: "Yazeed Almuhlaki" }],
  openGraph: {
    title: "Yazeed Almuhlaki — Spatial Data Scientist",
    description: "GeoAI projects, Earth observation work, and spatial analytics built for Vision 2030.",
    url: "https://almuhlaki.dev",
    siteName: "Yazeed Almuhlaki Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yazeed Almuhlaki — Spatial Data Scientist",
    description: "GeoAI projects, Earth observation work, and spatial analytics built for Vision 2030.",
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