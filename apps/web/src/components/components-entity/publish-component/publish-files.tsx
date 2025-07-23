import { SwitchField } from '@workspace/ui/components/fields';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { Input } from '@workspace/ui/components/input';
import type { CompileComponentResult } from '@/lib/services';

interface PublishFilesProps extends CompileComponentResult {}

export default function PublishFiles({ registry }: PublishFilesProps) {
	return (
		<div className="flex flex-col py-4 gap-2">
			<span className="text-xs font-mono text-muted-foreground font-medium">
				Files
			</span>
			{(registry.files ?? []).map((file) => (
				<div className="flex flex-col" key={file.path}>
					<div className="flex items-center gap-1 relative">
						<div className="flex items-center gap-1 absolute left-0 px-2">
							<FileCodeIcon
								className="size-4"
								type={file.path.split('.').pop() ?? ''}
							/>
							<SwitchField />
						</div>
						<Input
							className={
								'text-xs flex-1 h-auto rounded-md font-medium font-mono pl-16!'
							}
							value={file.path}
						/>
					</div>
				</div>
			))}
		</div>
	);
}
