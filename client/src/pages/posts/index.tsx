import { useMemo, useEffect, useState } from 'react';
import RandomPost from './components/RandomPost';
import NavBar from '../../components/common/NavBar';
import Posts from './components/PostCard';
import LatestPosts from './components/LatestPosts';
import { usePost } from '../../utils/hooks/usePosts';
import { useUserDetails, useUserFollowers } from '../../utils/hooks/useUserdetails';
import { useAuth } from '../../utils/hooks/AuthContext';

const PostPage = () => {
	const { token } = useAuth();
	const [isReady, setIsReady] = useState(false);
	const server_url = process.env.REACT_APP_SERVER_URL || '';

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

	if (!token) return <div>Loading access token...</div>;
	if (!isReady) return <div>Loading data...</div>;

	if (postsLoading || userLoading || followersLoading) return <div>Loading...</div>;
	if (postsError || userError || followersError) return <div>An error has occurred.</div>;

	if (!memoizedUserData) return <div>User data not available.</div>;
	if (!memoizedFollowers) return <div>Followers data not available.</div>;

	return (
		<div className="container mx-auto font-cas mb-10">
			<NavBar />
			<hr />
			<div>
				<RandomPost postData={memoizedPostList} />
				<Posts postData={memoizedPostList} length={3} />
				<h1 className='mt-5 font-light text-2xl'>For Writers and Editors</h1>
				<hr />
				<Posts postData={memoizedPostList} length={memoizedPostList.length} />
				<h1 className='mt-10 font-light text-2xl'>Latest</h1>
				<LatestPosts postData={memoizedPostList} user={memoizedUserData} followers={memoizedFollowers} />
			</div>
		</div>
	);
}

export default PostPage;
