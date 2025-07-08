import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import { motion } from 'motion/react';
import { useState } from 'react';
import templates from '@/lib/templates.json';
import { useCompilationStore } from '../lib/store/use-compilation-store';
import { useProjectStore } from '../lib/store/use-project-store';
import TemplatePreview from './template-preview';

const CardMotion = motion(Card);

export default function SelectTemplate() {
	const [currentTemplate, setCurrentTemplate] = useState(templates[0]);
	const selectTemplate = useProjectStore((state) => state.selectTemplate);
	const isCompiling = Object.values(
		useCompilationStore((state) => state.compiling),
	).some(Boolean);

	return (
		<div className="w-screen h-screen flex items-center justify-center fixed inset-0 bg-muted/30 backdrop-blur-xs z-50">
			<CardMotion
				animate={{
					scale: isCompiling ? 0.95 : 1,
					opacity: isCompiling ? 0.9 : 1,
				}}
				className={'w-full max-w-3xl'}
				transition={{
					delay: 0.5,
					duration: 0.8,
					ease: [0, 0.71, 0.2, 1.01],
				}}
			>
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
								disabled={isCompiling}
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
			</CardMotion>
		</div>
	);
}
