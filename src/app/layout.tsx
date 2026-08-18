import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import MobileActionBar from "@/components/layout/MobileActionBar";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { siteInfo, contact } from "@/lib/data/site";
import { defaultSeo, defaultOgImage } from "@/lib/data/seo";

// Premium industrial-editorial pairing: Manrope for display/headings
// (cleaner, less condensed than the previous Space Grotesk/Sora combo),
// Inter for body copy. Both self-hosted at build time via next/font —
// no runtime Google Fonts request.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteInfo.url),
  title: {
    default: defaultSeo.homeTitle,
    template: defaultSeo.titleTemplate,
  },
  description: defaultSeo.homeDescription,
  keywords: [...defaultSeo.keywords],
  openGraph: {
    type: "website",
    locale: siteInfo.locale,
    url: siteInfo.url,
    siteName: siteInfo.name,
    title: defaultSeo.homeTitle,
    description: defaultSeo.homeDescription,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.homeTitle,
    description: defaultSeo.homeDescription,
    images: [defaultOgImage.url],
  },
  alternates: {
    canonical: "/",
  },
};

// LocalBusiness stays the single source-of-truth entity — areaServed
// here reflects the physical/local business scope (Kollam, Kerala).
// Individual Service schemas (services/[slug], sealing-solutions) link
// back to this same entity via @id rather than duplicating a bare
// LocalBusiness object, and set their own areaServed to reflect that
// services are marketed to customers across Kerala.
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteInfo.url}/#organization`,
  name: siteInfo.name,
  image: defaultOgImage.url,
  url: siteInfo.url,
  telephone: contact.phone,
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${contact.address.line2}, ${contact.address.line3}`,
    addressLocality: contact.address.city,
    addressRegion: contact.address.state,
    addressCountry: "IN",
  },
  parentOrganization: {
    "@type": "Organization",
    name: siteInfo.group,
  },
  areaServed: "Kollam, Kerala, India",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteInfo.url}/#website`,
  name: siteInfo.name,
  url: siteInfo.url,
  publisher: { "@id": `${siteInfo.url}/#organization` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-warm text-black">
        <SmoothScrollProvider>
          <CustomCursor />
          <Header />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <MobileActionBar />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
