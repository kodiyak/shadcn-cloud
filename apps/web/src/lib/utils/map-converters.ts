import type {
	ExportsMap,
	ExportsRecord,
	ImportsMap,
	ImportsRecord,
} from '../domain';

function exportsMapToRecord(exports: ExportsMap): ExportsRecord {
	return Object.fromEntries(exports.entries());
}

function importsMapToRecord(imports: ImportsMap): ImportsRecord {
	return Object.fromEntries(
		Array.from(imports.entries()).map(([key, value]) => [
			key,
			Object.fromEntries(value.entries()),
		]),
	);
}

function importsRecordToMap(
	imports: Record<string, Record<string, string[]>>,
): ImportsMap {
	return new Map(
		Object.entries(imports).map(([key, value]) => [
			key,
			new Map(Object.entries(value)),
		]),
	);
}

function exportsRecordToMap(exports: Record<string, string[]>): ExportsMap {
	return new Map(Object.entries(exports));
}

export {
	exportsMapToRecord,
	importsMapToRecord,
	importsRecordToMap,
	exportsRecordToMap,
};
