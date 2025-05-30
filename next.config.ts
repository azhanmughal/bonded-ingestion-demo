const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // optional, but modern
    appDir: true,        // this line is what matters
  },
};

export default nextConfig;