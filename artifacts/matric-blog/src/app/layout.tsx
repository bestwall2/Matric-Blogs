import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "@/index.css";
import { Providers } from "./providers";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "ماتريكبلوغ — أخبار كرة القدم والتقنية",
  description: "ماتريكبلوغ — موقعك المتخصص في أخبار كرة القدم والبث المباشر والتقنية باللغة العربية.",
  robots: "index, follow",
  openGraph: {
    title: "ماتريكبلوغ",
    description: "ماتريكبلوغ — موقعك المتخصص في أخبار كرة القدم والبث المباشر والتقنية.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ماتريكبلوغ",
    description: "ماتريكبلوغ — أخبار كرة القدم والتقنية.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${cairo.variable} font-sans antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "name": "ماتريكبلوغ",
                "url": "https://matric-blogs-26.vercel.app",
                "logo": "https://matric-blogs-26.vercel.app/logo.png",
                "sameAs": [
                  "https://twitter.com/MatricBlog"
                ]
              },
              {
                "@type": "WebSite",
                "name": "ماتريكبلوغ",
                "url": "https://matric-blogs-26.vercel.app",
                "description": "موقعك المتخصص في أخبار كرة القدم والبث المباشر والتقنية باللغة العربية.",
                "inLanguage": "ar",
                "publisher": {
                  "@type": "Organization",
                  "name": "ماتريكبلوغ"
                }
              }
            ]
          })
        }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
