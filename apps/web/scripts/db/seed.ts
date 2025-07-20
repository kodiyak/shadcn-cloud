import { db } from '@/lib/clients/db';
import templatesJson from '@/lib/templates.json';

async function main() {
	const ownerEmail = 'mathewsto51@gmail.com';
	console.log(`Seeding database for owner: ${ownerEmail}`);
	const user = await db.user.findUnique({
		where: { email: ownerEmail },
	});

	if (!user) {
		console.error(`User with email ${ownerEmail} not found.`);
		return;
	}

	const existingComponents = await db.component.findMany({
		where: { userId: user.id, name: { in: templatesJson.map((t) => t.title) } },
		select: { id: true, name: true },
	});

	await db.component.deleteMany({
		where: { id: { in: existingComponents.map((c) => c.id) } },
	});

	for (const templateJson of templatesJson) {
		const { id: componentId } = await db.component.create({
			data: {
				name: templateJson.title,
				description: templateJson.description,
				user: { connect: { id: user.id } },
				files: templateJson.files,
				metadata: JSON.parse(templateJson.files['/metadata.json'] || '{}'),
				dependencies: [],
				registryDependencies: [],
				isTemplate: true,
				isForkable: true,
				status: 'published',
			},
		});

		console.log(`+ [${templateJson.title}] Created with ID ${componentId}`);
	}

	console.log('Database seeding completed successfully.');
}

main();
