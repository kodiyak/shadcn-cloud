import { Button } from '@workspace/ui/components/button';
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
			<div className={cn('flex flex-col items-center')}>
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
		</>
	);
}
