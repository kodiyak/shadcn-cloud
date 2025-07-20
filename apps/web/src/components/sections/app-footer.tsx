import { Button } from '@workspace/ui/components/button';
import Link from 'next/link';

export default function AppFooter() {
	return (
		<div className="border-t bg-background">
			<div className="container mx-auto border-x flex flex-col">
				<div className="grid grid-cols-6 gap-6 px-12 py-8">
					{[
						{
							label: 'Useful Links',
							links: [
								{
									label: 'Explore',
									href: '/',
								},
								{
									label: 'My Library',
									href: '/my-library',
								},
								{
									label: 'Liked Components',
									href: '/favorites',
								},
								{
									label: 'Create Component',
									href: '/templates',
								},
							],
						},
						{
							label: 'Resources',
							links: [
								{
									label: 'Documentation',
									href: '/resources/docs',
								},
								{
									label: 'Changelog',
									href: '/resources/changelog',
								},
								{
									label: 'Support',
									href: '/resources/support',
								},
							],
						},
						{
							label: 'Community',
							links: [
								{
									label: 'Discord',
									href: '/social/discord',
								},
								{
									label: 'GitHub',
									href: '/social/github',
								},
								{
									label: 'X',
									href: '/social/x',
								},
							],
						},
					].map((section) => (
						<div className="flex flex-col" key={section.label}>
							<h3 className="text-sm font-semibold mb-2 font-mono">
								{section.label}
							</h3>
							{section.links.map((link) => (
								<Button
									asChild
									className="text-left justify-start text-xs font-mono h-auto py-1 px-0 w-min justify-self-start"
									key={link.label}
									size={'sm'}
									variant={'link'}
								>
									<Link href={link.href}>{link.label}</Link>
								</Button>
							))}
						</div>
					))}
				</div>
				<div className="flex items-center h-14 justify-center border-t px-8">
					<p className="text-xs text-muted-foreground font-medium">
						<span>© {new Date().getFullYear()} Shadcn Cloud. </span>
						<span>
							Made with ❤️ by{' '}
							<Link
								className="text-foreground underline"
								href="https://github.com/kodiyak"
								target="_blank"
							>
								kodiyak
							</Link>
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}
