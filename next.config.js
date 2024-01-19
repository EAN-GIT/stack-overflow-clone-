/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   domains: ["example.com"],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*'
      }, 
      {
        protocol: 'http',
        hostname: '*'
      }, 
    ]
  }
  // Other configurations
};

module.exports = nextConfig;
