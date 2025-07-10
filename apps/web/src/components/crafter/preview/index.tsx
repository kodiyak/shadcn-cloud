import { CloudIcon } from '@phosphor-icons/react';
import { Button } from '@workspace/ui/components/button';
import DocsPreview from './docs-preview';

export default function Preview() {
	return (
		<div className="size-full flex flex-col pl-1 pr-3 gap-4 py-3">
			<div className="flex-1 relative border rounded-2xl bg-muted/30">
				<DocsPreview />
			</div>
			<div className="flex justify-end">
				<Button className="rounded-xl gap-2 group" size={'sm'}>
					<span className="relative group-hover:animate-bounce">🚢</span>
					<span>Publish</span>
				</Button>
			</div>
		</div>
	);
}
