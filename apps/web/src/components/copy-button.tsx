import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import {
	type ButtonProps,
	ButtonsIcons,
} from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import useCopy from '@/lib/hooks/use-copy';

interface CopyButtonProps {
	className?: string;
	content?: string;
	size?: ButtonProps['size'];
	variant?: ButtonProps['variant'];
}

export default function CopyButton({
	content,
	className,
	variant = 'outline',
	size,
}: CopyButtonProps) {
	const [copied, onCopy] = useCopy(2.5);
	return (
		<ButtonsIcons
			items={[
				{
					variant: copied ? 'success-outline' : variant,
					className: cn(copied ? 'text-success' : '', className),
					disabled: !content,
					size,
					label: copied ? 'Copied!' : 'Copy',
					icon: copied ? <CheckIcon /> : <CopyIcon />,
					onClick: async () => {
						if (content) {
							await onCopy(content);
						}
					},
				},
			]}
		/>
	);
}
