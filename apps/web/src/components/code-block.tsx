import { cn } from '@workspace/ui/lib/utils';
import { useLayoutEffect, useState } from 'react';
import type { BundledLanguage } from 'shiki';
import { useHighlighter } from './crafter/lib/hooks/use-highlighter';

interface SourceCodeBlockProps {
	code: string;
	lang?: BundledLanguage;
	className?: string;
}

function CodeBlock({ code, lang, className }: SourceCodeBlockProps) {
	const [html, setHtml] = useState('');
	const { hightlighter, theme } = useHighlighter();

	useLayoutEffect(() => {
		if (hightlighter) {
			const html = hightlighter.codeToHtml(code ?? '', {
				lang: lang ?? 'typescript',
				theme,
				tabindex: 0,
			});
			setHtml(html);
		}
	}, [code, lang, hightlighter]);

	return (
		<div
			className={cn(
				'[&>pre]:p-2 [&>pre]:relative [&>pre]:z-10 [&>pre]:max-h-full [&>pre]:overflow-auto',
				className,
			)}
			dangerouslySetInnerHTML={{ __html: html }}
			key={code.length + (lang ?? 'ts')}
		/>
	);
}

export { CodeBlock };
