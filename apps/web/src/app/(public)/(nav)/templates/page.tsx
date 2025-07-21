import { GlobeIcon } from '@phosphor-icons/react/dist/ssr';
import { ToolIcon } from '@workspace/ui/components/icons';
import PageLayout from '@/components/layouts/page-layout';
import TemplateCard from '@/components/templates/template-card';
import { findManyTemplates } from '@/lib/services';
import SearchTemplates from './_search-templates';

export default async function Page() {
	const templates = await findManyTemplates();

	return (
		<PageLayout icon={<GlobeIcon />} title={'Community'}>
			<div className="container mx-auto flex flex-col gap-4">
				<div className="flex flex-col py-12 gap-4">
					<div className="flex items-center justify-center">
						{['typescript', 'javascript', 'shadcn', 'radix', 'tailwindcss'].map(
							(tech) => (
								<div
									className="size-10 flex items-center justify-center rounded-full overflow-hidden border p-2.5 -mr-4 bg-background bg-gradient-to-b from-muted/20 to-transparent"
									key={tech}
								>
									<ToolIcon type={tech} />
								</div>
							),
						)}
					</div>
					<h2 className="text-4xl font-semibold text-center">
						Explore the Universe of Components.
					</h2>
					<SearchTemplates />
				</div>
				<div className="grid grid-cols-3 gap-6 py-6 px-6">
					{templates.map((template) => (
						<TemplateCard key={template.id} template={template} />
					))}
				</div>
			</div>
		</PageLayout>
	);
}
