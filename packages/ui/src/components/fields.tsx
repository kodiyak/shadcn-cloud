import type { SelectContentProps } from '@radix-ui/react-select';
import React, { forwardRef, type HTMLProps, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import type { ButtonProps } from './button';
import { Checkbox } from './checkbox';
import {
	FormControl,
	FormDescription,
	FormItem,
	FormLabel,
	FormMessage,
} from './form';
import { Input } from './input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './select';
import { Switch } from './switch';
import { Textarea } from './textarea';

export type IFieldOptionValue = string;
export interface IFieldOption {
	label: string;
	description?: string;
	value: IFieldOptionValue;
	icon?: ReactNode;
}

export interface FieldWrapProps extends React.HTMLAttributes<HTMLDivElement> {
	label?: ReactNode;
	left?: ReactNode;
	description?: string;
	orientation?: 'horizontal' | 'vertical';
	actions?: ReactNode[];
}
const FieldWrap = React.forwardRef<HTMLDivElement, FieldWrapProps>(
	(
		{
			className,
			children,
			label,
			description,
			left,
			orientation = 'vertical',
			actions,
			...rest
		},
		ref,
	) => {
		return (
			<FormItem
				className={cn(
					'',
					orientation === 'horizontal' && 'flex items-start gap-1',
					orientation === 'vertical' && '',
					className,
				)}
				ref={ref}
				{...rest}
			>
				{(!!label || !!description) && (
					<FormLabel
						className={cn(
							'flex select-none',
							orientation === 'horizontal' && 'flex-1',
							orientation === 'vertical' && '',
						)}
					>
						{left}
						<div className="flex flex-1 flex-col">
							{label && (
								<span className="text-[11px] uppercase text-foreground font-medium tracking-widest">
									{label}
								</span>
							)}
							{description && orientation === 'horizontal' && (
								<FormDescription className="text-xs mt-1.5 font-normal leading-3">
									{description}
								</FormDescription>
							)}
						</div>
						{actions}
					</FormLabel>
				)}
				{orientation === 'horizontal' && (
					<div className="flex flex-col">
						<FormControl>{children}</FormControl>
						<FormMessage />
					</div>
				)}
				{orientation === 'vertical' && (
					<>
						<FormControl className="mt-2">{children}</FormControl>
						<FormMessage />
						{description && (
							<FormDescription className="text-xs mt-1.5 px-2 font-normal leading-3">
								{description}
							</FormDescription>
						)}
					</>
				)}
			</FormItem>
		);
	},
);
FieldWrap.displayName = 'FieldWrap';

export interface InputFieldProps {
	value?: string | null;
	onChange?: (value: string) => void;
	onBlur?: () => void;
	className?: string;
	placeholder?: string;
	readOnly?: boolean;
	disabled?: boolean;
	autoFocus?: boolean;
	autoComplete?: HTMLProps<HTMLInputElement>['autoComplete'];
	type?: HTMLProps<HTMLInputElement>['type'];
}
const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
	({ onChange, value, className, ...rest }, ref) => {
		return (
			<Input
				className={cn('', className)}
				onChange={(e) => onChange?.(e.target.value)}
				ref={ref}
				value={value ?? ''}
				{...rest}
			/>
		);
	},
);
InputField.displayName = 'InputField';

export interface SelectFieldProps {
	value?: string | null;
	onChange?: (value: string | null) => void;
	onBlur?: () => void;
	className?: string;
	options: IFieldOption[];
	placeholder?: React.ReactNode;
	icon?: React.ReactNode;
	nullable?: boolean;
	id?: string;
	disabled?: boolean;
	size?: ButtonProps['size'];
	_content?: Partial<SelectContentProps>;
}
const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
	(
		{
			options,
			className,
			onChange,
			onBlur,
			value,
			placeholder,
			nullable = false,
			icon,
			id,
			size = 'default',
			disabled,
			_content,
		},
		ref,
	) => {
		return (
			<Select
				disabled={disabled}
				onValueChange={(v) => {
					if (!nullable) {
						return onChange?.(v);
					}

					if (v === value) {
						return onChange?.(null);
					}

					return onChange?.(v);
				}}
				value={value ?? undefined}
			>
				<SelectTrigger
					className={cn(className)}
					id={id}
					onBlur={onBlur}
					ref={ref}
					size={size}
				>
					{icon}
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent {..._content}>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value as any}>
							{option.icon}
							<div className="flex flex-1 flex-col">
								<span>{option.label}</span>
								{option.description && (
									<span className="text-xs text-muted-foreground">
										{option.description}
									</span>
								)}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		);
	},
);
SelectField.displayName = 'SelectField';

export interface TextareaFieldProps {
	value?: string | null;
	onChange?: (value: string) => void;
	onBlur?: () => void;
	className?: string;
	placeholder?: string;
}
const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
	({ onChange, value, className, ...rest }, ref) => {
		return (
			<Textarea
				className={cn('', className)}
				onChange={(e) => onChange?.(e.target.value)}
				ref={ref}
				value={value ?? ''}
				{...rest}
			/>
		);
	},
);
TextareaField.displayName = 'TextareaField';

interface CheckboxFieldProps {
	id?: string;
	value?: boolean;
	onChange?: (value: boolean) => void;
	className?: string;
	disabled?: boolean;
}
function CheckboxField({
	id,
	className,
	disabled,
	onChange,
	value,
}: CheckboxFieldProps) {
	return (
		<Checkbox
			checked={value}
			className={cn('', className)}
			disabled={disabled}
			id={id}
			onCheckedChange={(checked) =>
				onChange?.(checked === 'indeterminate' ? false : checked)
			}
		/>
	);
}

function SwitchField({
	id,
	className,
	disabled,
	onChange,
	value,
}: CheckboxFieldProps) {
	return (
		<Switch
			checked={value}
			className={cn('', className)}
			disabled={disabled}
			id={id}
			onCheckedChange={onChange}
		/>
	);
}

export {
	FieldWrap,
	InputField,
	TextareaField,
	SelectField,
	CheckboxField,
	SwitchField,
};
