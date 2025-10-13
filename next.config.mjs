/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',   // OJO: esto NO es 'export'
  // output: 'export',
  // distDir: 'out',
  images: { unoptimized: true },
}

export default nextConfig