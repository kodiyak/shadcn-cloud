import type { InputHTMLAttributes } from 'react';

export default function Checkbox({
	children,
	...props
}: InputHTMLAttributes<HTMLInputElement>) {
	return (
		<label className="flex items-center gap-1 text-sm">
			<input type="checkbox" {...props} />
			<span className="text-muted-foreground font-medium">{children}</span>
		</label>
	);
}
