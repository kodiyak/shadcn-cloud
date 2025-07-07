import { Modpack, type ModpackBootOptions } from '@modpack/core';
import { esmSh, inject, resolver, virtual } from '@modpack/plugins';
import { react } from '@modpack/react';
import { swc } from '@modpack/swc';
import * as React from 'react';
import * as DevJSXRuntime from 'react/jsx-dev-runtime';
import * as ReactJSXRuntime from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom/client';

export async function initializeModpack(options?: ModpackBootOptions) {
	const modpack = await Modpack.boot({
		debug: true,
		...options,
		plugins: [
			{
				name: 'fetch',
				pipeline: {
					fetcher: {
						fetch: ({ url, options, next }) => {
							console.log(`OPTIONS`, options);
							return url.startsWith('http') ? fetch(url) : next();
						},
					},
				},
			},
			swc({
				extensions: ['.js', '.ts', '.tsx', '.jsx'],
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
			resolver({
				extensions: ['.js', '.ts', '.tsx', '.jsx'],
				alias: { '@/': '/src/' },
				index: true,
			}),
			esmSh({
				external: [
					'react',
					'react-dom',
					'react/jsx-dev-runtime',
					'react/jsx-runtime',
				],
			}),
			virtual(),
			inject({
				modules: {
					react: React,
					'react/jsx-dev-runtime': DevJSXRuntime,
					'react/jsx-runtime': ReactJSXRuntime,
					'react-dom/client': ReactDOM,
				},
			}),
			react({ self: window, extensions: ['.tsx', '.jsx'] }),
		],
	});
	return modpack;
}
