import { useDisLikePost, useLikePost } from "../../../utils/hooks/useReactions";
import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import { SocialIcon } from "react-social-icons";
import type { ItemType, Reaction, Bookmark } from "../../../interfaces";
import { useBookmarkPost, useBookmarks } from "../../../utils/hooks/useBookmarks";
import { useAuth } from "../../../utils/hooks/AuthContext";

import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { MdBookmarkAdded } from "react-icons/md";
import { useEffect, useMemo, useState } from "react";
import { usePost } from "../../../utils/hooks/usePosts";
import { useUserDetails, useUserFollowers } from "../../../utils/hooks/useUserdetails";
import { Link, useNavigate, useParams } from "react-router-dom";
import readingTime from "../../../utils/helpers/readingTime";

const PostItem = ({ id, isLiked, isDisliked, commentCount, likeCount, dislikeCount, isBookmarked }: { id: number, isLiked: boolean, isDisliked: boolean, commentCount: number, likeCount: number, dislikeCount: number, isBookmarked: boolean }) => {
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const { mutate: likePost } = useLikePost(server_url, id, token);
	const { mutate: dislikePost } = useDisLikePost(server_url, id, token);
	const { mutate: bookmarkPost } = useBookmarkPost(server_url, id, token)

	return (
		<div className='flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0'>
			<div className='flex items-center space-x-4'>
				<button type="button" onClick={() => likePost()} className='focus:outline-none'>
					{!isLiked ? <BiLike size={16} /> : <BiSolidLike size={16} />}
				</button>
				<h1>{likeCount}</h1>
				<button type="button" onClick={() => dislikePost()} className='focus:outline-none'>
					{!isDisliked ? <BiDislike size={16} /> : <BiSolidDislike size={16} />}
				</button>
				<h1>{dislikeCount}</h1>
			</div>
			<div className='flex items-center space-x-4'>
				<button type="button">
					<h1 className="text-sm">{commentCount} responses</h1>
				</button>
				<button type='button' onClick={() => bookmarkPost()} className='focus:outline-none'>
					{isBookmarked ? <MdBookmarkAdded size={16} /> : <MdOutlineBookmarkAdd size={16} />}
				</button>
			</div>
		</div>
	)
}

const CategoryPosts = () => {
	const { token } = useAuth();
	const [isReady, setIsReady] = useState<boolean>(false);
	const { category } = useParams();
	const navigate = useNavigate();
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const { getImageUrl, getAvatarUrl } = useImageUrls();
	const { isLoading: postsLoading, error: postsError, data: postData } = usePost(isReady ? server_url : '', isReady ? token : '');
	const { isLoading: userLoading, error: userError, data: user } = useUserDetails(isReady ? server_url : '', isReady ? token : '');
	const user_id = user?.id ?? 0;
	const { isLoading: followersLoading, error: followersError, data: followers } = useUserFollowers(isReady ? server_url : '', user_id, isReady ? token : '');
	const { isLoading: bookmarkLoading, error: bookmarkError, data: bookmarkData } = useBookmarks(server_url, token);
	const memoizedBookmarkData = useMemo(() => bookmarkData, [bookmarkData])

	useEffect(() => {
		if (token) {
			setIsReady(true);
		}
	}, [token]);

	useEffect(() => {
		if (category) {
			setSelectedCategory(category);
		}
	}, [category]);

	const memoizedPostList = useMemo(() => Array.isArray(postData) ? postData : [], [postData]);
	const memoizedUserData = useMemo(() => user, [user]);
	const memoizedFollowers = useMemo(() => followers, [followers]);

	const filteredData = useMemo(() => {
		const now = new Date();
		const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
		startOfWeek.setHours(0, 0, 0, 0);

		if (selectedCategory === 'latest') {
			return memoizedPostList
		}
		if (selectedCategory === 'trending') {
			console.log("here")
			return memoizedPostList.filter(item => new Date(item.created_at) >= startOfWeek);
		}
		if (selectedCategory) {
			return memoizedPostList.filter(item => item.category === selectedCategory);
		}
		return memoizedPostList;
	}, [memoizedPostList, selectedCategory]);

	const handleCategoryClick = (category: string) => {
		navigate(`/category/${category}`);
	};

	if (!token) return <div className="p-2 sm:p-4 text-sm sm:text-base">Loading access token...</div>;
	if (!isReady) return <div className="p-2 sm:p-4 text-sm sm:text-base">Loading data...</div>;

	if (postsLoading || userLoading || followersLoading || bookmarkLoading) return <div className="p-2 sm:p-4 text-sm sm:text-base">Loading...</div>;
	if (postsError || userError || followersError || bookmarkError) return <div className="p-2 sm:p-4 text-sm sm:text-base">An error has occurred.</div>;

	if (!memoizedUserData) return <div className="p-2 sm:p-4 text-sm sm:text-base">User data not available.</div>;
	if (!memoizedFollowers) return <div className="p-2 sm:p-4 text-sm sm:text-base">Followers data not available.</div>;

	return (
		<div className="mt-4">
			<div className="flex flex-wrap font-semibold">
				<button onClick={() => handleCategoryClick('latest')} type="button" className="mr-2 mb-2 p-1.5 cursor-pointer text-sm">
					Latest
					<div className="h-0.5 bg-gray-500 mt-0.5 transition-all duration-300 ease-in-out" style={{ width: selectedCategory === 'latest' ? '100%' : '0%' }} />
				</button>
				<button onClick={() => handleCategoryClick('trending')} type="button" className="mr-2 mb-2 p-1.5 cursor-pointer text-sm">
					Trending
					<div className="h-0.5 bg-gray-500 mt-0.5 transition-all duration-300 ease-in-out" style={{ width: selectedCategory === 'trending' ? '100%' : '0%' }} />
				</button>
				<button onClick={() => handleCategoryClick('technology')} type="button" className="mr-2 mb-2 p-1.5 cursor-pointer text-sm">
					Technology
					<div className="h-0.5 bg-gray-500 mt-0.5 transition-all duration-300 ease-in-out" style={{ width: selectedCategory === 'technology' ? '100%' : '0%' }} />
				</button>
				<button onClick={() => handleCategoryClick('lifestyle')} type="button" className="mr-2 mb-2 p-1.5 cursor-pointer text-sm">
					Lifestyle
					<div className="h-0.5 bg-gray-500 mt-0.5 transition-all duration-300 ease-in-out" style={{ width: selectedCategory === 'lifestyle' ? '100%' : '0%' }} />
				</button>
				<button onClick={() => handleCategoryClick('travel')} type="button" className="mr-2 mb-2 p-1.5 cursor-pointer text-sm">
					Travel
					<div className="h-0.5 bg-gray-500 mt-0.5 transition-all duration-300 ease-in-out" style={{ width: selectedCategory === 'travel' ? '100%' : '0%' }} />
				</button>
				<button onClick={() => handleCategoryClick('food')} type="button" className="mr-2 mb-2 p-1.5 cursor-pointer text-sm">
					Food
					<div className="h-0.5 bg-gray-500 mt-0.5 transition-all duration-300 ease-in-out" style={{ width: selectedCategory === 'food' ? '100%' : '0%' }} />
				</button>
				<button onClick={() => handleCategoryClick('other')} type="button" className="mr-2 mb-2 p-1.5 cursor-pointer text-sm">
					Other
					<div className="h-0.5 bg-gray-500 mt-0.5 transition-all duration-300 ease-in-out" style={{ width: selectedCategory === 'other' ? '100%' : '0%' }} />
				</button>
			</div>
			<div className='flex flex-col lg:flex-row'>
				<div className='w-full lg:w-2/3'>
					<hr />
					<div className='flex flex-col mx-3 lg:ml-8 '>
						{filteredData && filteredData.length > 0 ? (
							filteredData.map((item: ItemType) => {
								const commentCount = item.Comments.filter(i => i.parent_id === null).length;
								const likeCount = item?.LikesandDislikes?.filter(item => item.reaction_type === 'like').length;
								const dislikeCount = item?.LikesandDislikes?.filter(item => item.reaction_type === 'dislike').length;
								const isLiked = item?.LikesandDislikes.some((reaction: Reaction) => reaction.reaction_type === 'like' && reaction.user_id === user?.id)
								const isDisliked = item?.LikesandDislikes.some((reaction: Reaction) => reaction.user_id === user?.id && reaction.reaction_type === 'dislike')
								const isBookmarked = memoizedBookmarkData?.some((bookmark: Bookmark) => bookmark.user_id === user?.id && bookmark.post_id === item.id)

								return (
									<div key={item.id} className='my-0'>
										<div className='mb-4 mr-4 flex flex-col'>
											<Link to={`/@${item.user.username}`} className='flex flex-row my-4 items-center relative group'>
												<img src={item.user.avatar_url ? getAvatarUrl(item.user.avatar_url) : '/specwiselogo.png'} alt="" width={40} height={40} className="rounded-full mr-3 object-cover" />
												<div className="hidden group-hover:block absolute bottom-full left-0 mb-2 bg-white text-gray-900 text-xs rounded-lg p-3 shadow-xl whitespace-normal w-40 max-w-xs z-10">
													<p className="font-semibold text-sm text-center">{item.user.username}</p>
													<p className="text-gray-500 text-xxs text-center">{formatDate(item.user.created_at)}</p>
													<p className="text-gray-700 mt-1 text-center overflow-ellipsis overflow-hidden max-h-14">{item.user.bio || "No bio available"}</p>
												</div>
												<p className='text-xs'>{item.user.username}<br />{formatDate(item.created_at)} - {readingTime(item.content)} read</p>
											</Link>
											<img src={item.featuredImage_url ? getImageUrl(item.featuredImage_url) : '/specwiselogo.png'} alt="" className='h-32 sm:h-40 lg:h-48 w-full object-cover mb-3' />
											<Link to={`/@${item.user.username}/${item.slug}`} className='hover:underline'>
												<h1 className='font-semibold text-sm mb-1.5'>{item.title}</h1>
											</Link>
											<p className='mb-3 text-sm'>{item.description}</p>
											<PostItem
												id={item.id}
												isLiked={isLiked}
												isDisliked={isDisliked}
												commentCount={commentCount}
												likeCount={likeCount}
												dislikeCount={dislikeCount}
												isBookmarked={isBookmarked}
											/>
										</div>
										<hr />
									</div>
								)
							})
						) : (
							<div className="p-3 text-center text-gray-500 text-sm">No posts available for {category} category.</div>
						)}
					</div>
				</div>
				<div className='w-full lg:w-1/3 mt-6 lg:mt-0 lg:ml-6 px-3 '>
					<div className='flex flex-row items-center mb-3'>
						<img src={memoizedUserData.avatar_url ? getAvatarUrl(memoizedUserData?.avatar_url) : '/specwiselogo.png'} alt="" width={40} height={40} className="rounded-full mr-3 object-cover" />
						<p className='text-xs font-semibold'>The {memoizedUserData?.username} Blog</p>
					</div>
					<p className='text-xs mb-1.5'>The official Specwise Blogs.</p>
					<p className='text-xs mb-1.5 text-green-500 cursor-pointer hover:underline'>More information</p>
					<p className='mb-1.5 text-xs'>Followers - {memoizedFollowers?.followers ? memoizedFollowers?.followers.length : 0}</p>
					<p className='mb-1.5 font-semibold text-xs'>ELSEWHERE</p>
					<div className='flex space-x-1.5'>
						<SocialIcon url='https://www.facebook.com' style={{ height: 20, width: 20 }} />
						<SocialIcon url='https://www.linkedin.com' style={{ height: 20, width: 20 }} />
					</div>
				</div>
			</div>
		</div>
	)
}
export default CategoryPosts