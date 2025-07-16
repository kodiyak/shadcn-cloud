import { Button } from '@workspace/ui/components/button';
import {
	ResizableHandle,
	ResizablePanel,
} from '@workspace/ui/components/resizable';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { cn } from '@workspace/ui/lib/utils';
import { Settings2Icon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import ComponentSettings from '@/components/components-entity/component-settings';
import FileTree from '../file-tree';
import SidebarIcon from './sidebar-icon';

const MFileTree = motion.create(FileTree);
const MButton = motion.create(Button);

export default function CodeSidebar() {
	const openSidebar = useDisclosure({ defaultOpen: true });
	const openSettings = useDisclosure();

	return (
		<>
			<ComponentSettings {...openSettings} />
			<ResizablePanel
				className={'relative flex flex-col'}
				collapsedSize={4}
				collapsible
				defaultSize={4}
				id={'resizable-code-sidebar'}
				maxSize={30}
				minSize={15}
				onCollapse={openSidebar.onClose}
				onExpand={openSidebar.onOpen}
				order={0}
			>
				<div className="flex flex-col relative flex-1">
					<AnimatePresence mode={'wait'}>
						{openSidebar.isOpen ? (
							<motion.div
								animate={{ scale: 1, opacity: 1 }}
								className="flex flex-col"
								exit={{ scale: 0.95, opacity: 0 }}
								initial={{ scale: 0.95, opacity: 0 }}
								key={'expanded'}
							>
								<MFileTree
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
				</div>
				<AnimatePresence>
					<div
						className={cn(
							'flex flex-col items-center py-4',
							openSidebar.isOpen ? 'xl:pl-4' : '',
						)}
					>
						{openSidebar.isOpen ? (
							<MButton
								animate={{ scale: 1, opacity: 1 }}
								className="w-full"
								exit={{ scale: 0.95, opacity: 0 }}
								initial={{ scale: 0.95, opacity: 0 }}
								key={'settings-button'}
								onClick={openSettings.onOpen}
								size={'xs'}
								variant={'ghost'}
							>
								<Settings2Icon />
								<span className="flex-1 text-left">Settings</span>
							</MButton>
						) : (
							<MButton
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.95, opacity: 0 }}
								initial={{ scale: 0.95, opacity: 0 }}
								key={'settings-icon'}
								onClick={openSettings.onOpen}
								size={'icon-lg'}
								variant={'ghost'}
							>
								<Settings2Icon />
							</MButton>
						)}
					</div>
				</AnimatePresence>
			</ResizablePanel>
			<ResizableHandle id={'resizable-code-sidebar-handle'} />
		</>
	);
}
