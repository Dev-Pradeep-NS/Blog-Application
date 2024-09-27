import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import { SocialIcon } from "react-social-icons";
import type { ItemType, Follower, User } from "../../../interfaces";
import { Link } from "react-router-dom";

const LatestPosts = ({ postData, user, followers }: { postData: ItemType[], user: User, followers: Follower }) => {
	const { getImageUrl, getAvatarUrl } = useImageUrls();

	return (
		<div className='flex flex-col lg:flex-row'>
			<div className='w-full lg:w-2/3'>
				<hr />
				<div className='flex flex-col mx-2 sm:mx-4 lg:ml-10'>
					{postData?.map((item: ItemType) => {
						return (
							<Link key={item.id} to={`/@${item.user.username}/${item.slug}`} className='my-2 sm:my-3'>
								<div key={item.id}>
									<div className='mb-3 sm:mb-5 mr-2 sm:mr-5 flex flex-col sm:flex-row justify-between'>
										<div>
											<h1 className='font-semibold text-sm sm:text-base'>{item.title}</h1>
											<p className='text-xs sm:text-sm'>{item.description}</p>
											<br />
											<div className='flex flex-row items-center'>
												<Link to={`/@${item.user.username}`} className="relative group">
													<img src={item.user.avatar_url ? getAvatarUrl(item.user.avatar_url) : '/logo.png'} alt="" className='w-8 h-8 sm:w-12 sm:h-12 rounded-lg mr-2 sm:mr-3' />
													<div className="hidden group-hover:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-white text-gray-900 text-sm rounded-lg p-4 shadow-xl whitespace-normal w-48 max-w-xs">
														<p className="font-semibold text-base text-center">{postData[0].user.username}</p>
														<p className="text-gray-500 text-xs text-center">{formatDate(postData[0].user.created_at)}</p>
														<p className="text-gray-700 mt-1 text-center overflow-ellipsis overflow-hidden max-h-16">{postData[0].user.bio || "No bio available"}</p>
													</div>
												</Link>
												<p className='text-xs sm:text-sm'>{item.user.username}<br />{formatDate(item.created_at)} - 12 min read</p>
											</div>
										</div>
										{item.featuredImage_url && <img src={getImageUrl(item.featuredImage_url)} alt="" className='w-full sm:w-24 sm:h-24 lg:w-28 lg:h-28 border-2 border-slate-200 mt-2 sm:mt-0 sm:ml-2' />}
									</div>
									<hr />
								</div>
							</Link>
						)
					})}
				</div>
			</div>

			<div className='w-full lg:w-1/3 mt-4 lg:mt-0 lg:ml-10 px-2 sm:px-4 lg:px-0'>
				<Link to={`/@${user.username}`} className='flex flex-row items-center' title={`Visit ${user?.username}'s blog`}>
					<img src={user.avatar_url ? getAvatarUrl(user.avatar_url) : '/logo.png'} alt="" className='w-8 h-8 sm:w-12 sm:h-12 rounded-lg mr-2 sm:mr-3' />
					<p className='text-xs sm:text-sm'>The {user?.username} Blog</p>
				</Link>
				<p className='text-xs sm:text-sm mb-1 sm:mb-2'>The official Pradeep Blog.</p>
				<p className='text-xs sm:text-sm mb-1 sm:mb-2 text-green-500'>More information</p>
				<p className='text-xs sm:text-sm mb-1 sm:mb-2'>Followers - {followers?.followers ? followers?.followers.length : 0}</p>
				<p className='text-xs sm:text-sm mb-1 sm:mb-2'>ELSEWHERE</p>
				<div className='flex flex-row'>
					<SocialIcon url='www.facebook.com' style={{ height: 20, width: 20, margin: '0 1px' }} />
					<SocialIcon url='www.email.com' href='https://in.linkedin.com/' style={{ height: 20, width: 20, margin: '0 1px' }} />
				</div>
			</div>
		</div>
	)
}

export default LatestPosts