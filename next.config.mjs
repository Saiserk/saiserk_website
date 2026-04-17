/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['undici', 'firebase', '@firebase/auth'],
  },
};

export default nextConfig;
