import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import type { ItemType } from "../../../interfaces";

const PostCard = ({ postData, length }: { postData: ItemType[], length: number }) => {
	const { getImageUrl, getAvatarUrl } = useImageUrls();

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mx-2 sm:mx-6 lg:mx-10'>
			{postData?.slice(0, length).map((item: ItemType) => {
				return (
					<a key={item.id} href={`/@${item.user.username}/${item.slug}`} className='my-3 sm:my-4 lg:my-5'>
						<div>
							{item.featuredImage_url && <img src={getImageUrl(item.featuredImage_url)} alt="" className='h-36 sm:h-48 lg:h-60 w-full object-cover' />}
							<div className='flex flex-col justify-between h-32 sm:h-36 lg:h-40'>
								<div className='h-20 sm:h-24 lg:h-28 overflow-hidden'>
									<h1 className='font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2'>{item.title}</h1>
									<p className='line-clamp-2 text-xs sm:text-sm lg:text-base'>{item.description}</p>
								</div>
								<div className='flex flex-row h-12 sm:h-14 items-center'>
									{item.user.avatar_url && <img src={getAvatarUrl(item.user.avatar_url)} alt="" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full mr-2 sm:mr-3 object-cover" />}
									<div>
										<p className="text-green-500 text-xs sm:text-sm lg:text-base">{item.user.username}</p>
										<p className="text-xxs sm:text-xs lg:text-sm">{formatDate(item.created_at)} - 12 min read</p>
									</div>
								</div>
							</div>
						</div>
					</a>
				)
			})}
		</div>
	)
}

export default PostCard;