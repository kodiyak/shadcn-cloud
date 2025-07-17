import { Button } from '@workspace/ui/components/button';
import {
	ResizableHandle,
	ResizablePanel,
} from '@workspace/ui/components/resizable';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { cn } from '@workspace/ui/lib/utils';
import { Settings2Icon } from 'lucide-react';
import { motion } from 'motion/react';
import ComponentSettings from '@/components/components-entity/component-settings';
import FileTree from '../file-tree';

const MFileTree = motion.create(FileTree);
const MButton = motion.create(Button);

export default function CodeSidebar() {
	const openSettings = useDisclosure();

	return (
		<>
			<ComponentSettings {...openSettings} />
			<ResizablePanel
				className={'relative flex flex-col'}
				defaultSize={15}
				id={'resizable-code-sidebar'}
				maxSize={30}
				minSize={15}
				order={0}
			>
				<div className="flex flex-col relative flex-1">
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
				</div>
				<div className={cn('flex flex-col items-center py-4 xl:pl-4')}>
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
				</div>
			</ResizablePanel>
			<ResizableHandle id={'resizable-code-sidebar-handle'} />
		</>
	);
}
