'use client';

import { BookmarksIcon } from '@phosphor-icons/react';
import PageLayout from '@/components/layouts/page-layout';

export default function Page() {
	return (
		<PageLayout
			icon={<BookmarksIcon weight="fill" />}
			title={'Bookmarks'}
		></PageLayout>
	);
}
