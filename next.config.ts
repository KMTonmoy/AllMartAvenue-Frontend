/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // optional: if you use Cloudinary
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // optional: for Google images
      },
    ],
  },
};

module.exports = nextConfig;
