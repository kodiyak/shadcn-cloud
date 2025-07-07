import { transformerRenderWhitespace } from '@shikijs/transformers';
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
			const html = hightlighter.codeToHtml(
				code?.replace(/\t/gm, '  ').replace(/[\r\n]+$/, '') ?? '',
				{
					lang: lang ?? 'typescript',
					theme,
					tabindex: 0,
					transformers: [
						{
							pre(node) {
								this.addClassToHast(node, 'has-line-numbers');
							},
							line(node, line) {
								// Cria um span para o número da linha
								const lineNumberNode: any = {
									type: 'element',
									tagName: 'span',
									properties: {
										className: 'line-number',
									},
									children: [{ type: 'text', value: String(line) }],
								};

								node.children.unshift(lineNumberNode);

								this.addClassToHast(node, 'code-line');
							},
						},
						transformerRenderWhitespace(),
					],
				},
			);
			setHtml(html);
		}
	}, [code, lang, hightlighter]);

	return (
		<div
			className={cn(
				'[&>pre]:p-2 [&>pre]:relative [&>pre]:z-10 [&>pre]:max-h-full [&>pre]:overflow-auto',
				'[&>pre_.line-number]:w-10 [&>pre_.line-number]:inline-block [&>pre_.line-number]:text-muted-foreground [&>pre_.line-number]:text-xs [&>pre_.line-number]:select-none [&>pre_.line-number]:pointer-events-none',
				'[&>pre_.tab]:w-2 [&>pre_.tab]:overflow-hidden [&>pre_.tab]:h-5 [&>pre_.tab]:self-center [&>pre_.tab]:inline-block',
				className,
			)}
			dangerouslySetInnerHTML={{ __html: html }}
			key={code.length + (lang ?? 'ts')}
		/>
	);
}

export { CodeBlock };
