import axios from 'axios';
import type { PackageJson } from '../domain';

export async function getExternalPackage(
	packageName: string,
): Promise<PackageJson | null> {
	const potentialPackages = [packageName];
	if (packageName.split('/').length > 1) {
		potentialPackages.push(packageName.split('/')[0]);
	}

	const results = await Promise.all(
		potentialPackages.map((pkg) => fetchEsm(pkg)),
	);

	return results.find((pkg) => pkg) || null;
}

async function fetchEsm(packageName: string): Promise<PackageJson | null> {
	return axios
		.get<PackageJson>(`https://esm.sh/${packageName}/package.json`, {
			responseType: 'json',
		})
		.then((res) => res.data)
		.then((data) => {
			if (!data.name || !data.version) {
				throw new Error('Invalid package data');
			}
			return data;
		})
		.catch(() => null);
}
