import { Link } from 'react-router-dom';
import formatDate from "../../../utils/helpers/formatDate";
import type { ItemType } from "../../../interfaces";
import readingTime from '../../../utils/helpers/readingTime';
import ImageSet from '../../../components/common/ImageSet';

const RandomPost = ({ postData }: { postData: ItemType[] }) => {

	return (
		<Link to={`/@${postData[0]?.user.username}/${postData[0]?.slug}`} className='my-3 sm:my-4 md:my-5'>
			<div className='flex flex-col md:flex-row my-4 sm:my-6 md:my-8 lg:my-10 border-slate-50 border-2 p-2 shadow-2xl min-h-[12rem] sm:min-h-[14rem] md:min-h-[16rem] md:h-auto lg:h-3/6'>
				{postData[0]?.featuredImage_url && (
					<div className="w-full md:w-1/2 mb-3 sm:mb-4 md:mb-0">
						<ImageSet source={postData[0]?.featuredImage_url} classname='w-full h-full object-cover' />
					</div>
				)}
				<div className='md:ml-4 lg:ml-6 xl:ml-10 w-full md:w-1/2'>
					<h1 className='font-semibold text-base mb-2'>{postData[0]?.title}</h1>
					<p className="mb-3 sm:mb-4 text-sm text-gray-700 ">{postData[0]?.description}</p>
					<div className='flex flex-row items-center'>
						<Link to={`/@${postData[0]?.user.username}`} className="relative group">
							<ImageSet source={postData[0]?.user.avatar_url} classname="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full mr-3 sm:mr-4 object-cover" />
							<div className="hidden group-hover:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-white text-gray-900 text-sm rounded-lg p-4 shadow-xl whitespace-normal w-48 max-w-xs">
								<p className="font-semibold md:text-sm text-center">{postData[0]?.user.username}</p>
								<p className="text-gray-500 text-xs text-center">{formatDate(postData[0]?.user.created_at)}</p>
								<p className="text-gray-700 mt-1 text-center overflow-ellipsis overflow-hidden max-h-16">{postData[0]?.user.bio || "No bio available"}</p>
							</div>
						</Link>
						<div>
							<p className="text-green-500 text-xs sm:text-sm">{postData[0]?.user.username}</p>
							<p className="text-xs sm:text-xs">{formatDate(postData[0]?.created_at)} - {readingTime(postData[0]?.content)} read</p>
						</div>
					</div>
				</div>
			</div>
		</Link>
	)
}
export default RandomPost;