import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import { SocialIcon } from "react-social-icons";
import type { ItemType, Follower, User } from "../../../interfaces";
import { Link } from "react-router-dom";
import readingTime from "../../../utils/helpers/readingTime";

const LatestPosts = ({ postData, user, followers }: { postData: ItemType[], user: User, followers: Follower }) => {
	const { getImageUrl, getAvatarUrl } = useImageUrls();

	return (
		<div className='flex flex-col md:flex-row justify-start mx-3 lg:mx-0'>
			<div className='w-full md:w-3/4'>
				<hr />
				<div className='flex flex-col'>
					{postData?.map((item: ItemType) => {
						return (
							<Link key={item.id} to={`/@${item.user.username}/${item.slug}`} className='my-2'>
								<div key={item.id}>
									<div className='mb-3 mr-2 flex flex-row justify-between'>
										<div className='flex-1'>
											<h1 className='font-semibold text-sm'>{item.title}</h1>
											<p className='text-xs font-content'>{item.description}</p>
											<br />
											<div className='flex flex-row items-center font-content'>
												<Link to={`/@${item.user.username}`} className="relative group">
													<img src={item.user.avatar_url ? getAvatarUrl(item.user.avatar_url) : '/logo.png'} alt="" className='w-8 h-8 rounded-lg mr-2' />
													<div className="hidden group-hover:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-white text-gray-900 text-sm rounded-lg p-4 shadow-xl whitespace-normal w-48 max-w-xs z-10">
														<p className="font-semibold text-base text-center">{postData[0].user.username}</p>
														<p className="text-gray-500 text-xs text-center">{formatDate(postData[0].user.created_at)}</p>
														<p className="text-gray-700 mt-1 text-center overflow-ellipsis overflow-hidden max-h-16">{postData[0].user.bio || "No bio available"}</p>
													</div>
												</Link>
												<p className='text-xs'>{item.user.username}<br />{formatDate(item.created_at)} - {readingTime(item.content)} read</p>
											</div>
										</div>
										{item.featuredImage_url && (
											<div className='ml-2 flex-shrink-0'>
												<img src={getImageUrl(item.featuredImage_url)} alt="" className='w-24 h-24 border-2 border-slate-200 object-cover' />
											</div>
										)}
									</div>
									<hr />
								</div>
							</Link>
						)
					})}
				</div>
			</div>

			<div className='w-full md:w-1/4 mt-4 md:mt-0 md:ml-10 font-content'>
				<Link to={`/@${user.username}`} className='flex flex-row items-center' title={`Visit ${user?.username}'s blog`}>
					<img src={user.avatar_url ? getAvatarUrl(user.avatar_url) : '/logo.png'} alt="" className='w-8 h-8 rounded-lg mr-2' />
					<p className='text-xs'>The {user?.username} Blog</p>
				</Link>
				<p className='text-xs mb-1'>The official Pradeep Blog.</p>
				<p className='text-xs mb-1 text-green-500'>More information</p>
				<p className='text-xs mb-1'>Followers - {followers?.followers ? followers?.followers.length : 0}</p>
				<p className='text-xs mb-1'>ELSEWHERE</p>
				<div className='flex flex-row'>
					<SocialIcon url='https://www.facebook.com' style={{ height: 20, width: 20, margin: '0 1px' }} />
					<SocialIcon url='mailto:example@email.com' style={{ height: 20, width: 20, margin: '0 1px' }} />
					<SocialIcon url='https://www.linkedin.com/in/example' style={{ height: 20, width: 20, margin: '0 1px' }} />
				</div>
			</div>
		</div>
	)
}

export default LatestPosts