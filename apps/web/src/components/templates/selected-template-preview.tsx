'use client';

import { useTemplatePicker } from './lib/store/use-template-picker';

export default function SelectedTemplatePreview() {
	const templateId = useTemplatePicker((state) => state.templateId);

	return (
		<div className="size-full absolute inset-0 bg-muted/30">
			{templateId ? (
				<iframe
					className="size-full absolute inset-0 border-0"
					src={`/cn/${templateId}`}
					title={'Selected Template Preview'}
				/>
			) : (
				<span>Select</span>
			)}
		</div>
	);
}
