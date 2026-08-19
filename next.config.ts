import type { NextConfig } from 'next';

const config: NextConfig = {
  // The wiki loader reads Markdown files through fs at runtime. Include them
  // in Vercel's serverless function traces so deployed wiki routes can resolve
  // the same content that is available in the repository.
  outputFileTracingIncludes: {
    '/*': [
      './content/*.md',
      './content-internal/*.md',
    ],
  },
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }];
  },
};

export default config;
