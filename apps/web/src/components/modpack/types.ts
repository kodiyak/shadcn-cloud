export interface ModpackLog {
	message: string;
	level: 'error' | 'warn' | 'info' | 'debug';
	timestamp: string;
	source: 'runtime' | 'build' | 'modpack' | 'ui' | 'api';
	category: string;
	metadata?: Record<string, any>;
}
