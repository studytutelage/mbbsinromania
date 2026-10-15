import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { APP_YEAR, ADMISSION_YEAR } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mbbsinromania.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "MBBS in Romania";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Study MBBS in Romania ${APP_YEAR}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    `Explore medical programs in Romania. Compare current university information and verify admission, recognition, and licensing requirements for ${ADMISSION_YEAR}.`,
  keywords: "medical programs Romania, medical universities Romania, study medicine Romania, Romania university admissions",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Study MBBS in Romania ${APP_YEAR}`,
    description: "Explore medical programs in Romania and verify current admission and recognition requirements.",
    images: [
      {
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Study MBBS in Romania ${APP_YEAR}`,
    description: "Explore medical programs in Romania and verify current admission and recognition requirements.",
    images: [`${SITE_URL}/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

import { auth } from "@/lib/auth";
import Script from "next/script";
import CookieConsent from "@/components/common/CookieConsent";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T4ZDHCD');`,
          }}
        />
      </head>
      <body className="min-h-screen bg-white text-gray-900 antialiased font-sans overflow-x-hidden" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T4ZDHCD"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Providers session={session}>
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
