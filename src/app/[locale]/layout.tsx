import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Noto_Sans_Arabic, Noto_Sans_Devanagari, Noto_Sans_Ethiopic } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, Locale } from '@/i18n';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  display: "swap",
});

const notoHindi = Noto_Sans_Devanagari({
  variable: "--font-noto-hindi",
  subsets: ["devanagari"],
  display: "swap",
});

const notoEthiopic = Noto_Sans_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: '%s | Nairobi Contemporary Art Institute (NCAI)',
    default: 'Nairobi Contemporary Art Institute (NCAI)',
  },
  description: "A non-profit visual arts space based in Nairobi, dedicated to the growth and preservation of contemporary art in East Africa.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ncai.art'),
  openGraph: {
    type: 'website',
    siteName: 'NCAI',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ncainairobi',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;


  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  const messages = await getMessages();

  // Multi-script Logic
  const isRtl = locale === 'ar';

  // Decide which font classes to apply
  const fontClasses = [
    GeistSans.variable,
    GeistMono.variable,
    notoArabic.variable,
    notoHindi.variable,
    notoEthiopic.variable
  ].join(' ');

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={fontClasses} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1 pt-12 md:pt-20">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
