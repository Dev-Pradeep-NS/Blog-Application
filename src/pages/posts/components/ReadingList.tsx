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
			<img src={article.featuredImage_url ? getImageUrl(article.featuredImage_url) : ''} alt={article.title} className="w-20 h-20 object-cover rounded-lg" />
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
				? <MdBookmarkAdded size={18} />
				: <MdOutlineBookmarkAdd size={18} />
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
		<div className="font-med place-self-center container mx-auto my-8 px-6 max-w-3xl">
			<div className="flex flex-row justify-between items-center bg-white p-4 rounded-lg">
				<div className="flex items-center">
					<div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-base font-bold text-white">
						{user?.username?.charAt(0).toUpperCase()}
					</div>
					<div className="ml-4">
						<h2 className="text-lg font-semibold text-gray-800">{user?.username}</h2>
						<h1 className="text-xs">{user?.created_at ? formatDate(user.created_at) : ''} - {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}</h1>
					</div>
				</div>
			</div>

			<h1 className="text-base font-bold text-gray-800 my-4">Reading list</h1>

			<div className="grid gap-6">
				{filteredPosts.map((article) => (
					<div key={article.id} className="bg-white rounded-lg shadow-md p-4 flex flex-row">
						<div className="flex-grow">
							<div className="mb-3">
								<Link to={`/@${article.user.username}/${article.slug}`} className="flex-grow">
									<h3 className="text-base font-semibold mb-2 text-gray-800">{article.title}</h3>
									<p className="text-xs text-gray-600 mb-3">{article.description}</p>
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