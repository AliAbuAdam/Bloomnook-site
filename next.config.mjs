/** @type {import('next').NextConfig} */
  const basePath = process.env.PAGES_BASE_PATH || "";
  const nextConfig = {
    reactStrictMode: true,
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
    basePath,
    assetPrefix: basePath ? basePath + "/" : undefined,
  };
  export default nextConfig;