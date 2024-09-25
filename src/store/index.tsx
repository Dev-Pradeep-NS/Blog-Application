import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, ItemType, Follower } from "../interfaces";

interface PostState {
	postData: ItemType[];
	setPostData: (data: ItemType[]) => void;
}

interface UserState {
	user: User | null;
	setUserData: (data: User) => void;
}

interface FollowerState {
	followers: Follower | null;
	setFollowerData: (data: Follower) => void;
}

export const usePostStore = create<PostState>()(
	persist(
		(set) => ({
			postData: [],
			setPostData: (data: ItemType[]) => set({ postData: data }),
		}),
		{
			name: "post-storage",
		}
	)
);

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			setUserData: (data: User) => set({ user: data })
		}),
		{
			name: "user-storage",
		}
	)
);

export const useFollowerStore = create<FollowerState>()(
	persist(
		(set) => ({
			followers: null,
			setFollowerData: (data: Follower) => set({ followers: data })
		}),
		{
			name: "follower-storage",
		}
	)
);