import { create } from 'zustand';

interface LikesStore {
	likedItems: string[];
	addLike: (itemId: string) => void;
	removeLike: (itemId: string) => void;
	isLiked: (itemId: string) => boolean;
	toggleLike: (itemId: string) => void;
}

const STORAGE_KEY = 'likedItems';

export const useLikesStore = create<LikesStore>()((set, get) => ({
	likedItems: [],
	addLike: (itemId) => {
		const currentLikes = get().likedItems;
		if (!currentLikes.includes(itemId)) {
			const updatedLikes = [...currentLikes, itemId];
			set({ likedItems: updatedLikes });
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLikes));
		}
	},
	removeLike: (itemId) => {
		const currentLikes = get().likedItems;
		if (currentLikes.includes(itemId)) {
			const updatedLikes = currentLikes.filter((id) => id !== itemId);
			set({ likedItems: updatedLikes });
			localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLikes));
		}
	},
	isLiked: (itemId) => get().likedItems.includes(itemId),
	toggleLike: (itemId) => {
		if (get().isLiked(itemId)) {
			get().removeLike(itemId);
		} else {
			get().addLike(itemId);
		}
	},
}));

function loadFromLocalStorage(): string[] {
	try {
		const storedLikes = localStorage.getItem(STORAGE_KEY);
		return storedLikes ? JSON.parse(storedLikes) : [];
	} catch (error) {
		console.error('Failed to load likes from localStorage:', error);
		return [];
	}
}

function main() {
	const localLikedItems = loadFromLocalStorage();
	useLikesStore.setState({
		likedItems: localLikedItems,
	});
}

main();
