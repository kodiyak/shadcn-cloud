import PageLayout from '@/components/layouts/page-layout';

export default function Page() {
	return (
		<PageLayout title={'Explore Components'}>
			<div className="grid grid-cols-5 p-4 gap-4"></div>
		</PageLayout>
	);
}
