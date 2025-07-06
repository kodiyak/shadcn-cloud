import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { useMemo } from 'react';

interface ObjectType {
	type: string;
	deprecated?: boolean;
	required?: boolean;
	default?: string | number | boolean;
	description?: string;
}

interface TypeTableProps {
	type: Record<string, ObjectType>;
}

function TypeTable({ type: types }: TypeTableProps) {
	const rows = useMemo(() => {
		return Object.entries(types).map(([type, props]) => ({
			name: type,
			...props,
		}));
	}, [types]);
	return (
		<Table className="w-full">
			<TableHeader>
				<TableRow>
					<TableHead className="w-[200]">Prop</TableHead>
					<TableHead>Type</TableHead>
					<TableHead className="w-[150]">Default</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row) => (
					<TableRow className="bg-background/50" key={row.type}>
						<TableCell>
							<code className="text-xs px-1 py-0.5 bg-muted text-yellow-600 border border-border rounded-md">
								{row.name}
								{((row.required && row.default !== undefined) ||
									!row.required) &&
									'?'}
							</code>
						</TableCell>
						<TableCell>
							<code className="text-xs px-1 py-0.5 bg-muted/70 border rounded-md">
								{row.type}
							</code>
						</TableCell>
						<TableCell>
							{row.default !== undefined ? (
								<code className="text-xs px-1 py-0.5 bg-muted/70 border rounded-md">
									{row.default.toString()}
								</code>
							) : (
								'-'
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}

export { TypeTable };
