'use client';

import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

export default function SearchTemplates() {
	const [{ q: query, category }, onChange] = useState({
		q: '',
		category: 'all',
	});
	return (
		<>
			<div className="relative max-w-2xl w-full mx-auto flex items-center">
				<SearchIcon className="absolute left-4 size-4" />
				<Input
					className="w-full pl-12"
					onChange={(v) => {
						onChange((prev) => ({ ...prev, q: v.target.value }));
					}}
					placeholder={'Search...'}
					value={query}
				/>
			</div>
			<div className="flex items-center gap-1 justify-center">
				{[
					{
						label: 'All',
						value: 'all',
					},
					{
						label: 'Insights Displays',
						value: 'insights-displays',
					},
					{
						label: 'Navigation & Menus',
						value: 'navigation-menus',
					},
					{
						label: 'Charts & Graphs',
						value: 'charts-graphs',
					},
					{
						label: 'Forms & Inputs',
						value: 'forms-inputs',
					},
					{
						label: 'Feedbacks & Status Indicators',
						value: 'feedbacks',
					},
				].map((item) => (
					<Button
						data-state={category === item.value ? 'open' : 'inactive'}
						key={item.value}
						onClick={() => {
							onChange((prev) => ({ ...prev, category: item.value }));
						}}
						size={'xs'}
						variant={'ghost'}
					>
						{item.label}
					</Button>
				))}
			</div>
		</>
	);
}
