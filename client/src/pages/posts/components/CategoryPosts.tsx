import useImageUrls from "../../../utils/helpers/getImageUrl";
import formatDate from "../../../utils/helpers/formatDate";
import { SocialIcon } from "react-social-icons";
import type { ItemType, Follower, User } from "../../../interfaces";

const CategoryPosts = ({ postData, user, followers }: { postData: ItemType[], user: User, followers: Follower }) => {
    const { getImageUrl, getAvatarUrl } = useImageUrls();

    return (
        <div className='flex flex-row'>
            <div className='w-2/3'>
                <hr />
                <div className='flex flex-col ml-10'>
                    {postData?.map((item: ItemType) => {
                        return (
                            <a key={item.id} href={`/@${item.user.username}/${item.slug}`} className='my-3'>
                                <div key={item.id}>
                                    <div className='mb-5 mr-5 flex flex-row justify-between'>
                                        <div>
                                            <h1 className='font-semibold text-base'>{item.title}</h1>
                                            <p>{item.description}</p>
                                            <br />
                                            <div className='flex flex-row'>
                                                {item.user.avatar_url && <img src={getAvatarUrl(item.user.avatar_url)} alt="" width={50} height={10} style={{ borderRadius: 10, marginRight: 10 }} />}
                                                <p className='text-sm'>{item.user.username}<br />{formatDate(item.created_at)} - 12 min read</p>
                                            </div>
                                        </div>
                                        {item.featuredImage_url && <img src={getImageUrl(item.featuredImage_url)} alt="" className='w-28 h-28 border-2 border-slate-200 ml-2' />}
                                    </div>
                                    <hr />
                                </div>
                            </a>
                        )
                    })}
                </div>
            </div>

            <div className='ml-20'>
                <div className='flex flex-row'>
                    {user.avatar_url && <img src={getAvatarUrl(user?.avatar_url)} alt="" width={50} height={10} style={{ borderRadius: 10, marginRight: 10 }} className="object-contain" />}
                    <p className='text-sm'>The {user?.username} Blog</p>
                </div>
                <p className='text-sm mb-2'>The official Pradeep Blog.</p>
                <p className='text-sm mb-2 text-green-500'>More information</p>
                <p className='mb-2'>Followers - {followers?.followers ? followers?.followers : 0}</p>
                <p className='mb-2'>ELSEWHERE</p>
                <SocialIcon url='www.facebook.com' style={{ height: 25, width: 25, margin: '0 1px' }} />
                <SocialIcon url='www.email.com' href='https://in.linkedin.com/' style={{ height: 25, width: 25, margin: '0 1px' }} />
            </div>
        </div>
    )
}

export default CategoryPosts