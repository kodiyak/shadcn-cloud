import { create } from 'zustand';
import { backendClient } from '../clients/backend';
import type { Like } from '../domain';
import { localLikes } from '../utils';
import { useAuthStore } from './use-auth-store';

interface LikesStore {
	likedItems: Like[];
	addLike: (itemId: string) => void;
	removeLike: (itemId: string) => void;
	toggleLike: (itemId: string) => void;
}

export const useLikesStore = create<LikesStore>()((set, get) => ({
	likedItems: [],
	addLike: async (itemId: string) => {
		localLikes.add(itemId);
		set(() => ({ likedItems: localLikes.getAll() }));
	},
	removeLike: async (itemId: string) => {
		localLikes.remove(itemId);
		set(() => ({ likedItems: localLikes.getAll() }));
	},
	toggleLike: (itemId) => {
		if (get().likedItems.some((item) => item.componentId === itemId)) {
			get().removeLike(itemId);
		} else {
			get().addLike(itemId);
		}
	},
}));

export function initializeLikesStore() {
	if (typeof window === 'undefined') {
		console.warn('useLikesStore should only be used in a browser context');
		return;
	}

	const localLikedItems = localLikes.getAll();
	useLikesStore.setState({
		likedItems: localLikedItems,
	});
	console.log('Likes Store initialized with:', localLikes.getAll());
	useAuthStore.subscribe(
		(state) => state.user,
		async (user) => {
			const userId = user?.id;
			const localLikedItems = localLikes.getAll();
			if (!userId) {
				console.warn('User not authenticated. Using local likes only.');
				useLikesStore.setState({
					addLike: async (itemId: string) => {
						localLikes.add(itemId);
						useLikesStore.setState(() => ({ likedItems: localLikes.getAll() }));
					},
					removeLike: async (itemId: string) => {
						localLikes.remove(itemId);
						useLikesStore.setState(() => ({ likedItems: localLikes.getAll() }));
					},
				});

				return;
			}

			useLikesStore.setState({
				addLike: async (itemId: string) => {
					await backendClient.likes.saveBatch({
						likedItems: [{ componentId: itemId, timestamp: Date.now() }],
					});
				},
				removeLike: async (itemId: string) => {
					await backendClient.likes.deleteBatch({
						likedItems: [itemId],
					});
				},
			});

			const { likedItems } = useLikesStore.getState();
			if (localLikedItems.length > 0) {
				console.log(
					`Syncing ${localLikedItems.length} local likes for user ${userId}`,
				);
				await backendClient.likes.saveBatch({ likedItems });
				// localLikes.clear();
			}
		},
	);
}
