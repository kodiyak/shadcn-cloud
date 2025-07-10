import { z } from 'zod';

/** `new Map(path, name[])` */
export type ExportsMap = Map<string, string[]>;
/** `new Map(path, new Map(path, name[]))` */
export type ImportsMap = Map<string, Map<string, string[]>>;

// export type ExportsRecord = Record<string, string[]>;
// export type ImportsRecord = Record<string, Record<string, string[]>>;

export const importsRecordSchema = z.record(z.record(z.array(z.string())));
export type ImportsRecord = z.infer<typeof importsRecordSchema>;
export const exportsRecordSchema = z.record(z.array(z.string()));
export type ExportsRecord = z.infer<typeof exportsRecordSchema>;

export const sourceMapSchema = z.object({
	imports: importsRecordSchema,
	exports: exportsRecordSchema,
});
export type SourceMap = z.infer<typeof sourceMapSchema>;
