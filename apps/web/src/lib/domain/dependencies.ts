/** `new Map(path, name[])` */
export type Exports = Map<string, string[]>;
/** `new Map(path, new Map(path, name[]))` */
export type Imports = Map<string, Map<string, string[]>>;
