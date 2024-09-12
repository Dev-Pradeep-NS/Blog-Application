interface ItemType {
	id: number,
	title: string,
	description: string,
	user: {
		avatar_url: string,
		username: string,
	},
	created_at: string,
	featuredImage_url: string
}

interface User {
	id: number,
	username: string,
	avatar_url: string
}

interface Follower {
	followers: number
}

export type {
	ItemType, User, Follower
}