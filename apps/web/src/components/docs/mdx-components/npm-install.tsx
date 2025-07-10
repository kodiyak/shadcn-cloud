import { CodeBlock } from '@/components/code-block';
import CopyButton from '@/components/copy-button';
import { Tab, Tabs } from './tabs';

interface NpmInstallProps {
	packages: string[];
}

export function NpmInstall({ packages }: NpmInstallProps) {
	const installs = [
		{ name: 'npm', command: `npm i ${packages.join(' ')}` },
		{ name: 'yarn', command: `yarn add ${packages.join(' ')}` },
		{ name: 'pnpm', command: `pnpm i ${packages.join(' ')}` },
		{ name: 'bun', command: `bun add ${packages.join(' ')}` },
	];

	return (
		<Tabs className="relative" items={installs.map((install) => install.name)}>
			{installs.map((install) => (
				<Tab key={install.name} value={install.name}>
					<CopyButton
						className="absolute right-2 top-1 z-50"
						content={install.command}
						size={'icon-sm'}
						variant={'ghost'}
					/>
					<CodeBlock
						className="text-sm [&>pre]:bg-transparent!"
						code={install.command}
						lang={'bash'}
					/>
				</Tab>
			))}
		</Tabs>
	);
}
