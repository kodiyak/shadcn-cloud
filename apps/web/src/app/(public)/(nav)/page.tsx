import PageLayout from '@/components/layouts/page-layout';
import TemplateCard from '@/components/templates/template-card';

export default function Page() {
	return (
		<PageLayout title={'Explore Components'}>
			<div className="grid grid-cols-5 p-4 gap-4">
				{Array.from({ length: 20 }).map((_, index) => (
					<TemplateCard key={index} />
				))}
			</div>
		</PageLayout>
	);
}
