module.exports = {
  compress: false,
  experimental: {
    appDir: true,
  },
  reactStrictMode: process.env.NODE_ENV === "production",
};
