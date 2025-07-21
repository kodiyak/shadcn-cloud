import { Modpack, type ModpackBootOptions } from '@modpack/core';
import { esmSh, http, inject, resolver } from '@modpack/plugins';
import { react } from '@modpack/react';
import { type SwcOptions, swc } from '@modpack/swc';
import defaultVirtualFiles from '@/lib/cn.json';
import { getModpackInjections } from './get-modpack-injections';

export async function initializeModpack(
	options?: ModpackBootOptions & {
		onParse?: SwcOptions['onParse'];
		onTransform?: SwcOptions['onTransform'];
	},
) {
	const injectModules = getModpackInjections();
	const modpack = await Modpack.boot({
		debug: true,
		...options,
		onBuildEnd: async (props) => {
			await options?.onBuildEnd?.(props);
		},
		onModuleUpdate: async (props) => {
			await options?.onModuleUpdate?.(props);
		},
		plugins: [
			swc({
				onParse: options?.onParse,
				onTransform: options?.onTransform,
				extensions: ['.js', '.ts', '.tsx', '.jsx'],
				contentTypes: ['application/javascript'],
				jsc: {
					target: 'es2022',
					parser: {
						syntax: 'typescript',
						tsx: true,
					},
					transform: {
						legacyDecorator: true,
						decoratorMetadata: true,
						react: {
							development: true,
							refresh: true,
							runtime: 'automatic',
						},
					},
				},
				sourceMaps: true,
				module: {
					type: 'es6',
					strict: false,
					ignoreDynamic: true,
					importInterop: 'swc',
				},
			}),
			http(),
			resolver({
				extensions: ['.js', '.ts', '.tsx', '.jsx'],
				alias: { '@/': '/' },
				index: true,
			}),
			esmSh({ external: Object.keys(injectModules) }),
			inject({ modules: injectModules }),
			react({ self: window, extensions: ['.tsx', '.jsx'] }),
		],
	});

	for (const [key, value] of Object.entries(defaultVirtualFiles)) {
		modpack.fs.writeFile(key, value);
	}

	return modpack;
}
