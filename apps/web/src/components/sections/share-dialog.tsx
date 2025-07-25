import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { SocialIcon } from '@workspace/ui/components/icons';
import { Input } from '@workspace/ui/components/input';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { CodeIcon } from 'lucide-react';
import CopyButton from '../copy-button';

interface ShareDialogProps extends UseDisclosure {
	url: string;
}

export default function ShareDialog({
	isOpen,
	onOpenChange,
	url,
}: ShareDialogProps) {
	const shareOptions = [
		{
			label: 'Embed',
			icon: <CodeIcon className="" />,
		},
		{
			label: 'X',
			icon: <SocialIcon className="" type="twitter" />,
		},
		{
			label: 'Dev.to',
			icon: <SocialIcon className="" type="devto" />,
		},
		{
			label: 'Facebook',
			icon: <SocialIcon className="" type="facebook" />,
		},
	];
	return (
		<Dialog onOpenChange={onOpenChange} open={isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Share this Component</DialogTitle>
					<DialogDescription>
						Share the URL of this component with others.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-4 gap-2">
						{shareOptions.map((option) => (
							<Button
								className="w-full aspect-square h-auto flex-col items-center justify-center p-0 [&>svg]:size-8! [&>svg]:text-foreground"
								key={option.label}
								onClick={() => {
									console.log(`Sharing via ${option.label}`);
								}}
								variant={'ghost'}
							>
								{option.icon}
								<span>{option.label}</span>
							</Button>
						))}
					</div>
					<div className="relative">
						<Input
							className="pr-12! h-12 font-mono rounded-lg"
							readOnly
							value={url}
						/>
						<CopyButton
							className="absolute right-2 top-1.5"
							content={url}
							copyLabel={'Copy URL'}
							size={'icon'}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
