import { useMutation } from '@tanstack/react-query';
import { Button } from '@workspace/ui/components/button';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import PublishComponent from '@/components/components-entity/publish-component';
import { useProjectStore } from '../lib/store/use-project-store';
import DocsPreview from './docs-preview';

export default function Preview() {
	const publish = useProjectStore((state) => state.publish);
	const openPublish = useDisclosure();

	const onPublish = useMutation({
		mutationFn: async () => {
			await publish();
		},
	});

	return (
		<>
			<PublishComponent {...openPublish} />
			<div className="size-full flex flex-col pl-1 pr-3 gap-4 py-3">
				<div className="flex-1 relative border rounded-2xl bg-muted/30">
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
