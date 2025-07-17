import {
	AccordionContent,
	AccordionItem,
	AccordionPrimitiveTrigger,
} from '@workspace/ui/components/accordion';
import { Button, ButtonsIcons } from '@workspace/ui/components/button';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { FolderIcon, PlusIcon } from 'lucide-react';
import type { NodeProps } from '../types';
import CreateFile from './create-file';
import TreeItem from './tree-item';

export default function FolderItem({ path, items = [] }: NodeProps) {
	const name = path.split('/').pop();
	const createFile = useDisclosure();
	const sortedItems = items.sort((a, b) => a.path.localeCompare(b.path));
	const files = sortedItems.filter((item) => item.type === 'file');
	const folders = sortedItems.filter((item) => item.type === 'directory');

	return (
		<>
			<CreateFile {...createFile} parentPath={path} />
			<AccordionItem className="mt-0.5" value={path}>
				<AccordionPrimitiveTrigger asChild>
					<Button asChild className="w-full" size={'xs'} variant={'ghost'}>
						<div>
							<div className="flex flex-1 overflow-hidden pr-5 items-center text-left gap-2 relative">
								<FolderIcon className="size-4 shrink-0 text-muted-foreground" />
								<span className="truncate">{name || '/'}</span>
							</div>
							<div className="absolute right-2 top-1.5 z-20">
								<ButtonsIcons
									items={[
										{
											label: 'Create File',
											icon: <PlusIcon />,
											onClick: createFile.onOpen,
										},
									]}
									size={'icon-xs'}
									variant={'ghost'}
								/>
							</div>
						</div>
					</Button>
				</AccordionPrimitiveTrigger>
				<AccordionContent>
					<div className="pl-2 flex flex-col">
						<div className="flex flex-col border-l pl-1">
							{files.map((child) => (
								<TreeItem key={child.path} {...child} />
							))}
							{folders.map((child) => (
								<TreeItem key={child.path} {...child} />
							))}
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>
		</>
	);
}
