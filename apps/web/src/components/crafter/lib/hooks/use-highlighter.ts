import { useEffect, useRef, useState } from "react";
import {
	type BundledLanguage,
	type BundledTheme,
	createHighlighter,
	type HighlighterGeneric,
} from "shiki";
import { appConfig } from "@/app.config";

type Highlighter = HighlighterGeneric<BundledLanguage, BundledTheme>;

let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = createHighlighter(appConfig.shikiOptions).then((h) => {
			highlighterInstance = h;
			return h;
		});
	}

	return highlighterInstance || highlighterPromise;
}

export function useHighlighter() {
	const resolvedTheme = "dark" as const;
	const [hightlighter, setHighlighter] = useState<Highlighter | null>(null);
	const initialized = useRef(false);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		if (!initialized.current) {
			initialized.current = true;
			const fetchHighlighter = async () => {
				const h = await getHighlighter();
				setHighlighter(h);
				setIsReady(() => true);
			};

			fetchHighlighter();
		}
	}, []);

	return {
		hightlighter,
		isReady,
		theme: resolvedTheme,
	};
}
