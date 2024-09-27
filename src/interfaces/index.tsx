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
	Comments: Comment[],
	LikesandDislikes: Reaction[],
	user: {
		avatar_url: string,
		username: string,
		email: string,
		bio: string,
		created_at: string
	},
	created_at: string,
	featuredImage_url: string,
}

interface PostData {
	title: string;
	description: string;
	content: string;
	status: string;
	category: string;
	tags: string;
	image?: File;
}

interface User {
	id: number,
	username: string,
	email: string,
	bio: string,
	avatar_url: string,
	created_at: string
}

interface Follower {
	followers: User[]
}

interface Following {
	following: User[]
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

interface IFormInput {
	username: string;
	email: string;
	password: string;
	confirm_password: string;
}

interface IResetPasswordInput {
	email: string;
	oldPassword: string;
	newPassword: string;
}

export type {
	ItemType, User, Follower, Following, Reaction, Bookmark, Comments, IFormInput, PostData, IResetPasswordInput
}
