import {
	type DeleteLikesBatchSchema,
	type ForkProps,
	forkSchema,
	type Like,
	type SaveLikesBatchSchema,
} from '../domain';
import { localLikes } from '../utils';

function getToken() {
	return localStorage.getItem('auth_token') || undefined;
}

export const backendClient = {
	getToken,
	setToken: (token: string) => {
		localStorage.setItem('auth_token', token);
	},
	fork: async (props: ForkProps) => {
		return fetch(`/api/fork`, {
			body: JSON.stringify(forkSchema.parse(props)),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${getToken()}`,
			},
		}).then((res) => res.json());
	},
	likes: {
		getAll: async (): Promise<{ data: Like[] }> => {
			const likes = localLikes.getAll();
			const url = new URL('/api/likes', window.location.origin);
			url.searchParams.set(
				'localLikes',
				likes.map((l) => l.componentId).join(','),
			);
			console.log(url);
			return fetch(`${url.pathname}${url.search}`, {
				headers: {
					Authorization: `Bearer ${getToken()}`,
				},
			}).then((res) => res.json());
		},
		saveBatch: async (props: SaveLikesBatchSchema) => {
			return fetch(`/api/likes/batch`, {
				body: JSON.stringify(props),
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getToken()}`,
				},
			}).then((res) => res.json());
		},
		deleteBatch: async (props: DeleteLikesBatchSchema) => {
			return fetch(`/api/likes/batch`, {
				body: JSON.stringify(props),
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getToken()}`,
				},
			}).then((res) => res.json());
		},
	},
};
