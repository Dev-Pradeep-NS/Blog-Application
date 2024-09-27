import { useEffect, useState } from 'react';
import { useBookmarkPost, useBookmarks } from '../../../utils/hooks/useBookmarks';
import { useAuth } from '../../../utils/hooks/AuthContext';
import { usePost } from '../../../utils/hooks/usePosts';
import { useUserStore } from '../../../store';
import useImageUrls from '../../../utils/helpers/getImageUrl';
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { MdBookmarkAdded } from "react-icons/md";
import formatDate from '../../../utils/helpers/formatDate';
import type { Bookmark, ItemType, User } from '../../../interfaces';
import { Link } from 'react-router-dom';

const ImageData = ({ article, user, bookmarkData, id }: { article: ItemType; user: User; bookmarkData: Bookmark[]; id: number }) => {
	const { getImageUrl } = useImageUrls();
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const { mutate: bookmarkPost } = useBookmarkPost(server_url, id, token)


	return (
		<div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 flex flex-row sm:flex-col justify-between items-center">
			<img src={article.featuredImage_url ? getImageUrl(article.featuredImage_url) : ''} alt={article.title} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mb-0 sm:mb-2" />
			<button type='button' onClick={() => bookmarkPost()} className='focus:outline-none mt-2 sm:mt-0'>
				{bookmarkData?.some((item: Bookmark) => item.user_id === user?.id && item.post_id === article.id)
					? <MdBookmarkAdded size={24} />
					: <MdOutlineBookmarkAdd size={24} />
				}
			</button>
		</div>
	)
}

const ReadingList = () => {
	const [filteredPosts, setFilteredPosts] = useState<ItemType[]>([]);
	const { user } = useUserStore();
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const { isLoading: bookmarkLoading, error: bookmarkError, data: bookmarkData } = useBookmarks(server_url, token);
	const { isLoading: postsLoading, error: postsError, data: postData } = usePost(server_url, token);

	useEffect(() => {
		if (bookmarkData && postData) {
			const postsArray = Array.isArray(postData) ? postData : [postData];
			const bookmarkedPosts = postsArray.filter((post: ItemType) =>
				bookmarkData.some((bookmark: Bookmark) => bookmark.post_id === post.id && bookmark.user_id === user?.id)
			);
			setFilteredPosts(bookmarkedPosts);
		}
	}, [bookmarkData, postData, user]);

	if (bookmarkLoading || postsLoading) return <div>Loading...</div>;
	if (bookmarkError || postsError) return <div>Error loading data.</div>;

	return (
		<div className="font-cas place-self-center container mx-auto my-4 sm:my-6 md:my-8 lg:my-10 px-2 sm:px-4 md:px-6 lg:px-8 max-w-4xl">
			{/* Profile Section */}
			<div className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 sm:p-4 md:p-6 rounded-lg">
				<div className="flex items-center mb-2 sm:mb-0">
					<div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-300 rounded-full flex items-center justify-center text-base sm:text-lg md:text-xl font-bold text-white">
						{user?.username?.charAt(0).toUpperCase()}
					</div>
					<div className="ml-3 sm:ml-4 md:ml-5">
						<h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">{user?.username}</h2>
						<h1 className="text-xs sm:text-sm md:text-base">{user?.created_at ? formatDate(user.created_at) : ''} - {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}</h1>
					</div>
				</div>
			</div>

			<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 my-3 sm:my-4 md:my-5">Reading list</h1>

			<div className="grid gap-4 sm:gap-6 md:gap-8">
				{filteredPosts.map((article) => (
					<div key={article.id} className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row">
						<Link to={`/@${article.user.username}/${article.slug}`} className="flex-grow">
							<div className="flex-grow">
								<div className="mb-2 sm:mb-4">
									<h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 md:mb-3 text-gray-800">{article.title}</h3>
									<p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-4">{article.description}</p>
									<div className="flex flex-wrap items-center text-xs sm:text-sm md:text-base text-gray-500">
										<span>{formatDate(article.created_at)}</span>
										<span className="mx-1 sm:mx-2">•</span>
										<span>{article.view_count} views</span>
										<span className="mx-1 sm:mx-2">•</span>
										<span>{article.Comments.length} comments</span>
									</div>
								</div>
							</div>
						</Link>

						{user && <ImageData article={article} user={user} bookmarkData={bookmarkData} id={article.id} />}
					</div>
				))}
			</div>
		</div>
	);
};

export default ReadingList;
