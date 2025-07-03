'use client';

import DocContent from './_doc-content';
import DocHeader from './_doc-header';

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
