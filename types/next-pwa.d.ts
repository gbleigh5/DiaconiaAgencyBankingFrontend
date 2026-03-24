declare module 'next-pwa' {
  import type { NextConfig } from 'next';
  interface PwaOptions {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    [key: string]: unknown;
  }
  function withPWA(options: PwaOptions): (config: NextConfig) => NextConfig;
  export = withPWA;
}
