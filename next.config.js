const ContentSecurityPolicy = `
  default-src 'self';
  connect-src 'self' ws: tetribass.com *.tetribass.com ;
  img-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval'
`;

module.exports = {
  compress: false,
  poweredByHeader: false,
  reactStrictMode: process.env.NODE_ENV === "production",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), geolocation=(), microphone=()",
          },
          {
            key: "Server",
            value: "tetribass",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};
