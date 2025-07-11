import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import type { UseDisclosure } from '@workspace/ui/hooks/use-disclosure';

interface AuthInviteProps extends UseDisclosure {}

export default function AuthInvite({ isOpen, onOpenChange }: AuthInviteProps) {
	return (
		<Dialog onOpenChange={onOpenChange} open={isOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sign Up to Continue</DialogTitle>
					<DialogDescription>
						Please sign up to access this feature. It only takes a minute!
					</DialogDescription>
				</DialogHeader>
				<div></div>
				<DialogFooter>
					<Button>Sign Up</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
