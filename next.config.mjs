import withPlaiceholder from "@plaiceholder/next";


const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.restiq.ge',
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
