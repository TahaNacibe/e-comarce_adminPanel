import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [{
      hostname: "lh3.googleusercontent.com",
    }, {
      hostname:"example.com"
      },
     {
      hostname:"res.cloudinary.com"
      },
    
    ],
  }
};

export default nextConfig;
