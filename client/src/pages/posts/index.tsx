import { useMemo } from 'react';
import RandomPost from './RandomPost';
import NavBar from '../../components/common/NavBar';
import Posts from './PostCard';
import LatestPosts from './LatestPosts';
import { usePost } from '../../utils/hooks/use-posts';
import { useUserDetails, useUserFollowers } from '../../utils/hooks/use-userdetails';

const PostPage = () => {
	const token = process.env.REACT_APP_TOKEN || '';
	const server_url = process.env.REACT_APP_SERVER_URL || '';

	const { isLoading: postsLoading, error: postsError, data: postData } = usePost(server_url, token);
	const { isLoading: userLoading, error: userError, data: userData } = useUserDetails(server_url, token);
	const user_id = userData?.id ?? 0;
	const { isLoading: followersLoading, error: followersError, data: followers } = useUserFollowers(server_url, user_id, token);

	const memoizedPostList = useMemo(() => {
		return Array.isArray(postData) ? postData : [];
	}, [postData]);

	const memoizedUserData = useMemo(() => userData, [userData]);
	const memoizedFollowers = useMemo(() => followers, [followers]);

	if (postsLoading || userLoading || followersLoading) return <div>Loading...</div>;
	if (postsError || userError || followersError) return <div>An error has occurred.</div>;

	if (!memoizedUserData) return <div>User data not available.</div>;
	if (!memoizedFollowers) return <div>Followers data not available.</div>;

	return (
		<div className="container mx-auto font-cas">
			<NavBar />
			<hr />
			<div>
				<RandomPost postData={memoizedPostList} />
				<Posts postData={memoizedPostList} length={3} />
				<h1 className='mt-10 font-light text-2xl'>For Writers and Editors</h1>
				<hr />
				<Posts postData={memoizedPostList} length={memoizedPostList.length} />
				<h1 className='mt-10 font-light text-2xl'>Latest</h1>
				<LatestPosts postData={memoizedPostList} user={memoizedUserData} followers={memoizedFollowers} />
			</div>
		</div>
	);

}
export default PostPage;