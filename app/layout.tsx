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
  title: "PC Wala Online — Premium Computer Hardware in Pakistan",
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8GV6J1BE4T"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-8GV6J1BE4T');
            `,
          }}
        />

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
        {/* LocalBusiness / Store Schema for AEO and Local SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ComputerStore",
              "name": "PC Wala Online",
              "image": "https://api.pcwalaonline.com/wp-content/uploads/2026/06/mouse_banner.png",
              "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com"}/#store`,
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcwalaonline.com",
              "telephone": process.env.NEXT_PUBLIC_WA_NUMBER || "+923423355119",
              "foundingDate": "2010",
              "description": "Trusted since 2010. Computer hardware retailer serving retail customers, corporations, media production companies, and software houses across Pakistan. Authentic products, transparent pricing, genuine warranties.",
              "priceRange": "Rs. 1000 - Rs. 1000000",
              "knowsAbout": [
                "Computer Hardware",
                "Gaming PC Components",
                "Graphics Cards",
                "Processors",
                "Motherboards",
                "Corporate IT Solutions",
                "Wholesale Computer Parts",
                "Media Production Hardware",
                "3D Rendering Workstations"
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Store G41, Ground Floor, Regal Trade Square, Regal Chowk, Saddar",
                "addressLocality": "Karachi",
                "postalCode": "74400",
                "addressCountry": "PK"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 24.8608156,
                "longitude": 67.0254546
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ],
                "opens": "11:00",
                "closes": "20:00"
              },
              "sameAs": [
                "https://www.instagram.com/pcwalaonline/",
                "https://www.facebook.com/pcwalaonline/"
              ]
            })
          }}
        />
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
