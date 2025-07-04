import type { NextPage } from 'next';
import Crafter from '@/components/crafter';

const Page: NextPage = () => {
	return (
		<div className="flex w-screen bg-gradient-to-br from-muted/20 to-muted h-screen items-stretch">
			<div className="w-20"></div>
			<div className="flex-1 py-4 pr-4">
				<div className="bg-background h-full rounded-xl border border-border flex flex-col">
					<Crafter />
				</div>
			</div>
		</div>
	);
};

export default Page;
