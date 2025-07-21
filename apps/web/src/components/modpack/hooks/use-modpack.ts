import { Modpack, type Orchestrator } from '@modpack/core';
import { esmSh, http, inject, resolver } from '@modpack/plugins';
import { react } from '@modpack/react';
import { swc } from '@modpack/swc';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { useEffect, useRef, useState } from 'react';
import defaultVirtualFiles from '@/lib/cn.json';
import { getModpackInjections } from '../utils/get-modpack-injections';

export function useModpack(baseUrl: string) {
	const modpackRef = useRef<Orchestrator | null>(null);
	const [module, setModule] = useState<any | null>(null);
	const loaded = useRef(false);
	const [isReady, setIsReady] = useState(false);
	const loading = useDisclosure();

	const initializeModpack = async () => {
		const injectModules = getModpackInjections();
		return await Modpack.boot({
			debug: true,
			onBuildEnd: async (props) => {
				if (props.result) setModule(props.result);
			},
			onModuleUpdate: async (props) => {
				if (props.result) setModule(props.result);
			},
			plugins: [
				swc({
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
			],
		});
	};

	const onLoad = async () => {
		if (loaded.current) return;
		loaded.current = true;
		try {
			modpackRef.current = await initializeModpack();
			setIsReady(true);
		} catch (error) {
			console.error('Failed to initialize modpack:', error);
		}
	};

	const mount = async (entrypoint: string, files: Record<string, string>) => {
		if (!modpackRef.current) {
			console.error('Modpack is not initialized');
			return;
		}

		for (const [filePath, content] of Object.entries(defaultVirtualFiles)) {
			modpackRef.current.fs.writeFile(`/${baseUrl}${filePath}`, content);
		}

		for (const [filePath, content] of Object.entries(files)) {
			modpackRef.current.fs.writeFile(`/${baseUrl}${filePath}`, content);
		}

		loading.onOpen();
		await modpackRef.current.mount(`file:///${baseUrl}${entrypoint}`);
		loading.onClose();
		setIsReady(() => true);
	};

	useEffect(() => {
		onLoad();
	}, []);

	return {
		mount,
		isReady,
		modpack: modpackRef.current,
		module,
	};
}
