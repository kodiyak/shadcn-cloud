import { LibraryIcon } from 'lucide-react';
import PageLayout from '@/components/layouts/page-layout';
import TemplateCard from '@/components/templates/template-card';

export default function Page() {
	return (
		<div className="flex items-stretch h-screen overflow-hidden">
			<div className="flex-1 flex flex-col relative overflow-hidden h-full border-r">
				<PageLayout icon={<LibraryIcon />} title={'My Library'}>
					<div className="grid grid-cols-2 gap-6 py-2 px-6">
						{Array.from({ length: 20 }).map((_, index) => (
							<TemplateCard key={index} />
						))}
					</div>
				</PageLayout>
			</div>
			<div className="flex-1"></div>
		</div>
	);
}
