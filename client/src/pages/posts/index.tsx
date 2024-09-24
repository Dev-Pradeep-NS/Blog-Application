import { useMemo, useEffect, useState } from 'react';
import RandomPost from './components/RandomPost';
import NavBar from '../../components/common/NavBar';
import Posts from './components/PostCard';
import LatestPosts from './components/LatestPosts';
import { usePost } from '../../utils/hooks/usePosts';
import { useUserDetails, useUserFollowers } from '../../utils/hooks/useUserdetails';
import { useAuth } from '../../utils/hooks/AuthContext';
import CategoryPosts from './components/CategoryPosts';
import { useFollowerStore, usePostStore, useUserStore } from '../../store';

const PostPage = () => {
	const { token } = useAuth();
	const [isReady, setIsReady] = useState(false);
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const { setUserData } = useUserStore();
	const { setFollowerData } = useFollowerStore();

	const { isLoading: postsLoading, error: postsError, data: postData } = usePost(isReady ? server_url : '', isReady ? token : '');
	const { isLoading: userLoading, error: userError, data: userData } = useUserDetails(isReady ? server_url : '', isReady ? token : '');
	const user_id = userData?.id ?? 0;
	const { isLoading: followersLoading, error: followersError, data: followers } = useUserFollowers(isReady ? server_url : '', user_id, isReady ? token : '');

	useEffect(() => {
		if (token) {
			setIsReady(true);
		}
	}, [token]);

	const memoizedPostList = useMemo(() => Array.isArray(postData) ? postData : [], [postData]);
	const memoizedUserData = useMemo(() => userData, [userData]);
	const memoizedFollowers = useMemo(() => followers, [followers]);

	useEffect(() => {
		if (memoizedUserData) {
			setUserData(memoizedUserData);
		} if (memoizedFollowers) {
			setFollowerData(memoizedFollowers)
		}
	}, [memoizedUserData, setUserData, setFollowerData, memoizedFollowers]);

	if (!token) return <div className="p-2 sm:p-4 text-sm sm:text-base">Loading access token...</div>;
	if (!isReady) return <div className="p-2 sm:p-4 text-sm sm:text-base">Loading data...</div>;

	if (postsLoading || userLoading || followersLoading) return <div className="p-2 sm:p-4 text-sm sm:text-base">Loading...</div>;
	if (postsError || userError || followersError) return <div className="p-2 sm:p-4 text-sm sm:text-base">An error has occurred.</div>;

	if (!memoizedUserData) return <div className="p-2 sm:p-4 text-sm sm:text-base">User data not available.</div>;
	if (!memoizedFollowers) return <div className="p-2 sm:p-4 text-sm sm:text-base">Followers data not available.</div>;

	return (
		<div className="container mx-auto font-cas mb-6 sm:mb-10 px-2 sm:px-4 md:px-6 lg:px-8">
			<NavBar />
			<hr className="my-2 sm:my-4" />
			<div className="space-y-4 sm:space-y-8">
				<RandomPost postData={memoizedPostList} />
				<Posts postData={memoizedPostList} length={3} />
				<h1 className='mt-3 sm:mt-5 font-light text-lg sm:text-xl md:text-2xl'>For Writers and Editors</h1>
				<hr className="my-2 sm:my-4" />
				<Posts postData={memoizedPostList} length={memoizedPostList.length} />
				<h1 className='mt-6 sm:mt-8 md:mt-10 font-light text-lg sm:text-xl md:text-2xl'>Latest</h1>
				<LatestPosts postData={memoizedPostList} user={memoizedUserData} followers={memoizedFollowers} />
			</div>
		</div>
	);
}

export default PostPage;
