import { Button } from '@workspace/ui/components/button';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { useEditorStore } from '../lib/store/use-editor-store';
import type { NodeProps } from '../types';

export default function FileItem({ path }: NodeProps) {
	const filename = path.split('/').pop();
	const activePath = useEditorStore((state) => state.activePath);
	const openFile = useEditorStore((state) => state.openFile);
	return (
		<Button
			className="rounded-md w-full gap-2 justify-start mt-0.5"
			data-state={path === activePath ? 'open' : undefined}
			onClick={() => openFile(path)}
			size={'xs'}
			variant={'ghost'}
		>
			<FileCodeIcon className="size-4" type={filename?.split('.').pop()} />
			<span className="">{filename}</span>
		</Button>
	);
}
