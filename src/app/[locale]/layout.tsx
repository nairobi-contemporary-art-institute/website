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
import { GridInspector } from '@/components/ui/Grid/GridInspector';
import { EntranceAnimation } from '@/components/ui/EntranceAnimation/EntranceAnimation';


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

import { getLocalizedValueAsString } from '@/sanity/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const settings = await sanityFetch<any>({ 
    query: SITE_SETTINGS_QUERY, 
    tags: ['siteSettings'],
    revalidate: 60 // Cache for 1 minute
  });

  const siteTitle = getLocalizedValueAsString(settings?.siteTitle, locale) || 'Nairobi Contemporary Art Institute (NCAI)';
  const siteDescription = getLocalizedValueAsString(settings?.siteDescription, locale) || "A non-profit visual arts space based in Nairobi, dedicated to the growth and preservation of contemporary art in East Africa.";

  return {
    title: {
      template: `%s | ${siteTitle}`,
      default: siteTitle,
    },
    description: siteDescription,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ncai.art'),
    openGraph: {
      type: 'website',
      siteName: siteTitle,
      locale: locale === 'sw' ? 'sw_KE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ncainairobi',
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: [
        { url: '/icon.png', type: 'image/png' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/icon.png',
    }
  };
}

import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { AnalyticsProvider } from '@/components/layout/AnalyticsProvider';
import { ConditionalWrapper } from '@/components/layout/ConditionalWrapper';

import { sanityFetch } from '@/sanity/lib/client';
import { SITE_SETTINGS_QUERY } from '@/sanity/lib/queries';

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

  // Fetch entrance animation backgrounds
  const settings = await sanityFetch<{
    entranceAnimationPool?: { 
      alt: string; 
      caption?: string; 
      asset?: { url: string } 
    }[];
  }>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'], revalidate: 0 });

  const fullPool = settings?.entranceAnimationPool
    ?.filter(img => img?.asset?.url) || [];

  // Map the full pool to the required format
  const entranceAnimImages = fullPool.map(img => ({
    url: img.asset!.url,
    alt: img.alt || "NCAI Entrance Animation Backdrop",
  }));

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={fontClasses} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <AnalyticsProvider>
            <AccessibilityProvider>
              <GridInspector />
              <EntranceAnimation backgroundImages={entranceAnimImages} />
              <ConditionalWrapper
                header={<Header locale={locale} />}
                footer={<Footer locale={locale} />}
              >
                {children}
              </ConditionalWrapper>
            </AccessibilityProvider>
          </AnalyticsProvider>
        </NextIntlClientProvider>

      </body>
    </html>
  );
}
