import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import type { ItemType } from "../../../interfaces";

const PostCard = ({ postData, length }: { postData: ItemType[], length: number }) => {
	const { getImageUrl, getAvatarUrl } = useImageUrls();

	return (
		<div className='grid grid-cols-3 gap-5 ml-10'>
			{postData?.slice(0, length).map((item: ItemType) => {
				return (
					<a key={item.id} href={`/@${item.user.username}/${item.slug}`} className='my-5'>
						<div>
							{item.featuredImage_url && <img src={getImageUrl(item.featuredImage_url)} alt="" className='h-72 w-full object-contain' />}
							<div className='flex flex-col justify-between h-40'>
								<div className='h-28 overflow-hidden'>
									<h1 className='font-semibold text-lg mb-2'>{item.title}</h1>
									<p className='line-clamp-2'>{item.description}</p>
								</div>
								<div className='flex flex-row h-14 items-center'>
									{item.user.avatar_url && <img src={getAvatarUrl(item.user.avatar_url)} alt="" className="w-12 h-12 rounded-full mr-3 object-contain" />}
									<div>
										<p className="text-green-500">{item.user.username}</p>
										<p>{formatDate(item.created_at)} - 12 min read</p>
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