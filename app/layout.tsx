import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Forecast Earthings Pvt. Ltd. | Earthing & Lightning Protection",
    template: "%s | Forecast Earthings Pvt. Ltd.",
  },
  description:
    "Leading manufacturer & supplier of GI Earthing Electrodes, Copper Bonded Electrodes, Pure Copper Electrodes, ESE Lightning Arresters, and Earth Enhancement Compounds under Make in India. Safety Today. A Safer Tomorrow.",
  keywords: [
    "Forecast Earthings",
    "Earthing Electrode",
    "GI Earthing Electrode",
    "Copper Bonded Electrode",
    "Pure Copper Electrode",
    "ESE Lightning Arrester",
    "Back Fill Earth Compound",
    "Earth Pit Cover",
    "Make in India Earthing",
    "Chalo Banaye Behtar Bharat",
  ],
  authors: [{ name: "Forecast Earthings Pvt. Ltd." }],
  openGraph: {
    title: "Forecast Earthings Pvt. Ltd. | Earthing & Lightning Protection",
    description: "Reliable industrial earthing solutions and lightning protection systems.",
    siteName: "Forecast Earthings Pvt. Ltd.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
