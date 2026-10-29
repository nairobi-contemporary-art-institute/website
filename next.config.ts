import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  transpilePackages: ['gsap', '@gsap/react'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'imma.ie',
      },
      {
        protocol: 'https',
        hostname: 'proxy.extractcss.dev',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/support',
        destination: '/get-involved',
        permanent: true,
      },
      {
        source: '/membership',
        destination: '/get-involved',
        permanent: true,
      },
      // Old nav paths (CMS links now point at the real routes; these catch bookmarks).
      ...[
        ['/showing', '/exhibitions#current'],
        ['/upcoming', '/exhibitions#upcoming'],
        ['/archive', '/exhibitions#archive'],
        ['/programme', '/whats-on'],
        ['/careers', '/about/careers'],
        ['/members', '/get-involved'],
        ['/shop', '/publications'],
        ['/venue-hire', '/contact'],
      ].flatMap(([from, to]) => [
        { source: from, destination: to, permanent: false },
        { source: `/:locale(en|sw|ar|hi|de|pt|fr|es|am|so)${from}`, destination: `/:locale${to}`, permanent: false },
      ]),
      { source: '/:locale(en|sw|ar|hi|de|pt|fr|es|am|so)/support', destination: '/:locale/get-involved', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
