import type { Metadata } from "next";
import { Sora, IBM_Plex_Sans, Space_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import BrutalistProgressBar from "@/components/BrutalistProgressBar";
import MobileBottomNav from "@/components/MobileBottomNav";
import NewFooter from "@/components/NewFooter";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PC Wala Online — Premium Computer Hardware in Pakistan",
    template: "%s | PC Wala Online",
  },
  description: "Karachi's ultimate hub for customized desktop gaming computers, workstation rigs, high-end graphic cards, processors, accessories & premium laptops.",
  keywords: ["PC Wala", "PC Wala Online", "Gaming PC Pakistan", "Graphics Cards Karachi", "Computer Parts Pakistan", "Laptops Pakistan"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${ibmPlexSans.variable} ${spaceMono.variable}`}>
      <head>
        {/* Meta Pixel Code via next/script */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script
            id="meta-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${process.env.NEXT_PUBLIC_META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt="pixel"
            />
          </noscript>
        )}
        <AnnouncementBar />
        <Header />
        <Suspense fallback={null}>
          <BrutalistProgressBar />
        </Suspense>
        <main style={{ flexGrow: 1 }}>{children}</main>
        <MobileBottomNav />
        <NewFooter />
      </body>
    </html>
  );
}
