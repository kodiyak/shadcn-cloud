import { ButtonsIcons } from '@workspace/ui/components/button';
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from '@workspace/ui/components/tabs';
import { ExternalLinkIcon, RefreshCwIcon, ShareIcon } from 'lucide-react';

export default function Preview() {
	return (
		<div className="size-full flex flex-col pl-1 pr-3 gap-4 py-3">
			<Tabs className="flex-1" defaultValue="account">
				<TabsList>
					<TabsTrigger value="account">Preview</TabsTrigger>
					<TabsTrigger value="password">Docs</TabsTrigger>
					<div className="flex-1"></div>
					<ButtonsIcons
						items={[
							{
								label: 'Refresh',
								icon: <RefreshCwIcon />,
							},
							{
								label: 'Preview',
								icon: <ExternalLinkIcon />,
							},
							{
								label: 'Share Component',
								icon: <ShareIcon />,
							},
						]}
					/>
				</TabsList>
				<TabsContent
					className="flex-1 relative border rounded-2xl bg-muted/30"
					value="account"
				>
					Make changes to your account here.
				</TabsContent>
				<TabsContent value="password">Change your password here.</TabsContent>
			</Tabs>
		</div>
	);
}
