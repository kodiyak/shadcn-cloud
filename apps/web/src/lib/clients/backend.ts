import { type ForkProps, forkSchema } from '../domain';

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
};
