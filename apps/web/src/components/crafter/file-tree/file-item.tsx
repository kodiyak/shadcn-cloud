import { AlignLeftSimpleIcon, TrashIcon, XIcon } from '@phosphor-icons/react';
import { Button, ButtonsIcons } from '@workspace/ui/components/button';
import { FileCodeIcon } from '@workspace/ui/components/icons';
import { useDisclosure } from '@workspace/ui/hooks/use-disclosure';
import { cn } from '@workspace/ui/lib/utils';
import { Edit2Icon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../lib/store/use-editor-store';
import { useProjectStore } from '../lib/store/use-project-store';
import type { NodeProps } from '../types';

export default function FileItem({ path, content, draftContent }: NodeProps) {
	const filename = path.split('/').pop();
	const activePath = useEditorStore((state) => state.activePath);
	const openFile = useEditorStore((state) => state.openFile);
	const openEdit = useDisclosure();

	const [updatedValue, setUpdatedValue] = useState(() => filename);
	const inputRef = useRef<HTMLInputElement>(null);

	const onCancelEdit = () => {
		openEdit.onToggle();
		setUpdatedValue(filename);
	};

	const onSaveEdit = () => {
		openEdit.onToggle();
		if (updatedValue && updatedValue !== filename) {
			useProjectStore.getState().renameNode(path, updatedValue);
		}
	};

	useEffect(() => {
		if (openEdit.isOpen) {
			setUpdatedValue(filename);
			setTimeout(() => {
				inputRef.current?.focus();
				inputRef.current?.select();
			}, 0);
		}
	}, [openEdit.isOpen]);

	return (
		<Button
			className="rounded-md w-full gap-2 justify-start relative mt-0.5 group"
			data-state={path === activePath || openEdit.isOpen ? 'open' : undefined}
			onClick={openEdit.isOpen ? undefined : () => openFile(path)}
			size={'xs'}
			variant={'ghost'}
		>
			<FileCodeIcon className="size-4" type={filename?.split('.').pop()} />
			{openEdit.isOpen ? (
				<div className="flex-1">
					<input
						className={cn(
							'w-full h-6 bg-background px-1.5 font-medium rounded-md border-none outline-none transition-all',
							'focus-visible:ring-2 focus-visible:ring-ring',
						)}
						defaultValue={filename}
						onBlur={(e) => {
							onCancelEdit();
						}}
						onChange={(e) => setUpdatedValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								if (!updatedValue || updatedValue.trim() === '') {
									console.warn('Filename cannot be empty');
									onCancelEdit();
									return;
								}
								onSaveEdit();
							}
							if (e.key === 'Escape') {
								console.warn('Edit cancelled');
								e.preventDefault();
								openEdit.onToggle();
								setUpdatedValue(filename);
							}
						}}
						ref={inputRef}
						value={updatedValue}
					/>
				</div>
			) : (
				<span className="flex-1 text-left">{filename}</span>
			)}
			{draftContent !== content && (
				<div className="size-1.5 rounded-full bg-foreground"></div>
			)}

			<div
				className={cn(
					'flex gap-0.5 items-center',
					'absolute right-2 top-1.5 z-20 opacity-0 translate-x-5 transition-all',
					'group-hover:opacity-100 group-hover:translate-x-0',
					openEdit.isOpen &&
						'opacity-100 -translate-x-2 group-hover:-translate-x-2',
				)}
			>
				<ButtonsIcons
					items={
						openEdit.isOpen
							? [
									{
										label: 'Save File',
										icon: <Edit2Icon />,
										onClick: openEdit.onToggle,
									},
									{
										label: 'Cancel',
										icon: <XIcon />,
										variant: 'destructive-ghost',
										onClick: openEdit.onToggle,
									},
								]
							: [
									{
										label: 'Rename File',
										icon: <AlignLeftSimpleIcon />,
										onClick: openEdit.onToggle,
									},
									{
										label: 'Remove File',
										icon: <TrashIcon />,
										variant: 'destructive-ghost',
									},
								]
					}
					size={'icon-xs'}
					variant={'ghost'}
				/>
			</div>
		</Button>
	);
}
