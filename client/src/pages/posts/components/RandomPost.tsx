import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import type { ItemType } from "../../../interfaces";

const RandomPost = ({ postData }: { postData: ItemType[] }) => {
	const { getImageUrl, getAvatarUrl } = useImageUrls();

	return (
		<a href={`/@${postData[0]?.user.username}/${postData[0].slug}`} className='my-5'>
			<div className='flex flex-row my-10 border-slate-50 border-2 p-2 shadow-2xl h-144'>
				{postData[0].featuredImage_url && <img src={getImageUrl(postData[0].featuredImage_url)} alt="" width={800} height={200} className="object-contain" />}
				<div className='ml-10'>
					<h1 className='font-semibold text-2xl'>{postData[0].title}</h1>
					<p>{postData[0].description}</p>
					<br />
					<div className='flex flex-row'>
						{postData[0].user.avatar_url && <img src={getAvatarUrl(postData[0].user.avatar_url)} alt="" width={50} height={10} style={{ borderRadius: 10, marginRight: 10 }} className="object-contain" />}
						<p><span className="text-green-500">{postData[0].user.username}</span> <br /> {formatDate(postData[0].created_at)} - 12 min read</p>
					</div>
				</div>
			</div>
		</a>
	)
}
export default RandomPost;