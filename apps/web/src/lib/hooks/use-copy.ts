import { useCallback, useEffect, useRef, useState } from 'react';

type UseCopyReturn = [boolean, (text: string) => Promise<void>];

function useCopy(delaySeconds = 2.5): UseCopyReturn {
	const [copied, setCopied] = useState<boolean>(false);
	const timeoutRef = useRef<number | null>(null);

	const copyToClipboard = useCallback(
		async (text: string) => {
			try {
				await navigator.clipboard.writeText(text);
				setCopied(true);
				if (timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				timeoutRef.current = window.setTimeout(() => {
					setCopied(false);
				}, delaySeconds * 1000);
			} catch (err) {
				console.error('Failed to copy: ', err);
				setCopied(false);
			}
		},
		[delaySeconds],
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return [copied, copyToClipboard];
}

export default useCopy;
