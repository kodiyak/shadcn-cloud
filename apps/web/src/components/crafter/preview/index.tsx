import { Button } from '@workspace/ui/components/button';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import PublishComponent from '@/components/components-entity/publish-component';
import DocsPreview from './docs-preview';

export default function Preview() {
	const openPublish = useDisclosure();

	return (
		<>
			<PublishComponent {...openPublish} />
			<div className="size-full flex flex-col gap-4 border-l border-dashed overflow-hidden">
				<div className="flex-1 relative">
					<DocsPreview />
				</div>
				<div className="flex justify-end">
					<Button
						className="rounded-xl gap-2 group"
						disabled={openPublish.isOpen}
						onClick={openPublish.onOpen}
						size={'sm'}
					>
						<span className="relative group-hover:animate-bounce">🚢</span>
						<span>Publish</span>
					</Button>
				</div>
			</div>
		</>
	);
}
