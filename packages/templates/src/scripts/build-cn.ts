import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(import.meta.url);
const templatesDir = resolve(__dirname, './../../cn');
const ignoreDirs = ['scripts'];
const outputDir = resolve(__dirname, '../../../../../apps/web/src/lib/cn.json');

async function main() {
	console.log('Building templates...');
	const cnFiles = readdirSync(templatesDir).filter(
		(node) => !ignoreDirs.includes(node),
	);

	const output = new Map<string, string>();

	for (const cnFile of cnFiles) {
		const path = resolve(templatesDir, cnFile);
		const dirFiles = new Map<string, string>();
		readFilesRecursively(path, dirFiles);
		for (const [relativePath, content] of dirFiles.entries()) {
			output.set(`/${cnFile}/${relativePath}`.split(sep).join('/'), content);
		}
	}

	if (output.size === 0) {
		console.warn('No CN files found.');
	} else {
		console.log(`Found ${output.size} templates`);

		if (!existsSync(dirname(outputDir))) {
			mkdirSync(dirname(outputDir), { recursive: true });
		}
		writeFileSync(
			outputDir,
			JSON.stringify(Object.fromEntries(output.entries()), null, 2),
		);
	}
}

function readFilesRecursively(dir: string, files = new Map<string, string>()) {
	const entries = readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		const templateSlug = fullPath.replace(templatesDir, '').split(sep)[1];
		if (entry.isDirectory()) {
			readFilesRecursively(fullPath, files);
		} else if (entry.isFile()) {
			const relativePath = fullPath
				.replace(templatesDir, '')
				.split(sep)
				.splice(2)
				.join(sep);
			const content = readFileSync(fullPath, 'utf-8');
			console.log(
				`+ FILE [${templateSlug}]: ${relativePath} (${content.length} bytes)`,
			);
			files.set(relativePath, content);
		}
	}
}

main()
	.then(() => {
		console.log(
			[
				`Templates built successfully!`,
				`You can check the templates output at "${outputDir}"`,
			].join('\n'),
		);
	})
	.catch((error) => {
		console.error('Error building templates:', error);
		process.exit(1);
	});
