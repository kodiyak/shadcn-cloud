import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import { useState } from 'react';
import templates from '@/lib/templates.json';
import { useProjectStore } from '../lib/store/use-project-store';
import TemplatePreview from './template-preview';

export default function SelectTemplate() {
	const [currentTemplate, setCurrentTemplate] = useState(templates[0]);
	const selectTemplate = useProjectStore((state) => state.selectTemplate);

	return (
		<div className="w-screen h-screen flex items-center justify-center fixed inset-0 bg-muted/30 backdrop-blur-xs z-50">
			<Card className="w-full max-w-3xl">
				<CardHeader>
					<CardTitle>Pick a Template</CardTitle>
					<CardDescription>
						Get started with a template to build something awesome 🚀
					</CardDescription>
				</CardHeader>
				<CardContent className="gap-6">
					{currentTemplate && (
						<TemplatePreview
							onSelect={() => {
								selectTemplate(currentTemplate);
							}}
							template={currentTemplate}
						/>
					)}
					<div className="grid grid-cols-4 gap-4">
						{templates.map((template, index) => (
							<Button
								key={`${template.title}.${index}`}
								onClick={() => {
									setCurrentTemplate(template);
								}}
								variant={'outline'}
							>
								{template.title}
							</Button>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
