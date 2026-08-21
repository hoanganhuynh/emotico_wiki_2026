import type { NextConfig } from 'next';
import path from 'node:path';

const config: NextConfig = {
  // Keep ad-hoc production builds separate from a running local dev server.
  // This avoids both processes writing temporary manifests into `.next`.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  outputFileTracingRoot: path.join(__dirname),
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
        { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'" },
      ],
    }];
  },
};

export default config;
