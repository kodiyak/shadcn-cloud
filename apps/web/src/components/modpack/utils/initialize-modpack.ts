'use client';

import { Modpack, type ModpackBootOptions } from '@modpack/core';
import { esmSh, http, inject, resolver } from '@modpack/plugins';
import { react } from '@modpack/react';
import { type SwcOptions, swc } from '@modpack/swc';
import { unocss } from '@modpack/unocss';
import type { RefObject } from 'react';
import defaultVirtualFiles from '@/lib/cn.json';
import { getModpackInjections } from './get-modpack-injections';

export async function initializeModpack(
	options?: Partial<Omit<ModpackBootOptions, 'plugins'>> & {
		baseUrl: string;
		files?: Record<string, string>;
		elementRef?: RefObject<HTMLDivElement | null>;
		onParse?: SwcOptions['onParse'];
		onTransform?: SwcOptions['onTransform'];
	},
) {
	const baseUrl = options?.baseUrl || '';
	const injectModules = getModpackInjections();
	const plugins = [
		swc({
			onParse: options?.onParse,
			onTransform: options?.onTransform,
			extensions: ['.js', '.ts', '.tsx', '.jsx'],
			contentTypes: ['application/javascript'],
			jsc: {
				target: 'es2022',
				parser: { syntax: 'typescript', tsx: true },
				baseUrl: `/${baseUrl}/`,
				paths: {
					'/': [`/${baseUrl}/`],
					'@/': [`/${baseUrl}/`],
				},
				transform: {
					legacyDecorator: true,
					decoratorMetadata: true,
					react: { development: true, refresh: true, runtime: 'automatic' },
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
			alias: {
				'/': `/${baseUrl}/`,
				'@/': `/${baseUrl}/`,
			},
			baseUrl: `/${baseUrl}`,
			index: true,
		}),
		inject({ modules: injectModules }),
		react({ self: window, extensions: ['.tsx', '.jsx'] }),
		esmSh({ external: Object.keys(injectModules) }),
	];

	if (options?.elementRef) {
		plugins.push(
			unocss({
				rootElement: () => options?.elementRef?.current || undefined,
				inject(styleElement) {
					options?.elementRef?.current?.appendChild(styleElement);
				},
				config: {
					theme: {
						fontFamily: {
							sans: 'var(--font-sans)',
							mono: 'var(--font-mono)',
							serif: 'var(--font-serif)',
							formal: 'var(--font-formal)',
						},
						colors: {
							background: 'var(--background)',
							foreground: 'var(--foreground)',
							card: {
								DEFAULT: 'var(--card)',
								foreground: 'var(--card-foreground)',
							},
							popover: {
								DEFAULT: 'var(--popover)',
								foreground: 'var(--popover-foreground)',
							},
							primary: {
								DEFAULT: 'var(--primary)',
								foreground: 'var(--primary-foreground)',
							},
							secondary: {
								DEFAULT: 'var(--secondary)',
								foreground: 'var(--secondary-foreground)',
							},
							muted: {
								DEFAULT: 'var(--muted)',
								foreground: 'var(--muted-foreground)',
							},
							accent: {
								DEFAULT: 'var(--accent)',
								foreground: 'var(--accent-foreground)',
							},
							success: {
								DEFAULT: 'var(--success)',
								foreground: 'var(--success-foreground)',
							},
							destructive: {
								DEFAULT: 'var(--destructive)',
								foreground: 'var(--destructive-foreground)',
							},
							border: 'var(--border)',
							input: 'var(--input)',
							ring: 'var(--ring)',
							shadow: 'var(--shadow-color)',
							chart: {
								1: 'var(--chart-1)',
								2: 'var(--chart-2)',
								3: 'var(--chart-3)',
								4: 'var(--chart-4)',
								5: 'var(--chart-5)',
							},
							sidebar: {
								DEFAULT: 'var(--sidebar)',
								foreground: 'var(--sidebar-foreground)',
								primary: {
									DEFAULT: 'var(--sidebar-primary)',
									foreground: 'var(--sidebar-primary-foreground)',
								},
								accent: {
									DEFAULT: 'var(--sidebar-accent)',
									foreground: 'var(--sidebar-accent-foreground)',
								},
								border: 'var(--sidebar-border)',
								ring: 'var(--sidebar-ring)',
							},
						},
						letterSpacing: {
							tighter: 'var(--tracking-tighter)',
							tight: 'var(--tracking-tight)',
							normal: 'var(--tracking-normal)',
							wide: 'var(--tracking-wide)',
							wider: 'var(--tracking-wider)',
							widest: 'var(--tracking-widest)',
						},
						borderRadius: {
							sm: 'var(--radius-sm)',
							md: 'var(--radius-md)',
							lg: 'var(--radius-lg)',
							xl: 'var(--radius-xl)',
						},
						boxShadow: {
							'2xs': 'var(--shadow-2xs)',
							xs: 'var(--shadow-xs)',
							sm: 'var(--shadow-sm)',
							DEFAULT: 'var(--shadow)',
							md: 'var(--shadow-md)',
							lg: 'var(--shadow-lg)',
							xl: 'var(--shadow-xl)',
							'2xl': 'var(--shadow-2xl)',
						},
						fontSize: {
							'8xl': 'var(--text-8xl)',
						},
						spacing: {
							DEFAULT: 'var(--spacing)',
						},
					},
				},
			}),
		);
	}

	const modpack = await Modpack.boot({
		debug: true,
		...options,
		plugins,
	});

	const initialFiles = {
		...defaultVirtualFiles,
		...options?.files,
	};
	for (const [key, value] of Object.entries(initialFiles)) {
		modpack.fs.writeFile(`/${baseUrl}${key}`, value);
	}

	return modpack;
}
