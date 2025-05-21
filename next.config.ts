/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cryptologos.cc",
      "lh3.googleusercontent.com"
    ],
  },

  async rewrites() {
    return [
      {

        source: '/:path*',
        has: [
          {
            type: 'host',
            value: '(?<username>[^.]+)\.cofounds\.in',
          },
        ],
        destination: '/portfolio/:username/:path*',
      },

      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;
