'use client';

import { Modpack } from '@modpack/core';
import { useEffect, useRef } from 'react';

export default function ModpackProvider() {
	const loaded = useRef(false);
	const onLoad = async () => {
		await Modpack.init({});
	};

	useEffect(() => {
		if (!loaded.current) {
			loaded.current = true;
			onLoad();
		}
	}, []);

	return null;
}
