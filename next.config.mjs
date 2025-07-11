import withPlaiceholder from "@plaiceholder/next";


const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.syrve.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      }
    ],
  },
  optimizeFonts: true,
  trailingSlash: true,
  poweredByHeader: false,
}

export default withPlaiceholder(nextConfig)
