import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import type { ItemType } from "../../../interfaces";
import { Link } from "react-router-dom";
import truncateString from "../../../utils/helpers/truncateString";

const PostCard = ({ postData, length }: { postData: ItemType[], length: number }) => {
	const { getImageUrl, getAvatarUrl } = useImageUrls();

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mx-2 sm:mx-6 lg:mx-10'>
			{postData?.slice(0, length).map((item: ItemType) => {
				return (
					<div key={item.id}>
						<Link to={`/@${item.user.username}/${item.slug}`} className='my-3 sm:my-4 lg:my-5'>
							<div className='flex flex-col h-full'>
								{item.featuredImage_url && <img src={getImageUrl(item.featuredImage_url)} alt="" className='h-36 sm:h-48 lg:h-60 w-full object-cover' />}
								<div className='flex flex-col justify-between flex-grow'>
									<div className='overflow-hidden'>
										<h1 className='font-semibold text-xs sm:text-base lg:text-base mb-1 sm:mb-2'>{item.title}</h1>
										<p className='text-sm sm:text-xs lg:text-sm line-clamp-2 sm:line-clamp-3'>
											{truncateString(item.description)}
										</p>
									</div>
									<div className='flex flex-row items-center mt-2 sm:mt-3'>
										<Link to={`/@${item.user.username}`}>
											<div className="relative group">
												{item.user.avatar_url ? (
													<img
														src={getAvatarUrl(item.user.avatar_url)}
														alt=""
														className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full mr-2 sm:mr-3 object-cover cursor-pointer"
													/>
												) : (
													<img
														src={'/logo.png'}
														alt=""
														className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full mr-2 sm:mr-3 object-cover cursor-pointer"
													/>
												)}
												{/* Enhanced Tooltip */}
												<div className="hidden group-hover:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-white text-gray-900 text-sm rounded-lg p-4 shadow-xl whitespace-normal w-48 max-w-xs">
													<p className="font-semibold text-base text-center">{item.user.username}</p>
													<p className="text-gray-500 text-xs text-center">{formatDate(item.user.created_at)}</p>
													<p className="text-gray-700 mt-1 text-center overflow-ellipsis overflow-hidden max-h-16">{item.user.bio || "No bio available"}</p>
												</div>
											</div>
										</Link>
										<div>
											<p className="text-green-500 text-xs sm:text-sm lg:text-base">{item.user.username}</p>
											<p className="text-xxs sm:text-xs lg:text-sm">{formatDate(item.created_at)} - 12 min read</p>
										</div>
									</div>
								</div>
							</div>
						</Link>
					</div>
				)
			})}
		</div>
	)
}

export default PostCard;