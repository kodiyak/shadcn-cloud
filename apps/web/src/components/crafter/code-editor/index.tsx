'use client';

import {
	type BeforeMount,
	Editor,
	type Monaco,
	type OnChange,
	type OnMount,
} from '@monaco-editor/react';
import { shikiToMonaco } from '@shikijs/monaco';
import { Badge } from '@workspace/ui/components/badge';
import { ErrorBoundary } from '@workspace/ui/components/error-boundary';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { BundledLanguage } from 'shiki';
import { appConfig, shikiLangMapper } from '@/app.config';
import { useHighlighter } from '../lib/hooks/use-highlighter';
import { useEditorStore } from '../lib/store/use-editor-store';
import { useProjectStore } from '../lib/store/use-project-store';

export default function CodeEditor() {
	const path = useEditorStore((state) => state.activePath);
	const searchNodes = useProjectStore((state) => state.searchNodes);
	// Node is not reactive, but should be fine for now
	const node = searchNodes((n) => n.path === path)[0];
	const updateContent = useProjectStore((state) => state.updateContent);
	const highlighter = useHighlighter();

	const [content, setContent] = useState<string>(() => node?.content || '');
	const [language, setLanguage] = useState<BundledLanguage>('tsx');

	const monacoRef = useRef<Monaco | null>(null);
	const onMount = useCallback<OnMount>((editor, monaco) => {
		editor.addAction({
			id: 'format-code',
			label: 'Format Code',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF],
			run: (ed) => {
				ed.getAction('editor.action.formatDocument')?.run();
			},
		});
		editor.addAction({
			id: 'save-code',
			label: 'Save Code',
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
			run: (ed) => {
				const content = ed.getValue();
				const path = useEditorStore.getState().activePath;
				useProjectStore.getState().save(path!, content);
			},
		});
	}, []);

	const onChange = useCallback<OnChange>(
		(v) => setContent(v || ''),
		[setContent],
	);

	const beforeMount = useCallback<BeforeMount>(
		(monaco) => {
			monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
				jsx: monaco.languages.typescript.JsxEmit.React,
			});
			monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
				diagnosticCodesToIgnore: [2307],
			});
			monaco.languages.register({ id: 'tsx' });
			monaco.languages.register({ id: 'json' });
			monaco.languages.register({ id: 'typescript' });
			monaco.languages.register({ id: 'javascript' });
			monaco.languages.register({ id: 'markdown' });

			const filename = path?.split('/').pop();
			if (filename) setLanguage(shikiLangMapper(filename) ?? 'typescript');
			if (highlighter?.hightlighter) {
				shikiToMonaco(highlighter.hightlighter, monaco);
			}

			monacoRef.current = monaco;
		},
		[path, highlighter],
	);

	// Initial content setup
	useEffect(() => {
		if (node?.draftContent !== content) {
			setContent(() => node?.draftContent || '');
		}
	}, [path]);

	// Update content in the store when content changes
	useEffect(() => {
		if (content !== node?.draftContent) {
			updateContent(path || '', content);
		}
	}, [content]);

	if (!highlighter.isReady) return null;
	if (path === null) {
		return (
			<div className="size-full px-1 py-3">
				<div className="size-full bg-muted/30 rounded-md border flex items-center justify-center">
					<span className="text-muted-foreground">Select a file to edit</span>
				</div>
			</div>
		);
	}

	return (
		<div className="size-full px-1 py-3 flex flex-col">
			<div className="flex items-center px-4 h-10">
				<Badge className="h-auto py-1 px-3 gap-1.5" variant={'muted'}>
					<FileCodeIcon className="size-5" type={language} />
					{node?.path || 'Untitled'}
				</Badge>
				<div className="flex-1"></div>
				<span className="text-xs text-muted-foreground">{language}</span>
			</div>
			<div className="flex-1 relative">
				<div className="size-full bg-muted/30 rounded-2xl overflow-hidden">
					<ErrorBoundary fallback={(err) => `${err.message}`}>
						<Editor
							beforeMount={beforeMount}
							className={'size-full !font-code'}
							key={path}
							language={language}
							onChange={onChange}
							onMount={onMount}
							options={appConfig.editorOptions}
							path={path}
							theme={'default'}
							value={content}
						/>
					</ErrorBoundary>
				</div>
			</div>
		</div>
	);
}
