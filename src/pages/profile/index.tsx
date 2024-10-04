import type React from "react";
import { useState, useEffect } from "react";
import { usePostStore, useUserStore } from "../../store";
import {
	useFollowUser,
	useUnFollowUser,
	useUpdateProfile,
	useUserDetailsById,
	useUserFollowers,
	useUserFollowing,
} from "../../utils/hooks/useUserdetails";
import { useAuth } from "../../utils/hooks/AuthContext";
import { Link, useParams } from "react-router-dom";
import type { User } from "../../interfaces";
import formatDate from "../../utils/helpers/formatDate";
import useImageUrls from "../../utils/helpers/getImageUrl";

export default function ProfilePage() {
	const { getImageUrl, getAvatarUrl } = useImageUrls();
	const [isEditing, setIsEditing] = useState(false);
	const [showFollowers, setShowFollowers] = useState(false);
	const [showFollowing, setShowFollowing] = useState(false);
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || "";
	const { username } = useParams();
	const { data: user, refetch } = useUserDetailsById(server_url, token, username?.replace("@", ""));
	const { user: currentUser } = useUserStore();
	const [profile, setProfile] = useState({
		username: "",
		email: "",
		bio: "",
		avatar_url: ""
	});

	useEffect(() => {
		if (user && username) {
			refetch()
			setProfile({
				username: user.username,
				email: user.email,
				bio: user.bio,
				avatar_url: user.avatar_url
			});
			setShowFollowers(false);
			setShowFollowing(false)
		}
	}, [user, username, refetch]);

	const { postData } = usePostStore();
	const userPosts = postData.filter((item) => item.user_id === user?.id);
	const { data: followers } = useUserFollowers(
		server_url,
		user ? user?.id : 0,
		token,
	);
	const { data: following } = useUserFollowing(
		server_url,
		user ? user?.id : 0,
		token,
	);
	const { mutate: updateUser } = useUpdateProfile(
		server_url,
		token,
		user ? user.id : 0,
		profile.username,
		profile.email,
		profile.bio,
	);

	const isFollowing = followers?.followers ? followers?.followers.some((item) => item.id === currentUser?.id) : null;

	const { mutate: followUser } = useFollowUser(server_url, user ? user?.id : 0, token);
	const { mutate: unfollowUser } = useUnFollowUser(server_url, user ? user.id : 0, token);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
	}

	const handleSave = () => {
		updateUser(undefined, {
			onSuccess: () => {
				setIsEditing(false);
			},
			onError: (error) => {
				console.error("Failed to update profile:", error);
			},
		});
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setProfile((prevProfile) => ({
			...prevProfile,
			[name]: value,
		}));
	};

	return (
		<div className="min-h-screen bg-white py-4 sm:py-8 px-2 sm:px-4 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="mb-6 sm:mb-8">
					<div className="flex flex-col sm:flex-row items-center mb-4">
						<img src={profile.avatar_url ? getAvatarUrl(profile.avatar_url) : '/logo.png'} alt="avatar" className="w-20 h-20 rounded-full mb-4 sm:mb-0 sm:mr-4" />
						<div className="text-center sm:text-left flex-grow">
							{isEditing ? (
								<input
									type="text"
									name="username"
									value={profile.username}
									onChange={handleChange}
									className="text-xl sm:text-2xl font-bold mb-1 w-full border border-gray-300 focus:outline-none focus:border-gray-500"
								/>
							) : (
								<h2 className="text-xl sm:text-2xl font-bold mb-1">@{profile.username}</h2>
							)}

							<div className="text-sm text-gray-600 mb-2">
								{isEditing ? (
									<input
										type="email"
										name="email"
										value={profile.email}
										onChange={handleChange}
										className="w-full border rounded-sm border-gray-300 focus:outline-none focus:border-gray-500"
									/>
								) : (
									<p>{profile.email}</p>
								)}
							</div>

							<div className="mb-4">
								{isEditing ? (
									<textarea
										name="bio"
										value={profile.bio}
										onChange={handleChange}
										className="w-full h-24 p-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
									/>
								) : (
									<p className="text-sm text-gray-600">{profile.bio}</p>
								)}
							</div>

							<div className="flex justify-center sm:justify-start space-x-4 text-sm">
								<button type="button" onClick={() => { setShowFollowers(!showFollowers); setShowFollowing(false); }} className="hover:text-blue-600">
									{followers?.followers?.length || 0} Followers
								</button>
								<button type="button" onClick={() => { setShowFollowing(!showFollowing); setShowFollowers(false); }} className="hover:text-blue-600">
									{following?.following?.length || 0} Following
								</button>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4 sm:mt-0">
							{isEditing ? (
								<>
									<button
										type="button"
										onClick={handleSave}
										className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition w-full sm:w-auto"
									>
										Save
									</button>
									<button
										type="button"
										onClick={handleCancel}
										className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition w-full sm:w-auto"
									>
										Cancel
									</button>
								</>
							) : (
								<>
									{currentUser?.id === user?.id ? (
										<button
											type="button"
											onClick={handleEdit}
											className="px-4 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition w-full sm:w-auto"
										>
											Edit Profile
										</button>
									) : (
										isFollowing ? (
											<button
												type="button"
												onClick={() => unfollowUser()}
												className="px-4 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition w-full sm:w-auto"
											>
												Following
											</button>
										) : (
											<button
												type="button"
												onClick={() => followUser()}
												className="px-4 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition w-full sm:w-auto"
											>
												Follow
											</button>
										)

									)}
								</>
							)}
						</div>
					</div>

					{showFollowers && (
						<div className="mb-6 bg-white rounded-lg shadow-md p-4">
							<h4 className="font-semibold mb-3 text-lg border-b pb-2">Followers</h4>
							{followers?.followers?.length ? (
								<ul className="space-y-3">
									{followers.followers.slice(0, 5).map((follower: User) => (
										<li key={follower.id}>
											<Link to={`/@${follower.username}`} className="flex items-center hover:bg-gray-50 p-2 rounded-md transition duration-150 ease-in-out">
												<img
													src={follower.avatar_url ? getAvatarUrl(follower.avatar_url) : '/logo.png'}
													alt=""
													className="w-10 h-10 rounded-full mr-3 object-cover"
												/>
												<p className="font-medium text-gray-700 hover:text-blue-600">@{follower.username}</p>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-gray-500 italic">No followers yet.</p>
							)}
						</div>
					)}

					{showFollowing && (
						<div className="mb-6 bg-white rounded-lg shadow-md p-4">
							<h4 className="font-semibold mb-3 text-lg border-b pb-2">Following</h4>
							{following?.following?.length ? (
								<ul className="space-y-3">
									{following.following.slice(0, 5).map((followedUser: User) => (
										<li key={followedUser.id}>
											<Link to={`/@${followedUser.username}`} className="flex items-center hover:bg-gray-50 p-2 rounded-md transition duration-150 ease-in-out">
												<img
													src={followedUser.avatar_url ? getAvatarUrl(followedUser.avatar_url) : '/logo.png'}
													alt=""
													className="w-10 h-10 rounded-full mr-3 object-cover"
												/>
												<p className="font-medium text-gray-700 hover:text-blue-600">@{followedUser.username}</p>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<p className="text-sm text-gray-500 italic">Not following anyone yet.</p>
							)}
						</div>
					)}
				</div>

				<div className="border-t border-gray-200 pt-6 sm:pt-8">
					<h3 className="text-lg font-semibold mb-4">Latest</h3>
					<div className="space-y-6 sm:space-y-8">
						{userPosts.length > 0 ?
							userPosts.map((item) => (
								<Link key={item.id} to={`/@${item.user.username}/${item.slug}`} className='block'>
									<div className='flex flex-col sm:flex-row items-start'>
										<div className='flex-1 mb-2 sm:mb-0'>
											<h4 className='font-semibold text-base mb-1'>{item.title}</h4>
											<p className='text-sm text-gray-600 mb-2'>{item.description}</p>
											<div className='flex items-center text-xs text-gray-500'>
												<span>{formatDate(item.created_at)}</span>
												<span className="mx-1">·</span>
												<span>5 min read</span>
											</div>
										</div>
										{item.featuredImage_url && <img src={getImageUrl(item.featuredImage_url)} alt="featured" className='w-full sm:w-20 h-40 sm:h-20 object-cover sm:ml-4 mt-2 sm:mt-0' />}
									</div>
								</Link>
							))
							: <p>No Posts were published by this user</p>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
