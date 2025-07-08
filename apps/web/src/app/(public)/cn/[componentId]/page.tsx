import { notFound } from 'next/navigation';
import DocHeader from '@/components/docs/doc-header';
import { findComponent } from '@/lib/services';
import DocContent from './_doc-content';

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
			<div className="border-b pt-32 bg-gradient-to-b from-muted/30 to-background">
				<DocHeader {...(component.metadata as any)} />
			</div>
			<DocContent component={component} />
		</div>
	);
}
