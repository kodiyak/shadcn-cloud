import type { ModpackLog } from '@/components/modpack/types';

const LOG_STORAGE_KEY = 'modpack-logs';
const MAX_STORED_LOGS = 1000;

export function saveLogsToStorage(logs: ModpackLog[]): void {
	try {
		// Keep only the most recent logs to avoid storage bloat
		const logsToStore = logs.slice(-MAX_STORED_LOGS);
		localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logsToStore));
	} catch (error) {
		console.warn('Failed to save logs to localStorage:', error);
	}
}

export function loadLogsFromStorage(): ModpackLog[] {
	try {
		const stored = localStorage.getItem(LOG_STORAGE_KEY);
		if (!stored) return [];
		
		const logs = JSON.parse(stored) as ModpackLog[];
		// Validate that logs have the expected structure
		return logs.filter(log => 
			log && 
			typeof log.message === 'string' &&
			typeof log.level === 'string' &&
			typeof log.timestamp === 'string' &&
			typeof log.source === 'string' &&
			typeof log.category === 'string'
		);
	} catch (error) {
		console.warn('Failed to load logs from localStorage:', error);
		return [];
	}
}

export function clearLogsFromStorage(): void {
	try {
		localStorage.removeItem(LOG_STORAGE_KEY);
	} catch (error) {
		console.warn('Failed to clear logs from localStorage:', error);
	}
}