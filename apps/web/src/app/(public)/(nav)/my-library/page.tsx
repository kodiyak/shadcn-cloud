'use client';

import { LibraryIcon } from 'lucide-react';
import PageLayout from '@/components/layouts/page-layout';

export default function Page() {
	return <PageLayout icon={<LibraryIcon />} title={'My Library'}></PageLayout>;
}
