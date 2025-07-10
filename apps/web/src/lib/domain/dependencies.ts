/** `new Map(path, name[])` */
export type ExportsMap = Map<string, string[]>;
/** `new Map(path, new Map(path, name[]))` */
export type ImportsMap = Map<string, Map<string, string[]>>;

export type ExportsRecord = Record<string, string[]>;
export type ImportsRecord = Record<string, Record<string, string[]>>;
