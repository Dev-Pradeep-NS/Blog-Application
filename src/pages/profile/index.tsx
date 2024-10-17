import type React from "react";
import { useState, useEffect } from "react";
import { usePostStore, useUserStore } from "../../store";
import {
	useFollowUser,
	useUnFollowUser,
	useUpdateProfile,
	useUploadProfileImage,
	useUserDetailsById,
	useUserFollowers,
	useUserFollowing,
} from "../../utils/hooks/useUserdetails";
import { useAuth } from "../../utils/hooks/AuthContext";
import { Link, useParams } from "react-router-dom";
import type { User } from "../../interfaces";
import formatDate from "../../utils/helpers/formatDate";
import ImageSet from "../../components/common/ImageSet";

export default function ProfilePage() {
	const [isEditing, setIsEditing] = useState(false);
	const [showFollowers, setShowFollowers] = useState(false);
	const [showFollowing, setShowFollowing] = useState(false);
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || window.env.REACT_APP_SERVER_URL;
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

	const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("avatar", file);

		uploadAvatar(formData);
	};

	const { mutate: uploadAvatar } = useUploadProfileImage(
		server_url,
		user ? user.id : 0,
		token
	);

	return (
		<div className="min-h-screen bg-white py-3 sm:py-6 px-2 sm:px-3 lg:px-6">
			<div className="max-w-2xl mx-auto">
				<div className="mb-4 sm:mb-6">
					<div className="flex flex-col sm:flex-row items-center mb-3">
						{isEditing ? (
							<div className="relative w-16 h-16 mb-3 sm:mb-0 sm:mr-3">
								<ImageSet source={profile.avatar_url} classname="w-16 h-16 rounded-full mb-3 sm:mb-0 sm:mr-3" />
								<label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1 cursor-pointer">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<title>upload image</title>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
									</svg>
								</label>
								<input
									id="avatar-upload"
									type="file"
									accept="image/*"
									onChange={handleAvatarUpload}
									className="hidden"
								/>
							</div>
						) : (
							<ImageSet source={profile.avatar_url} classname="w-16 h-16 rounded-full mb-3 sm:mb-0 sm:mr-3" />
						)}
						<div className="text-center sm:text-left flex-grow">
							{isEditing ? (
								<input
									type="text"
									name="username"
									value={profile.username}
									onChange={handleChange}
									className="text-lg sm:text-xl font-bold mb-1 w-full border border-gray-300 focus:outline-none focus:border-gray-500"
								/>
							) : (
								<h2 className="text-lg sm:text-xl font-bold mb-1">@{profile.username}</h2>
							)}

							<div className="text-xs sm:text-sm text-gray-600 mb-2">
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

							<div className="mb-3">
								{isEditing ? (
									<textarea
										name="bio"
										value={profile.bio}
										onChange={handleChange}
										className="w-full h-20 p-1 text-xs sm:text-sm border rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
									/>
								) : (
									<p className="text-xs sm:text-sm text-gray-600">{profile.bio}</p>
								)}
							</div>

							<div className="flex justify-center sm:justify-start space-x-3 text-xs sm:text-sm">
								<button type="button" onClick={() => { setShowFollowers(!showFollowers); setShowFollowing(false); }} className="hover:text-blue-600">
									{followers?.followers?.length || 0} Followers
								</button>
								<button type="button" onClick={() => { setShowFollowing(!showFollowing); setShowFollowers(false); }} className="hover:text-blue-600">
									{following?.following?.length || 0} Following
								</button>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-0">
							{isEditing ? (
								<>
									<button
										type="button"
										onClick={handleSave}
										className="px-3 py-1 text-xs sm:text-sm bg-green-500 text-white rounded hover:bg-green-600 transition w-full sm:w-auto"
									>
										Save
									</button>
									<button
										type="button"
										onClick={handleCancel}
										className="px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 transition w-full sm:w-auto"
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
											className="px-3 py-1 text-xs sm:text-sm border border-gray-300 rounded hover:bg-gray-100 transition w-full sm:w-auto"
										>
											Edit Profile
										</button>
									) : (
										isFollowing ? (
											<button
												type="button"
												onClick={() => unfollowUser()}
												className="px-3 py-1 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition w-full sm:w-auto"
											>
												Following
											</button>
										) : (
											<button
												type="button"
												onClick={() => followUser()}
												className="px-3 py-1 text-xs sm:text-sm bg-green-500 text-white rounded hover:bg-green-600 transition w-full sm:w-auto"
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
						<div className="mb-4 bg-white rounded-lg shadow-md p-3">
							<h4 className="font-semibold mb-2 text-base border-b pb-2">Followers</h4>
							{followers?.followers?.length ? (
								<ul className="space-y-2">
									{followers.followers.slice(0, 5).map((follower: User) => (
										<li key={follower.id}>
											<Link to={`/@${follower.username}`} className="flex items-center hover:bg-gray-50 p-1 rounded-md transition duration-150 ease-in-out">
												<ImageSet
													source={follower.avatar_url}
													classname="w-8 h-8 rounded-full mr-2 object-cover"
												/>
												<p className="font-medium text-gray-700 hover:text-blue-600 text-sm">@{follower.username}</p>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<p className="text-xs sm:text-sm text-gray-500 italic">No followers yet.</p>
							)}
						</div>
					)}

					{showFollowing && (
						<div className="mb-4 bg-white rounded-lg shadow-md p-3">
							<h4 className="font-semibold mb-2 text-base border-b pb-2">Following</h4>
							{following?.following?.length ? (
								<ul className="space-y-2">
									{following.following.slice(0, 5).map((followedUser: User) => (
										<li key={followedUser.id}>
											<Link to={`/@${followedUser.username}`} className="flex items-center hover:bg-gray-50 p-1 rounded-md transition duration-150 ease-in-out">
												<ImageSet
													source={followedUser.avatar_url}
													classname="w-8 h-8 rounded-full mr-2 object-cover"
												/>
												<p className="font-medium text-gray-700 hover:text-blue-600 text-sm">@{followedUser.username}</p>
											</Link>
										</li>
									))}
								</ul>
							) : (
								<p className="text-xs sm:text-sm text-gray-500 italic">Not following anyone yet.</p>
							)}
						</div>
					)}
				</div>

				<div className="border-t border-gray-200 pt-4 sm:pt-6">
					<h3 className="text-base font-semibold mb-3">Latest</h3>
					<div className="space-y-4 sm:space-y-6">
						{userPosts.length > 0 ?
							userPosts.map((item) => (
								<Link key={item.id} to={`/@${item.user.username}/${item.slug}`} className='block'>
									<div className='flex flex-col sm:flex-row items-start'>
										<div className='flex-1 mb-2 sm:mb-0'>
											<h4 className='font-semibold text-sm mb-1'>{item.title}</h4>
											<p className='text-xs text-gray-600 mb-1'>{item.description}</p>
											<div className='flex items-center text-xs text-gray-500'>
												<span>{formatDate(item.created_at)}</span>
												<span className="mx-1">·</span>
												<span>5 min read</span>
											</div>
										</div>
										{item.featuredImage_url && <ImageSet source={item.featuredImage_url} classname='w-full sm:w-16 h-32 sm:h-16 object-cover sm:ml-3 mt-2 sm:mt-0' />}
									</div>
								</Link>
							))
							: <p className="text-sm">No Posts were published by this user</p>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
