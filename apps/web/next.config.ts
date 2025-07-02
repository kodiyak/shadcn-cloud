import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	transpilePackages: [
		'@workspace/ui',
		'@workspace/core',
		'@workspace/db',
		'@workspace/auth',
		'@modbox/core',
		'@modbox/plugins',
		'@modbox/utils',
	],
	images: {
		remotePatterns: [new URL('https://s3.us-east-005.backblazeb2.com/**')],
	},
	experimental: {
		reactCompiler: false,
	},
};

export default nextConfig;
