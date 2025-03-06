/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nevgpxugqzrhwemechsj.supabase.co', // 🔹 Sesuaikan dengan URL Supabase-mu
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
