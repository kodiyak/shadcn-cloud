export interface NodeProps {
	type: 'file' | 'directory';
	path: string;
	content: string;
	draftContent: string;
	isDirty?: boolean;
	isReadOnly?: boolean;
	items?: NodeProps[];
}
