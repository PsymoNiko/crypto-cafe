// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig


const isGithubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? '/crypto-cafe' : '',
  assetPrefix: isGithubPages ? '/crypto-cafe' : '',
  // Optional: Ignore build errors if TypeScript/ESLint are problematic
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;