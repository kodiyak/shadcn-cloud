import { Modpack, type ModpackBootOptions } from '@modpack/core';
import { esmSh, http, inject, resolver, virtual } from '@modpack/plugins';
import { react } from '@modpack/react';
import { type SwcOptions, swc } from '@modpack/swc';
import { modpackUi } from '@workspace/ui/lib/modpack';
import * as Motion from 'motion';
import * as MotionReact from 'motion/react';
import * as MotionReactClient from 'motion/react-client';
import * as MotionReactM from 'motion/react-m';
import * as MotionReactMini from 'motion/react-mini';
import * as React from 'react';
import * as DevJSXRuntime from 'react/jsx-dev-runtime';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import defaultVirtualFiles from '@/lib/cn.json';

export async function initializeModpack(
	options?: ModpackBootOptions & {
		onParse?: SwcOptions['onParse'];
		onTransform?: SwcOptions['onTransform'];
	},
) {
	const modpack = await Modpack.boot({
		debug: true,
		...options,
		onBuildEnd: async (props) => {
			await options?.onBuildEnd?.(props);
			// console.log('Modpack build completed.');
			// console.log('Exports:', exports);
			// console.log('Imports:', imports);
		},
		onModuleUpdate: async (props) => {
			await options?.onModuleUpdate?.(props);
			// console.log(`Module updated: ${props.path}`);
			// console.log('Exports:', exports);
			// console.log('Imports:', imports);
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
			virtual(),
			resolver({
				extensions: ['.js', '.ts', '.tsx', '.jsx'],
				alias: { '@/': '/' },
				index: true,
			}),
			esmSh({
				external: [
					'react',
					'react-dom',
					'react/jsx-dev-runtime',
					'react/jsx-runtime',
					'motion',
					'motion/react',
					'motion/react-client',
					'motion/react-m',
					'motion/react-mini',
					...Object.keys(modpackUi),
				],
			}),
			inject({
				modules: {
					react: React,
					motion: Motion,
					'react-dom': ReactDOM,
					'motion/react': MotionReact,
					'motion/react-client': MotionReactClient,
					'motion/react-m': MotionReactM,
					'motion/react-mini': MotionReactMini,
					'react/jsx-dev-runtime': DevJSXRuntime,
					'react/jsx-runtime': ReactJSXRuntime,
					'react-dom/client': ReactDOMClient,
					...modpackUi,
				},
			}),
			react({ self: window, extensions: ['.tsx', '.jsx'] }),
		],
	});

	for (const [key, value] of Object.entries(defaultVirtualFiles)) {
		modpack.fs.writeFile(key, value);
	}

	return modpack;
}
