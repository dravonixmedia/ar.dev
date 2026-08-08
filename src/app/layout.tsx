import type { Metadata } from "next";
import { Space_Grotesk, Sora, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import MobileActionBar from "@/components/layout/MobileActionBar";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { siteInfo, contact } from "@/lib/data/site";
import { defaultSeo } from "@/lib/data/seo";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.homeTitle,
    description: defaultSeo.homeDescription,
  },
  alternates: {
    canonical: "/",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${siteInfo.url}/#organization`,
  name: siteInfo.name,
  image: `${siteInfo.url}/og-image.jpg`,
  url: siteInfo.url,
  telephone: contact.phone,
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${contact.address.line1}, ${contact.address.line2}, ${contact.address.line3}`,
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${sora.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
