import { createAuthClient } from 'better-auth/react';
import { backendClient } from './clients/backend';

export const authClient = createAuthClient({
  fetchOptions: {
    auth: {
      type: 'Bearer',
      token: () => backendClient.getToken(),
    },
  },
});
