'use client';

import { HeartIcon } from '@phosphor-icons/react';
import PageLayout from '@/components/layouts/page-layout';

export default function Page() {
	return (
		<PageLayout
			icon={<HeartIcon weight="fill" />}
			title={'Favorites'}
		></PageLayout>
	);
}
