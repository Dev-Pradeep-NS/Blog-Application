import { Link } from 'react-router-dom';
import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import type { ItemType } from "../../../interfaces";

const RandomPost = ({ postData }: { postData: ItemType[] }) => {
	const { getImageUrl, getAvatarUrl } = useImageUrls();

	return (
		<Link to={`/@${postData[0]?.user.username}/${postData[0].slug}`} className='my-3 sm:my-4 md:my-5'>
			<div className='flex flex-col md:flex-row my-4 sm:my-6 md:my-8 lg:my-10 border-slate-50 border-2 p-2 shadow-2xl min-h-[12rem] sm:min-h-[14rem] md:min-h-[16rem] md:h-auto lg:h-144'>
				{postData[0].featuredImage_url && (
					<div className="w-full md:w-1/2 mb-3 sm:mb-4 md:mb-0">
						<img src={getImageUrl(postData[0].featuredImage_url)} alt="" className="w-full h-full object-cover" />
					</div>
				)}
				<div className='md:ml-4 lg:ml-6 xl:ml-10 w-full md:w-1/2'>
					<h1 className='font-semibold text-lg sm:text-xl md:text-2xl mb-2'>{postData[0].title}</h1>
					<p className="mb-3 sm:mb-4 text-sm sm:text-base">{postData[0].description}</p>
					<div className='flex flex-row items-center'>
						<img src={postData[0].user.avatar_url ? getAvatarUrl(postData[0].user.avatar_url) : '/logo.png'} alt="" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full mr-3 sm:mr-4 object-cover" />
						<div>
							<p className="text-green-500 text-sm sm:text-base">{postData[0].user.username}</p>
							<p className="text-xs sm:text-sm">{formatDate(postData[0].created_at)} - 12 min read</p>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}
export default RandomPost;