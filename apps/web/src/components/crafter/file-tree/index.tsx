import { Accordion } from '@workspace/ui/components/accordion';
import { ButtonsIcons } from '@workspace/ui/components/button';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { FilePlusIcon, FolderPlusIcon } from 'lucide-react';
import { useProjectStore } from '../lib/store/use-project-store';
import CreateFile from './create-file';
import TreeItem from './tree-item';

export default function FileTree() {
	const nodes = useProjectStore((state) => state.nodes);
	const createFile = useDisclosure();

	return (
		<>
			<CreateFile {...createFile} parentPath="/" />
			<div className="size-full pr-1 pl-3 flex flex-col overflow-y-auto overflow-x-hidden">
				<div className="flex items-center py-2 justify-between min-w-[180]">
					<span className="text-xs">Workspace</span>
					<div className="flex items-center gap-0.5">
						<ButtonsIcons
							items={[
								{
									label: 'Create File',
									icon: <FilePlusIcon />,
									onClick: () => createFile.onOpen(),
								},
								{
									label: 'Create Folder',
									icon: <FolderPlusIcon />,
								},
							]}
							size={'icon-xs'}
							variant={'ghost'}
						/>
					</div>
				</div>
				<Accordion
					className="flex flex-col min-w-[180]"
					defaultValue={['/', '/previews']}
					type="multiple"
				>
					<TreeItem {...nodes[0]} />
				</Accordion>
			</div>
		</>
	);
}
