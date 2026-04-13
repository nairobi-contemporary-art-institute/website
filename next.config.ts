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
    ];
  },
};

export default withNextIntl(nextConfig);
