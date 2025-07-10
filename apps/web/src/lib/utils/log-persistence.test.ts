import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { saveLogsToStorage, loadLogsFromStorage, clearLogsFromStorage } from './log-persistence';
import type { ModpackLog } from '@/components/modpack/types';

// Mock localStorage
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
	value: mockLocalStorage,
	writable: true,
});

// Mock window for the functions
Object.defineProperty(global, 'window', {
	value: {
		localStorage: mockLocalStorage,
	},
	writable: true,
});

describe('log-persistence', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('saveLogsToStorage', () => {
		it('should save logs to localStorage', () => {
			const mockLogs: ModpackLog[] = [
				{
					message: 'Test log message',
					level: 'info',
					timestamp: '2023-01-01T00:00:00.000Z',
					source: 'modpack',
					category: 'test',
					metadata: { key: 'value' },
				},
			];

			saveLogsToStorage(mockLogs);

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				'modpack-logs',
				JSON.stringify(mockLogs)
			);
		});

		it('should handle empty logs array', () => {
			saveLogsToStorage([]);

			expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
				'modpack-logs',
				JSON.stringify([])
			);
		});

		it('should limit logs to MAX_STORED_LOGS', () => {
			const mockLogs: ModpackLog[] = Array.from({ length: 1500 }, (_, i) => ({
				message: `Test log ${i}`,
				level: 'info' as const,
				timestamp: new Date().toISOString(),
				source: 'modpack' as const,
				category: 'test',
				metadata: {},
			}));

			saveLogsToStorage(mockLogs);

			const savedLogs = JSON.parse(
				(mockLocalStorage.setItem as any).mock.calls[0][1]
			);
			expect(savedLogs).toHaveLength(1000);
		});
	});

	describe('loadLogsFromStorage', () => {
		it('should load logs from localStorage', () => {
			const mockLogs: ModpackLog[] = [
				{
					message: 'Test log message',
					level: 'info',
					timestamp: '2023-01-01T00:00:00.000Z',
					source: 'modpack',
					category: 'test',
					metadata: { key: 'value' },
				},
			];

			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockLogs));

			const result = loadLogsFromStorage();

			expect(result).toEqual(mockLogs);
		});

		it('should return empty array if no logs in storage', () => {
			mockLocalStorage.getItem.mockReturnValue(null);

			const result = loadLogsFromStorage();

			expect(result).toEqual([]);
		});

		it('should filter out invalid logs', () => {
			const invalidLogs = [
				{
					message: 'Valid log',
					level: 'info',
					timestamp: '2023-01-01T00:00:00.000Z',
					source: 'modpack',
					category: 'test',
					metadata: {},
				},
				{
					message: 'Invalid log - missing fields',
					level: 'info',
					// missing timestamp, source, category
				},
				null,
				undefined,
				'not an object',
			];

			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(invalidLogs));

			const result = loadLogsFromStorage();

			expect(result).toHaveLength(1);
			expect(result[0].message).toBe('Valid log');
		});

		it('should handle localStorage errors gracefully', () => {
			mockLocalStorage.getItem.mockImplementation(() => {
				throw new Error('localStorage error');
			});

			const result = loadLogsFromStorage();

			expect(result).toEqual([]);
		});
	});

	describe('clearLogsFromStorage', () => {
		it('should remove logs from localStorage', () => {
			clearLogsFromStorage();

			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('modpack-logs');
		});

		it('should handle localStorage errors gracefully', () => {
			mockLocalStorage.removeItem.mockImplementation(() => {
				throw new Error('localStorage error');
			});

			expect(() => clearLogsFromStorage()).not.toThrow();
		});
	});
});