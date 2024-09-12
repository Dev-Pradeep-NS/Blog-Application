import { getImageUrl, getAvatarUrl } from "../../utils/helpers/getImageUrl"
import formatDate from "../../utils/helpers/formatDate";
import type { ItemType } from "../../interfaces";

const Posts = ({ postData, length }: { postData: ItemType[], length: number }) => {
	return (
		<div className='flex flex-wrap ml-10'>
			{postData?.slice(0, length).map((item: ItemType) => {
				return (
					<div key={item.id} className='w-128 my-5 mr-5'>
						{item.featuredImage_url && <img src={getImageUrl(item.featuredImage_url)} alt="" className='h-72' width={480} />}
						<div className='flex flex-col justify-between h-48'>
							<div className='h-28 overflow-hidden'>
								<h1 className='font-semibold text-lg mb-2'>{item.title}</h1>
								<p className='line-clamp-2'>{item.description}</p>
							</div>
							<div className='flex flex-row h-14'>
								{item.user.avatar_url && <img src={getAvatarUrl(item.user.avatar_url)} alt="" width={50} height={10} style={{ borderRadius: 10, marginRight: 10 }} />}
								<p><span className="text-green">{item.user.username}</span> <br /> {formatDate(item.created_at)} - 12 min read</p>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
}

export default Posts;