import { jwtClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { backendClient } from './clients/backend';

export const authClient = createAuthClient({
	plugins: [usernameClient(), jwtClient()],
	fetchOptions: {
		auth: {
			type: 'Bearer',
			token: () => backendClient.getToken(),
		},
	},
});
