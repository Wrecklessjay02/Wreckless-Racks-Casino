import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Wreckless Racks Casino - Free Social Casino Games",
  description: "Play free slots, blackjack, roulette, and poker at Wreckless Racks Casino. Join tournaments, win big, and experience the thrill of Las Vegas from home! No downloads required.",
  keywords: "free casino games, social casino, slots, blackjack, roulette, poker, tournaments, free coins, online casino, vegas games",
  authors: [{ name: "Wreckless Racks Casino" }],
  openGraph: {
    title: "Wreckless Racks Casino - Free Social Casino Games",
    description: "Experience the ultimate social casino with free slots, table games, and tournaments. Join thousands of players worldwide!",
    url: "https://wrecklessracks.vercel.app",
    siteName: "Wreckless Racks Casino",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wreckless Racks Casino - Free Social Casino Games",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wreckless Racks Casino - Free Social Casino Games",
    description: "Play free casino games and join tournaments at Wreckless Racks Casino!",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://wrecklessracks.vercel.app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#eab308" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}

        {/* Analytics and tracking - Ready for production */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance tracking
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  // Track page load performance
                  const navTiming = performance.getEntriesByType('navigation')[0];
                  if (navTiming) {
                    console.log('Page load time:', navTiming.loadEventEnd - navTiming.loadEventStart);
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
