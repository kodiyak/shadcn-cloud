import type { SwcOptions } from '@modpack/swc';

export function buildDependenciesExtractor() {
	const exports = new Map<string, string[]>();
	const imports = new Map<string, Map<string, string[]>>();
	const onParse: SwcOptions['onParse'] = ({ url, parsed }) => {
		for (const node of parsed.body) {
			const addExports = (...exportsList: string[]) => {
				exports.set(
					url,
					Array.from(new Set([...(exports.get(url) || []), ...exportsList])),
				);
			};
			const addImports = (path: string, importsList: string[]) => {
				if (imports.has(url)) {
					imports
						.get(url)
						?.set(
							path,
							Array.from(
								new Set([
									...(imports.get(url)?.get(path) || []),
									...importsList,
								]),
							),
						);
				} else {
					imports.set(url, new Map([[path, Array.from(new Set(importsList))]]));
				}
			};
			if (
				node.type === 'ExpressionStatement' &&
				node.expression.type === 'AssignmentExpression' &&
				node.expression.operator === '=' &&
				node.expression.left.type === 'MemberExpression' &&
				node.expression.left.object.type === 'Identifier' &&
				node.expression.left.object.value === 'module' &&
				node.expression.left.property.type === 'Identifier' &&
				node.expression.left.property.value === 'exports'
			) {
				addExports('default');
			}

			if (node.type === 'ExportNamedDeclaration') {
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ExportSpecifier') {
						addExports(specifier.orig.value);
					} else if (specifier.type === 'ExportDefaultSpecifier') {
						addExports(specifier.exported.value);
					}
				}
			}

			if (node.type === 'ExportAllDeclaration') {
				if (node.source.value) {
					addExports(node.source.value);
				} else {
					addExports('default');
				}
			}

			if (node.type === 'ExportDeclaration') {
				if (
					node.declaration.type === 'FunctionDeclaration' ||
					node.declaration.type === 'ClassDeclaration'
				) {
					addExports(node.declaration.identifier.value);
				}
			}

			if (node.type === 'ImportDeclaration') {
				addImports(
					node.source.value,
					node.specifiers.map((specifier) => {
						switch (specifier.type) {
							case 'ImportSpecifier':
								return specifier.local.value;
							case 'ImportDefaultSpecifier':
								return 'default';
							case 'ImportNamespaceSpecifier':
								return '*';
							default:
								return '';
						}
					}),
				);
			}
		}
	};

	const onTransform: SwcOptions['onTransform'] = (props) => {};

	return {
		onParse,
		onTransform,
		getExports: () => exports,
		getImports: () => imports,
	};
}
