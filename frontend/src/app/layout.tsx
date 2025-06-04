// frontend/src/app/layout.tsx

import "../styles/globals.css";
import { Roboto } from "next/font/google";
import Navbar from "./_components/NavBar";
import Footer from "./_components/Footer";
import Providers from "./providers";
import AuthReset from "./_components/AuthReset";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "ScrapeSmith",
  description: "Your one-stop solution for web data extraction, cleaning, and analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.className} min-h-screen flex flex-col text-white`}
        style={{ backgroundColor: "rgb(107, 107, 110)" }}
      >
        <Providers>
          <AuthReset />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
