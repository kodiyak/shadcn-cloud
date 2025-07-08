import { Button } from '@workspace/ui/components/button';
import { ReactIcon } from '@workspace/ui/components/icons';
import {
	ResizableHandle,
	ResizablePanel,
} from '@workspace/ui/components/resizable';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { AnimatePresence, motion } from 'motion/react';
import FileTree from '../file-tree';
import SidebarIcon from './sidebar-icon';

const FileTreeMotion = motion.create(FileTree);

export default function CodeSidebar() {
	const open = useDisclosure({ defaultOpen: true });

	return (
		<>
			<ResizablePanel
				className={'relative'}
				collapsedSize={4}
				collapsible
				defaultSize={15}
				id={'resizable-code-sidebar'}
				maxSize={30}
				minSize={15}
				onCollapse={open.onClose}
				onExpand={open.onOpen}
				order={0}
			>
				<AnimatePresence mode={'wait'}>
					{open.isOpen ? (
						<motion.div
							animate={{ scale: 1, opacity: 1 }}
							className="flex flex-col"
							exit={{ scale: 0.95, opacity: 0 }}
							initial={{ scale: 0.95, opacity: 0 }}
							key={'expanded'}
						>
							<FileTreeMotion
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								initial={{ scale: 0.95, opacity: 0 }}
								layoutId={'code-sidebar'}
							/>
						</motion.div>
					) : (
						<motion.div
							animate={{ scale: 1, opacity: 1 }}
							className="flex flex-col w-full"
							initial={{ scale: 0.95, opacity: 0 }}
							key={'collapsed'}
						>
							<div className="flex flex-col w-full items-center py-4">
								<SidebarIcon />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</ResizablePanel>
			<ResizableHandle id={'resizable-code-sidebar-handle'} />
		</>
	);
}
