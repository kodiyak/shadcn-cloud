export function isUrl(value: string) {
	if (typeof value !== 'string') return false;
	try {
		new URL(value);
		return true;
	} catch {
		return false;
	}
}
