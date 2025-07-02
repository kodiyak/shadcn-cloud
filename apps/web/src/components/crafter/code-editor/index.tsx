"use client";

import { type BeforeMount, Editor, type OnMount } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { ErrorBoundary } from "@workspace/ui/components/error-boundary";
import { useCallback, useState } from "react";
import type { BundledLanguage } from "shiki";
import { appConfig, shikiLangMapper } from "@/app.config";
import { useHighlighter } from "../lib/hooks/use-highlighter";
import { useEditorStore } from "../lib/store/use-editor-store";
import { useProjectStore } from "../lib/store/use-project-store";

export default function CodeEditor() {
	const path = useEditorStore((state) => state.activePath);
	const content = useProjectStore(
		(state) => state.nodes.find((node) => node.path === path)?.content,
	);
	const updateContent = useProjectStore((state) => state.updateContent);
	const [language, setLanguage] = useState<BundledLanguage>("tsx");
	const highlighter = useHighlighter();

	const onMount = useCallback<OnMount>((editor, monaco) => {
		editor.addAction({
			id: "format-code",
			label: "Format Code",
			keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF],
			run: (ed) => {
				ed.getAction("editor.action.formatDocument")?.run();
			},
		});
	}, []);

	const beforeMount = useCallback<BeforeMount>(
		(monaco) => {
			monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
				jsx: monaco.languages.typescript.JsxEmit.React,
			});
			monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
				diagnosticCodesToIgnore: [2307],
			});
			monaco.languages.register({ id: "tsx" });
			monaco.languages.register({ id: "json" });
			monaco.languages.register({ id: "typescript" });
			monaco.languages.register({ id: "javascript" });
			monaco.languages.register({ id: "markdown" });

			if (path) setLanguage(shikiLangMapper(path) ?? "typescript");
			if (highlighter?.hightlighter)
				shikiToMonaco(highlighter.hightlighter, monaco);
		},
		[path, highlighter],
	);

	if (!highlighter.isReady) return null;
	if (!path || !content) {
		return (
			<div className="size-full px-1 py-3">
				<div className="size-full bg-muted/30 rounded-md border flex items-center justify-center">
					<span className="text-muted-foreground">Select a file to edit</span>
				</div>
			</div>
		);
	}

	return (
		<div className="size-full px-1 py-3">
			<div className="size-full bg-muted/30 rounded-md border overflow-hidden">
				<ErrorBoundary fallback={(err) => `${err.message}`}>
					<Editor
						className={"size-full !font-code"}
						language={language}
						key={path}
						options={appConfig.editorOptions}
						path={path}
						value={content}
						theme={"default"}
						onChange={(value) => {
							updateContent(path, value ?? "", true);
						}}
						onMount={onMount}
						beforeMount={beforeMount}
					/>
				</ErrorBoundary>
			</div>
		</div>
	);
}
