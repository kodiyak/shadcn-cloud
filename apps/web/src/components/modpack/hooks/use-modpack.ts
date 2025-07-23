import type {
	ModpackBootOptions,
	OnLogHook,
	Orchestrator,
} from '@modpack/core';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { type RefObject, useEffect, useRef, useState } from 'react';
import defaultVirtualFiles from '@/lib/cn.json';
import { initializeModpack } from '../utils/initialize-modpack';

interface UseModpackProps extends Partial<ModpackBootOptions> {
	elementRef?: RefObject<HTMLDivElement | null>;
}

export type ModpackLog = Pick<Parameters<OnLogHook>[0], 'message' | 'level'>;

export function useModpack(baseUrl: string, options?: UseModpackProps) {
	const modpackRef = useRef<Orchestrator | null>(null);
	const [module, setModule] = useState<any | null>(null);
	const loaded = useRef(false);
	const [isReady, setIsReady] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const compiling = useDisclosure();

	const onLoad = async () => {
		if (loaded.current) return;
		loaded.current = true;
		try {
			modpackRef.current = await initializeModpack({
				baseUrl,
				elementRef: options?.elementRef,
				onBuildEnd: async (props) => {
					props.result ? setModule(props.result) : setModule(null);
					props.error ? setError(props.error) : setError(null);
					compiling.onClose();
					console.log('[onBuildEnd] Modpack build completed:', props);
					return options?.onBuildEnd?.(props);
				},
				onModuleUpdate: async (props) => {
					compiling.onClose();
					console.log('[onModuleUpdate] Modpack module updated:', props);
					return options?.onModuleUpdate?.(props);
				},
				...options,
			});
			setIsReady(() => true);
		} catch (error) {
			console.error('Failed to initialize modpack:', error);
		}
	};

	const mount = async (entrypoint: string, files: Record<string, string>) => {
		if (!modpackRef.current) {
			console.error('Modpack is not initialized');
			return;
		}

		compiling.onOpen();
		try {
			for (const [filePath, content] of Object.entries(files)) {
				modpackRef.current.fs.writeFile(`/${baseUrl}${filePath}`, content);
			}

			await modpackRef.current.mount(`file:///${baseUrl}${entrypoint}`);
		} catch (error) {
			console.error('Failed to mount modpack:', error);
		}
	};

	const refresh = async (entrypoint: string, files: Record<string, string>) => {
		if (!modpackRef.current) {
			console.error('Modpack is not initialized');
			return;
		}

		for (const [filePath, content] of Object.entries(files)) {
			modpackRef.current.fs.writeFile(`/${baseUrl}${filePath}`, content);
		}

		try {
			await modpackRef.current.refresh(
				`file:///${baseUrl}${entrypoint}`,
				files[entrypoint],
			);
		} catch (error) {
			console.error('Failed to refresh modpack:', error);
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	useEffect(() => {
		onLoad();
	}, []);

	return {
		mount,
		refresh,
		isReady,
		isCompiling: compiling.isOpen,
		modpack: modpackRef.current,
		module,
		error,
	};
}
