import type { NextPage } from 'next';
import Crafter from '@/components/crafter';
import { ModpackProvider } from '@/components/providers/modpack-provider';

const Page: NextPage = () => {
	return (
		<div className="flex w-screen bg-gradient-to-br from-muted/20 to-muted h-screen items-stretch">
			<div className="flex-1 p-4">
				<div className="bg-background h-full rounded-xl border border-border flex flex-col">
					<ModpackProvider>
						<Crafter />
					</ModpackProvider>
				</div>
			</div>
		</div>
	);
};

export default Page;
