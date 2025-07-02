import type { editor } from "monaco-editor";
import type {
	BundledHighlighterOptions,
	BundledLanguage,
	BundledTheme,
} from "shiki";
import githubDark from "shiki/themes/github-dark-dimmed.mjs";

interface AppConfig {
	name: string;
	shikiOptions: BundledHighlighterOptions<BundledLanguage, BundledTheme>;
	editorOptions: editor.IStandaloneEditorConstructionOptions;
}

export const appConfig: AppConfig = {
	name: "shadcn-cloud",
	shikiOptions: {
		themes: [{ ...githubDark, name: "default" }],
		langs: ["typescript", "tsx", "json", "markdown"],
		langAlias: { typescript: "tsx" },
	},
	editorOptions: {
		fontFamily: "var(--font-mono)",
		fontSize: 14,
		lineHeight: 1.8,
		minimap: { enabled: false },
		scrollBeyondLastLine: false,
		fontLigatures: true,
		renderLineHighlight: "all",
		cursorBlinking: "blink",
		cursorStyle: "line",
		wordWrap: "on",
		formatOnPaste: true,
		formatOnType: true,
		autoIndent: "full",
		automaticLayout: true,
		fontWeight: "normal",

		// Selection and cursor settings
		selectOnLineNumbers: true,
		multiCursorModifier: "alt",
		parameterHints: {
			enabled: true,
		},

		// Highlighting and rendering
		occurrencesHighlight: "singleFile",
		renderWhitespace: "none",
		matchBrackets: "always",
		renderControlCharacters: false,
		tabSize: 2,
		insertSpaces: true,
		cursorSmoothCaretAnimation: "on",

		// Scrolling and scrollbar settings
		smoothScrolling: true,
		scrollbar: {
			vertical: "visible",
			horizontal: "visible",
			useShadows: true,
			verticalScrollbarSize: 10,
			horizontalScrollbarSize: 10,
		},
	},
};

export function shikiLangMapper(path: string) {
	const langs: Partial<Record<BundledLanguage, string[]>> = {
		typescript: ["ts"],
		javascript: ["js"],
	};

	return Object.entries(langs).find(([_, extensions]) =>
		extensions.some((extension) => path.endsWith(`.${extension}`)),
	)?.[0] as BundledLanguage | undefined;
}
