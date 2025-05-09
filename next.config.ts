/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cryptologos.cc",
      "lh3.googleusercontent.com",
    ],
  },
  // Add this rewrites section for subdomain handling
  async rewrites() {
    return [
      {
        // This handles username.cofounds.in routing
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<username>[^.]+)\.cofounds\.in',
          },
        ],
        destination: '/portfolio/:username/:path*',
      },
    ];
  },
};

export default nextConfig;
