import { jwtClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { backendClient } from './clients/backend';
import { useAuthStore } from './store';

export const authClient = createAuthClient({
	plugins: [usernameClient(), jwtClient()],
	fetchOptions: {
		onSuccess(context) {
			if (context.data?.user) {
				useAuthStore.setState({
					user: context.data.user as any,
					isPending: false,
				});
			} else {
				useAuthStore.setState({
					user: null,
					isPending: false,
				});
			}
		},
		auth: {
			type: 'Bearer',
			token: () => backendClient.getToken(),
		},
	},
});
