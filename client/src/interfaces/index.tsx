interface ItemType {
	id: number,
	title: string,
	description: string,
	content: string,
	user_id: number,
	category: string,
	tags: Array<string>,
	slug: string,
	status: string,
	view_count: number,
	comments: Array<string>,
	LikesandDislikes: Array<string>,
	user: {
		avatar_url: string,
		username: string,
		email: string,
		bio: string,
	},
	created_at: string,
	featuredImage_url: string,
}

interface User {
	id: number,
	username: string,
	avatar_url: string
}

interface Follower {
	followers: number
}

interface Reaction {
	id: number,
	user_id: number,
	post_id: number,
	reaction_type: string
}

interface Bookmark {
	id: number,
	user_id: number,
	post_id: number,
}

interface Comment {
	id: number;
	comment: string;
	user_id: number;
	username: string;
	post_id: number;
	parent_id: number;
	replies: Reply[];
	created_at: string;
}

interface Reply {
	id: number;
	comment: string;
	user_id: number;
	username: string;
	post_id: number;
	parent_id: number;
	created_at: string;
}

interface Comments {
	comments: Comment[];
	count: number;
}

export type {
	ItemType, User, Follower, Reaction, Bookmark, Comments
}
