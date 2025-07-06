'use client';

import DocHeader from '@/components/docs/doc-header';
import DocContent from './_doc-content';

export default function Page() {
	return (
		<div className="flex flex-col">
			<div className="border-b pt-32 bg-gradient-to-b from-muted/30 to-background">
				<DocHeader />
			</div>
			<DocContent />
		</div>
	);
}
