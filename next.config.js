/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  experimental: {
    serverActions: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jtfnygkfjjmyhcugldts.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/images/**'
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com'
      }
    ]
  }
}
