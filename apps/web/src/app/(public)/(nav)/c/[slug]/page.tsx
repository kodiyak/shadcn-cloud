'use client';

import { SelectField } from '@workspace/ui/components/fields';
import { Input } from '@workspace/ui/components/input';
import PageLayout from '@/components/layouts/page-layout';

export default function Page() {
	return (
		<PageLayout title={''}>
			<div className="container mx-auto min-h-screen flex flex-col py-8">
				<div className="flex items-center px-6 justify-between">
					<h2 className="text-xl font-mono font-semibold">
						{'Collection Name'}
					</h2>
					<div className="flex items-center gap-2">
						<Input
							className="w-[300]"
							placeholder={'Search "Collection Name"...'}
						/>
						<SelectField
							_content={{ align: 'center' }}
							className="min-w-[200px]"
							options={[
								{ label: 'Newest', value: 'newest' },
								{ label: 'Recommended', value: 'recommended' },
								{ label: 'Most Liked', value: 'most_liked' },
							]}
							size={'sm'}
						/>
					</div>
				</div>
			</div>
		</PageLayout>
	);
}
