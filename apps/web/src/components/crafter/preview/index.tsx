import DocsPreview from './docs-preview';

export default function Preview() {
	return (
		<div className="size-full flex flex-col gap-4">
			<div className="flex-1 relative">
				<DocsPreview />
			</div>
		</div>
	);
}
