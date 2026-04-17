/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['firebase', '@firebase/auth', '@firebase/app', 'undici'],
};

export default nextConfig;
