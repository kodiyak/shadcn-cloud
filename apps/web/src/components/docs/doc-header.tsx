import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';

export default function DocHeader() {
	return (
		<div className="flex flex-col container max-w-4xl mx-auto">
			<div className="flex items-end border-b border-dashed pb-6 gap-16">
				<div className="flex flex-col flex-1 gap-6">
					<div className="flex flex-col gap-4">
						<h2 className="text-3xl font-bold font-mono">Button</h2>
						<h3 className="text-muted-foreground text-lg">
							Used to trigger an action or event, such as submitting a form,
							displaying a dialog or sending a request.
						</h3>
					</div>
					<div className="flex flex-col gap-4">
						{[
							'A wrapper around native HTML <button>, supports all HTMLButtonElement properties, methods and events',
							'Different variants, sizes and border radiuses',
							'Pending state animation',
							'Respects reduce motion settings',
							'Supports icons, loading spinner and custom content',
						].map((item) => (
							<div
								className="flex items-start gap-3 text-muted-foreground"
								key={`${item}`}
							>
								<div className="size-6 relative shrink-0 rounded-full border bg-background flex items-center justify-center">
									<CheckIcon className="size-4" />
								</div>
								<span>{item}</span>
							</div>
						))}
					</div>
				</div>
				<div className="flex flex-col w-[180]">
					{[
						{
							label: 'llms.txt',
							href: '/llms.txt',
						},
						{
							label: 'MDN Reference',
							href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
							external: true,
						},
					].map((item) => (
						<Button
							asChild
							key={item.href + item.label}
							size={'sm'}
							variant={'link'}
						>
							<Link href={item.href}>
								<span className="flex-1 text-left">{item.label}</span>
								<ArrowRightIcon className="size-3.5" />
							</Link>
						</Button>
					))}
				</div>
			</div>
			<div className="py-4.5 flex flex-col gap-0.5">
				<span className="text-xs px-2 text-muted-foreground font-mono">
					Build with
				</span>
				<div className="flex items-center gap-1">
					{[
						{ label: 'React', href: 'https://react.dev', type: 'react' },
						{
							label: 'TypeScript',
							href: 'https://www.typescriptlang.org/',
							type: 'typescript',
						},
						{ label: 'Radix UI', href: 'https://radix-ui.com/', type: 'radix' },
						{
							label: 'Tailwind CSS',
							href: 'https://tailwindcss.com/',
							type: 'tailwind',
						},
						{ label: 'Motion', href: 'https://motion.dev/', type: 'motion' },
						{ label: 'CVA', href: 'https://cva.style/', type: 'cva' },
					].map((item) => (
						<Badge
							className="text-[11px] font-medium tracking-tighter uppercase h-8 px-3 gap-2 border-dashed"
							key={`${item.label}.${item.type}`}
							variant={'muted'}
						>
							{item.label}
						</Badge>
					))}
				</div>
			</div>
		</div>
	);
}
