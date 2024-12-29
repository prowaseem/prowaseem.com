import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  // images: {
  //   unoptimized: true
  // }
  // trailingSlash: true,
  // skipTrailingSlashRedirect: true
  /* config options here */
  // images: {
  //   localPatterns: [{
  //     pathname: '/assets/**',
  //     search: ''
  //   }],
  // }
};

export default nextConfig;
