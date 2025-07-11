import { notFound } from 'next/navigation';
import DocHeader from '@/components/docs/doc-header';
import { findComponent } from '@/lib/services';
import DocContent from './_doc-content';
import DocFooter from './_doc-footer';
import DocInstall from './_doc-install';

interface Props {
	params: Promise<{ componentId: string }>;
}

export default async function Page({ params }: Props) {
	const { componentId } = await params;
	const component = await findComponent(componentId);

	if (!component) {
		notFound();
	}

	return (
		<div className="flex flex-col">
			<div className="border-b pt-12 border-border border-dashed">
				<DocHeader {...component.metadata} />
			</div>
			<DocInstall component={component} />
			<DocContent component={component} />
			<DocFooter component={component} />
		</div>
	);
}
