import { Editor } from '@monaco-editor/react';
import { appConfig } from '@/app.config';
import type { CompileComponentResult } from '@/lib/services';

interface PublishRegistryProps extends CompileComponentResult {}

export default function PublishRegistry({ registry }: PublishRegistryProps) {
	return (
		<div className="size-full rounded-b-xl overflow-hidden">
			<Editor
				className={'size-full !font-code'}
				language={'json'}
				options={{
					...appConfig.editorOptions,
					readOnly: true,
				}}
				theme={'default'}
				value={JSON.stringify(registry, null, 2)}
			/>
		</div>
	);
}
