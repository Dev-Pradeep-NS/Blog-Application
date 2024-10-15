import { useEffect, useState } from 'react';
import { useBookmarkPost, useBookmarks } from '../../../utils/hooks/useBookmarks';
import { useAuth } from '../../../utils/hooks/AuthContext';
import { usePost } from '../../../utils/hooks/usePosts';
import { useUserStore } from '../../../store';
import useImageUrls from '../../../utils/helpers/getImageUrl';
import { MdOutlineBookmarkAdd, MdBookmarkAdded } from "react-icons/md";
import formatDate from '../../../utils/helpers/formatDate';
import type { Bookmark, ItemType, User } from '../../../interfaces';
import { Link } from 'react-router-dom';

const ImageData = ({ article }: { article: ItemType }) => {
	const { getImageUrl } = useImageUrls();
	return (
		<div className="mt-2 ml-4 flex-shrink-0">
			<img src={article.featuredImage_url ? getImageUrl(article.featuredImage_url) : ''} alt={article.title} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" />
		</div>
	)
}

const BookmarkButton = ({ article, user, bookmarkData }: { article: ItemType; user: User; bookmarkData: Bookmark[] }) => {
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const { mutate: bookmarkPost } = useBookmarkPost(server_url, article.id, token)
	return (
		<button type='button' onClick={() => bookmarkPost()} className='focus:outline-none ml-2'>
			{bookmarkData?.some((item: Bookmark) => item.user_id === user?.id && item.post_id === article.id)
				? <MdBookmarkAdded size={16} className="sm:text-lg" />
				: <MdOutlineBookmarkAdd size={16} className="sm:text-lg" />
			}
		</button>
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
		<div className="font-med place-self-center container mx-auto my-4 sm:my-8 px-3 sm:px-6 max-w-3xl">
			<div className="flex flex-row justify-between items-center bg-white p-3 sm:p-4 rounded-lg">
				<div className="flex items-center">
					<div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center text-sm sm:text-base font-bold text-white">
						{user?.username?.charAt(0).toUpperCase()}
					</div>
					<div className="ml-3 sm:ml-4">
						<h2 className="text-base sm:text-lg font-semibold text-gray-800">{user?.username}</h2>
						<h1 className="text-xs">{user?.created_at ? formatDate(user.created_at) : ''} - {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}</h1>
					</div>
				</div>
			</div>

			<h1 className="text-sm sm:text-base font-bold text-gray-800 my-3 sm:my-4">Reading list</h1>

			<div className="grid gap-4 sm:gap-6">
				{filteredPosts.map((article) => (
					<div key={article.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex flex-row">
						<div className="flex-grow">
							<div className="mb-2 sm:mb-3">
								<Link to={`/@${article.user.username}/${article.slug}`} className="flex-grow">
									<h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 text-gray-800">{article.title}</h3>
									<p className="text-xs text-gray-600 mb-2 sm:mb-3">{article.description}</p>
								</Link>
								<div className="flex flex-wrap items-center text-xs">
									<span>{formatDate(article.created_at)}</span>
									<span className="mx-1">•</span>
									<span>{article.view_count} views</span>
									<span className="mx-1">•</span>
									<span>{article.Comments.length} comments</span>
									<div className='ml-auto'>
										{user && <BookmarkButton article={article} user={user} bookmarkData={bookmarkData} />}
									</div>
								</div>
							</div>
						</div>
						<ImageData article={article} />
					</div>
				))}
			</div>
		</div>
	);
};

export default ReadingList;