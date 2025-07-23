import type { CompileComponentResult } from '@/lib/services';

interface PublishPreviewProps extends CompileComponentResult {}

export default function PublishPreview({ registry }: PublishPreviewProps) {
	return <div>PublishPreview</div>;
}
