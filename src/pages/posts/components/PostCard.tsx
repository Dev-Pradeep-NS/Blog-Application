import formatDate from "../../../utils/helpers/formatDate";
import type { ItemType } from "../../../interfaces";
import { Link } from "react-router-dom";
import truncateString from "../../../utils/helpers/truncateString";
import readingTime from "../../../utils/helpers/readingTime";
import { useUserStore } from "../../../store";
import ImageSet from "../../../components/common/ImageSet";

const PostCard = ({ postData, length, isUser }: { postData: ItemType[], length: number, isUser: boolean }) => {

	const { user } = useUserStore()
	let data: ItemType[] = postData;
	if (isUser && user) {
		data = postData.filter(item => item.user_id === user.id);
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-6 lg:mx-0'>
			{data.slice(0, length).map((item: ItemType) => {
				return (
					<div key={item.id}>
						<Link to={`/@${item.user.username}/${item.slug}`} className='block'>
							<div className='flex flex-col h-full'>
								{item.featuredImage_url && <ImageSet source={item.featuredImage_url} classname='w-full aspect-[16/9] object-cover mb-3' />}
								<div className='flex flex-col justify-between flex-grow'>
									<div className='overflow-hidden'>
										<h2 className='font-bold text-base mb-2 leading-tight'>{item.title}</h2>
										<p className='text-sm text-gray-700 mb-4 line-clamp-3'>
											{truncateString(item.description)}
										</p>
									</div>
									<div className='flex items-center'>
										<Link to={`/@${item.user.username}`}>
											<div className="relative group mr-3">
												{item.user.avatar_url && (
													<ImageSet
														source={item.user.avatar_url}
														classname="w-8 h-8 rounded-full object-cover"
													/>
												)}
												<div className="hidden group-hover:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-white text-gray-900 text-sm rounded-lg p-4 shadow-xl whitespace-normal w-64 z-10">
													<p className="font-semibold text-sm mb-1">{item.user.username}</p>
													<p className="text-gray-500 text-xs mb-2">Member since {formatDate(item.user.created_at)}</p>
													<p className="text-gray-700 text-xs">{item.user.bio || "No bio available"}</p>
												</div>
											</div>
										</Link>
										<div>
											<p className="text-sm text-green-500">{item.user.username}</p>
											<p className="text-xs text-gray-500">{formatDate(item.created_at)} · {readingTime(item.content)} read</p>
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