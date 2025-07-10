import ManualCode from '@/components/docs/manual-installation/manual-code';
import { NpmInstall } from '@/components/docs/mdx-components';
import type { Component } from '@/lib/domain';

interface DocManualInstallProps {
	component: Component;
}

export default function DocManualInstall({ component }: DocManualInstallProps) {
	return (
		<div className="flex flex-col gap-12">
			<div className="flex flex-col">
				<NpmInstall packages={component.registry.dependencies ?? []} />
			</div>

			{component.registry.files?.map((file) => (
				<ManualCode
					content={file.content || ''}
					key={file.path}
					path={file.path}
				/>
			))}
		</div>
	);
}
