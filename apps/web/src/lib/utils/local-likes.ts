import type { Like } from '../domain';

const KEY = 'likedItems';

export const localLikes = {
	KEY,
	getAll(): Like[] {
		try {
			const storedLikes = localStorage.getItem(KEY);
			return storedLikes ? JSON.parse(storedLikes) : [];
		} catch (error) {
			console.error('Failed to Load LocalStorage Likes:', error);
			return [];
		}
	},
	remove(itemId: string): void {
		const currentLikes = this.getAll();
		const updatedLikes = currentLikes.filter(
			(item) => item.componentId !== itemId,
		);
		localStorage.setItem(KEY, JSON.stringify(updatedLikes));
	},
	add(itemId: string): void {
		const currentLikes = this.getAll();
		if (!currentLikes.some((item) => item.componentId === itemId)) {
			const updatedLikes = [
				...currentLikes,
				{ componentId: itemId, timestamp: Date.now() },
			];
			localStorage.setItem(KEY, JSON.stringify(updatedLikes));
		}
	},
	clear(): void {
		localStorage.removeItem(KEY);
	},
	isLiked(itemId: string): boolean {
		return this.getAll().some((item) => item.componentId === itemId);
	},
	toggle(itemId: string): void {
		if (this.isLiked(itemId)) {
			this.remove(itemId);
		} else {
			this.add(itemId);
		}
	},
};
