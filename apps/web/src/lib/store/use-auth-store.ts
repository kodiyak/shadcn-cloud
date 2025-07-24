import type { User } from 'better-auth';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { authClient } from '../auth-client';

interface AuthStore {
	user: (User & { username: string }) | null;
	isPending: boolean;
}

export const useAuthStore = create<AuthStore>()(
	subscribeWithSelector<AuthStore>(() => ({
		user: null,
		isPending: true,
	})),
);

export async function initializeAuthStore() {
	if (typeof window === 'undefined') {
		console.warn('useAuthStore should only be used in a browser context');
		return;
	}

	const { data } = await authClient.getSession();
	if (data?.user) {
		useAuthStore.setState({
			isPending: false,
			user: data.user as AuthStore['user'],
		});
	} else {
		useAuthStore.setState({ isPending: false, user: null });
	}
}
