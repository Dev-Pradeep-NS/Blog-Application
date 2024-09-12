import { useEffect, useState } from 'react'
import {
	useQuery
} from 'react-query'
import RandomPost from './RandomPost'
import NavBar from '../../components/common/NavBar'
import Posts from './PostCard'
import LatestPosts from './LatestPosts'
import type { ItemType, User, Follower } from '../../interfaces'

const HomePage = () => {
	const token = process.env.REACT_APP_TOKEN
	const server_url = process.env.REACT_APP_SERVER_URL
	const [state, setState] = useState({
		userDetails: {} as User,
		followers: {} as Follower
	})

	const user: User = state?.userDetails;
	const followers: Follower = state?.followers

	useEffect(() => {
		fetchCurrentUserDetails()
		fetchUserFollowers()
	}, [])

	const { isLoading, error, data } = useQuery('PostData', async () => {
		try {
			const response = await fetch(`${server_url}/posts`, {
				headers: { 'Authorization': `Bearer ${token}` }
			})
			if (!response.ok) {
				throw new Error('Network response was not ok')
			}
			return response.json()
		} catch (error) {
			console.error('Error fetching data:', error)
			throw error
		}
	})

	const postData: ItemType[] = data

	const fetchCurrentUserDetails = async () => {
		try {
			const response = await fetch(`${server_url}/users/`, {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			setState(prev => ({ ...prev, userDetails: data }));
		} catch (error) {
			console.error(error);
		}
	}

	const fetchUserFollowers = async () => {
		try {
			const response = await fetch(`${server_url}/users/${user.id}/followers`, {
				headers: { 'Authorization': `Bearer ${token}` }
			});
			const data = await response.json();
			setState(prev => ({ ...prev, followers: data }))
		} catch (error) {
			console.log(error)
		}
	}

	if (isLoading) return <div>Loading...</div>

	if (error) return <div>An error has occurred: {error.toString()}</div>

	return (
		<div className="mx-20 my-5 font-cas">
			<NavBar />
			<hr className='my-8' />
			<div className='mx-10'>
				<RandomPost postData={postData} />
				<Posts postData={postData} length={3} />
				<h1 className='mt-10 font-light text-2xl'>For Writers and Editors</h1>
				<hr />
				<Posts postData={postData} length={postData.length} />
				<h1 className='mt-10 font-light text-2xl'>Latest</h1>
				<LatestPosts postData={postData} user={user} followers={followers} />
			</div>
		</div>
	)
}
export default HomePage;