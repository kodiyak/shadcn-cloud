import { db } from '@/lib/clients/db';
import templatesJson from '@/lib/templates.json';

async function seedCollections(userId: string) {
	const data = [
		{ name: 'Accordions', slug: 'accordions', group: 'ui', userId },
		{ name: 'Alerts', slug: 'alerts', group: 'ui', userId },
		{ name: 'Avatars', slug: 'avatars', group: 'ui', userId },
		{ name: 'Badges', slug: 'badges', group: 'ui', userId },
		{ name: 'Buttons', slug: 'buttons', group: 'ui', userId },
		{ name: 'Calendars', slug: 'calendars', group: 'ui', userId },
		{ name: 'Cards', slug: 'cards', group: 'ui', userId },
		{ name: 'Carousels', slug: 'carousels', group: 'ui', userId },
		{ name: 'Checkboxes', slug: 'checkboxes', group: 'ui', userId },
		{ name: 'Data Pickers', slug: 'data-pickers', group: 'ui', userId },
		{ name: 'Dialogs/Modals', slug: 'dialogs-modals', group: 'ui', userId },
		{ name: 'Dropdowns', slug: 'dropdowns', group: 'ui', userId },
		{ name: 'Empty States', slug: 'empty-states', group: 'ui', userId },
		{ name: 'File Trees', slug: 'file-trees', group: 'ui', userId },
		{ name: 'File Uploads', slug: 'file-uploads', group: 'ui', userId },
		{ name: 'Forms', slug: 'forms', group: 'ui', userId },
		{ name: 'Icons', slug: 'icons', group: 'ui', userId },
		{ name: 'Inputs', slug: 'inputs', group: 'ui', userId },
		{ name: 'Links', slug: 'links', group: 'ui', userId },
		{ name: 'Menus', slug: 'menus', group: 'ui', userId },
		{ name: 'Notifications', slug: 'notifications', group: 'ui', userId },
		{ name: 'Numbers', slug: 'numbers', group: 'ui', userId },
		{ name: 'Paginations', slug: 'paginations', group: 'ui', userId },
		{ name: 'Popovers', slug: 'popovers', group: 'ui', userId },
		{ name: 'Radio Groups', slug: 'radio-groups', group: 'ui', userId },
		{ name: 'Selects', slug: 'selects', group: 'ui', userId },
		{ name: 'Sidebars', slug: 'sidebars', group: 'ui', userId },
		{ name: 'Sign Ins', slug: 'sign-ins', group: 'ui', userId },
		{ name: 'Sign Ups', slug: 'sign-ups', group: 'ui', userId },
		{ name: 'Sliders', slug: 'sliders', group: 'ui', userId },
		{ name: 'Spinner Loaders', slug: 'spinner-loaders', group: 'ui', userId },
		{ name: 'Tables', slug: 'tables', group: 'ui', userId },
		{ name: 'Tabs', slug: 'tabs', group: 'ui', userId },
		{ name: 'Tags', slug: 'tags', group: 'ui', userId },
		{ name: 'Text Areas', slug: 'text-areas', group: 'ui', userId },
		{ name: 'Toasts', slug: 'toasts', group: 'ui', userId },
		{ name: 'Toggles', slug: 'toggles', group: 'ui', userId },
		{ name: 'Tooltips', slug: 'tooltips', group: 'ui', userId },
	];
	await db.collection.deleteMany({
		where: { slug: { in: data.map((c) => c.slug) } },
	});
	await db.collection.createMany({ data });
}

async function seedTemplates(userId: string) {
	const existingTemplates = await db.component.findMany({
		where: { userId, isTemplate: true },
		select: { id: true, name: true },
	});

	await db.component.deleteMany({
		where: { id: { in: existingTemplates.map((t) => t.id) } },
	});

	for (const template of templatesJson) {
		const { id } = await db.component.create({
			data: {
				name: template.title,
				description: template.description,
				user: { connect: { id: userId } },
				files: template.files,
				metadata: JSON.parse(template.files['/metadata.json'] || '{}'),
				dependencies: [],
				registryDependencies: [],
				isTemplate: true,
				isForkable: true,
				status: 'published',
			},
		});
		console.log(`+ [${template.title}] Created with ID ${id}`);
	}
}

async function main() {
	const ownerEmail = 'mathewsto51@gmail.com';
	console.log(`Seeding database for owner: ${ownerEmail}`);
	const user = await db.user.findUnique({
		select: { id: true, email: true },
		where: { email: ownerEmail },
	});

	if (!user) {
		console.error(`User with email ${ownerEmail} not found.`);
		return;
	}

	console.log(`Seeding templates for owner: ${ownerEmail}`);
	await seedTemplates(user.id);

	console.log(`Seeding collections for owner: ${ownerEmail}`);
	await seedCollections(user.id);

	console.log('Database seeding completed successfully.');
}

main();
