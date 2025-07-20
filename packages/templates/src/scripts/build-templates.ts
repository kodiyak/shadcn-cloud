import {
	existsSync,
	mkdirSync,
	readdirSync,
	readFileSync,
	writeFileSync,
} from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { TemplateProps } from '@workspace/core';

const __dirname = fileURLToPath(import.meta.url);
const templatesDir = resolve(__dirname, './../../base');
const ignoreDirs = ['scripts'];
const outputDir = resolve(
	__dirname,
	'../../../../../apps/web/src/lib/templates.json',
);

async function main() {
	console.log('Building templates...');
	const files = readdirSync(templatesDir).filter(
		(node) => !ignoreDirs.includes(node),
	);

	const templates: TemplateProps[] = [];

	for (const file of files) {
		templates.push(loadTemplate(file));
	}

	if (templates.length === 0) {
		console.warn('No templates found');
	} else {
		console.log(`Found ${templates.length} templates`);

		if (!existsSync(dirname(outputDir))) {
			mkdirSync(dirname(outputDir), { recursive: true });
		}
		writeFileSync(outputDir, JSON.stringify(templates, null, 2));
	}
}

function loadTemplate(name: string): TemplateProps {
	const path = resolve(templatesDir, name);
	const metadata: TemplateProps = JSON.parse(
		readFileSync(join(path, 'metadata.json'), 'utf-8'),
	);
	const files = new Map<string, string>();
	readFilesRecursively(path, files);
	metadata.files = Object.fromEntries(files);

	return metadata;
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
				.join('/');
			const content = readFileSync(fullPath, 'utf-8');
			console.log(
				`+ FILE [${templateSlug}]: ${relativePath} (${content.length} bytes)`,
			);
			files.set(`/${relativePath}`, content);
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
