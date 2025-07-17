import { LayoutIcon } from '@phosphor-icons/react/dist/ssr';
import PageLayout from '@/components/layouts/page-layout';
import TemplateCard from '@/components/templates/template-card';
import { findManyTemplates } from '@/lib/services';

export default async function Page() {
	const templates = await findManyTemplates();

	return (
		<PageLayout icon={<LayoutIcon />} title={'Templates Library'}>
			<div className="grid grid-cols-5 gap-6 py-2 px-6">
				{templates.map((template) => (
					<TemplateCard key={template.id} template={template} />
				))}
			</div>
		</PageLayout>
	);
}
