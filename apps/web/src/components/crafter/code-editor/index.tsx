"use client";

import { type BeforeMount, Editor, type OnMount } from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { ErrorBoundary } from "@workspace/ui/components/error-boundary";
import { useCallback, useState } from "react";
import type { BundledLanguage } from "shiki";
import { appConfig, shikiLangMapper } from "@/app.config";
import { useHighlighter } from "../lib/hooks/use-highlighter";
import { useEditorStore } from "../lib/store/use-editor-store";

export default function CodeEditor() {
	const path = useEditorStore((state) => state.path);
	const code = useEditorStore((state) => state.code);
	const updateCode = useEditorStore((state) => state.updateCode);
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

			setLanguage(shikiLangMapper(path) ?? "typescript");

			if (highlighter?.hightlighter) {
				shikiToMonaco(highlighter.hightlighter, monaco);
			}
		},
		[path, highlighter],
	);

	if (!highlighter.isReady) return null;

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
						value={code}
						theme={"default"}
						onChange={(value) => {
							updateCode(value ?? "");
						}}
						onMount={onMount}
						beforeMount={beforeMount}
					/>
				</ErrorBoundary>
			</div>
		</div>
	);
}
