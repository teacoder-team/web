import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	output: "standalone",
	images: {
		formats: ["image/avif", "image/webp"],
		minimumCacheTTL: 60,
	},
};

export default nextConfig;
