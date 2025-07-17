import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	transpilePackages: [
		'@workspace/ui',
		'@workspace/core',
		'@workspace/db',
		'@workspace/auth',
	],
	images: {
		remotePatterns: [new URL('https://s3.us-east-005.backblazeb2.com/**')],
	},
};

export default nextConfig;
