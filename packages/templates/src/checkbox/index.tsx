import type { InputHTMLAttributes } from "react";

export default function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
	return <input type="checkbox" {...props} />;
}
