import type { UseModpackReturn } from './hooks/use-modpack';

export default function ModpackRender({
	Component,
	compile,
	files,
	isCompiling,
	modpack,
}: UseModpackReturn) {
	return <>{Component && <Component key={'compiled.component'} />}</>;
}
