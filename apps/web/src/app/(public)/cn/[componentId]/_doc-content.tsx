export default function DocContent() {
	return (
		<div className="flex flex-col min-h-[3000]">
			<div className="flex gap-12 max-w-4xl min-h-full items-stretch mx-auto w-full py-12">
				<div className="flex-1 flex-col">
					<h1 className="text-2xl font-bold"># Component Documentation</h1>
				</div>
				<div className="w-1/5 flex flex-col">
					<div className="sticky top-12">
						<span className="text-xs text-muted-foreground font-mono">
							Table of Contents
						</span>
						{/* List of Sections */}
					</div>
				</div>
			</div>
		</div>
	);
}
