import { useMemo, useEffect, useState } from 'react';
import RandomPost from './components/RandomPost';
import NavBar from '../../components/common/NavBar';
import Posts from './components/PostCard';
import LatestPosts from './components/LatestPosts';
import { usePost } from '../../utils/hooks/usePosts';
import { useUserDetails, useUserFollowers } from '../../utils/hooks/useUserdetails';
import { useAuth } from '../../utils/hooks/AuthContext';
import { useUserStore } from '../../store';
import { getEnvVariable } from '../../utils/helpers/getEnvVariable';

const PostPage = () => {
	const { token } = useAuth();
	const [isReady, setIsReady] = useState(false);
	const { setUserData } = useUserStore()
	const server_url = getEnvVariable('REACT_APP_SERVER_URL') || "https://specwise-server.onrender.com";
	const { isLoading: postsLoading, error: postsError, data: postData } = usePost(isReady ? server_url : '', isReady ? token : '');
	const { isLoading: userLoading, error: userError, data: userData } = useUserDetails(isReady ? server_url : '', isReady ? token : '');
	const user_id = userData?.id ?? 0;
	const { isLoading: followersLoading, error: followersError, data: followers } = useUserFollowers(isReady ? server_url : '', user_id, isReady ? token : '');

	useEffect(() => {
		if (token) {
			setIsReady(true);
		}
	}, [token]);

	useEffect(() => {
		console.log(userData)
		if (userData)
			setUserData(userData)
	}, [userData, setUserData])

	const memoizedPostList = useMemo(() => Array.isArray(postData) ? postData : [], [postData]);
	const memoizedUserData = useMemo(() => userData, [userData]);
	const memoizedFollowers = useMemo(() => followers, [followers]);

	if (!token) return <div className="p-2 sm:p-4 text-sm sm:text-base">Loading access token...</div>;
	if (!isReady) return <div className="p-2 sm:p-4 text-sm sm:text-base">Loading data...</div>;

	if (postsLoading || userLoading || followersLoading)
		return <div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
			<span className='sr-only'>Loading...</span>
			<div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]' />
			<div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]' />
			<div className='h-8 w-8 bg-black rounded-full animate-bounce' />
		</div>;

	if (postsError || userError || followersError) return <div className="p-2 sm:p-4 text-sm sm:text-base">An error has occurred.</div>;

	if (!memoizedUserData) return <div className="p-2 sm:p-4 text-sm sm:text-base">User data not available.</div>;
	if (!memoizedFollowers) return <div className="p-2 sm:p-4 text-sm sm:text-base">Followers data not available.</div>;

	return (
		<div className="container mx-auto mb-6 sm:mb-10 max-w-screen-lg">
			<NavBar />
			<hr className="sm:my-4" />
			{memoizedPostList.length <= 0 ?
				<div className="p-2 sm:p-4 text-sm sm:text-base">No Posts are published yet.</div>
				:
				<div className="space-y-4 sm:space-y-8">
					<RandomPost postData={memoizedPostList} />
					<Posts postData={memoizedPostList} length={3} isUser={false} />
					<h1 className='pl-3 lg:pl-0 font-light text-base sm:text-xl md:text-xl underline'>For Writers and Editors</h1>
					<Posts postData={memoizedPostList} length={memoizedPostList.length} isUser={true} />
					<h1 className='pl-3 lg:pl-0 font-light text-base sm:text-xl md:text-xl underline'>Latest</h1>
					<LatestPosts postData={memoizedPostList} user={memoizedUserData} followers={memoizedFollowers} />
				</div>}
			<footer className="mt-8 text-center text-sm text-gray-500">
				© {new Date().getFullYear()} Specwise Blogs. All rights reserved.
			</footer>
		</div>
	);
}

export default PostPage;
