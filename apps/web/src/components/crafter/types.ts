export interface FileProps {
	type: "file";
	path: string;
	content: string;
}

export interface DirectoryProps {
	type: "directory";
	path: string;
	children: FileOrDirectory[];
}

type FileOrDirectory = FileProps | DirectoryProps;
