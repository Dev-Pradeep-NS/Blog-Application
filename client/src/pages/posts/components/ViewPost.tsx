import { useParams } from 'react-router-dom';
import { useShowPost } from '../../../utils/hooks/usePosts';
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { MdOutlineInsertComment } from "react-icons/md";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { MdBookmarkAdded } from "react-icons/md";
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import { useComment } from '../../../utils/hooks/useComments';
import formatDate from '../../../utils/helpers/formatDate';
import { useMemo, useState, useEffect } from 'react';
import { useDisLikePost, useLikePost, useReactions } from '../../../utils/hooks/useReactions';
import { useUserDetails } from '../../../utils/hooks/useUserdetails';
import type { Bookmark, Comments, Reaction } from '../../../interfaces';
import { useBookmarkPost, useBookmarks } from '../../../utils/hooks/useBookmarks';
import { CommentSection } from '../comments';
import { useAuth } from '../../../utils/hooks/AuthContext';
import useImageUrls from '../../../utils/helpers/getImageUrl';

const ViewPost = () => {
	const [speechStatus, setSpeechStatus] = useState(false);
	const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
	const [showCommentSection, setShowCommentSection] = useState(false)
	const { getImageUrl, getAvatarUrl } = useImageUrls();
	const { username, slug } = useParams();
	const userName = username?.replace("@", "") || '';
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || '';

	const { isLoading: postLoading, error: postError, data: postData } = useShowPost(server_url, userName, slug || '', token);
	const { isLoading: userLoading, error: userError, data: userData } = useUserDetails(server_url, token);
	const { isLoading: commentsLoading, error: commentsError, data: commentsData } = useComment(server_url, postData?.id || 0, token);
	const { isLoading: reactionsLoading, error: reactionsError, data: reactionsData } = useReactions(server_url, postData?.id || 0, token);
	const { isLoading: bookmarLoading, error: bookmarkError, data: bookmarkData } = useBookmarks(server_url, token);
	const { mutate: likePost } = useLikePost(server_url, postData?.id || 0, token);
	const { mutate: dislikePost } = useDisLikePost(server_url, postData?.id || 0, token)
	const { mutate: bookmarkPost } = useBookmarkPost(server_url, postData?.id || 0, token)

	const memoizedPostData = useMemo(() => postData, [postData]);
	const memoizedCommentsData = useMemo<Comments | undefined>(() => commentsData, [commentsData]);
	const memoizedReactions = useMemo(() => Array.isArray(reactionsData) ? reactionsData : [], [reactionsData]);
	const memoizedUserData = useMemo(() => userData, [userData]);
	const memoizedBookmarkData = useMemo(() => bookmarkData, [bookmarkData])

	const isLiked = memoizedReactions?.some((item: Reaction) => item.user_id === memoizedUserData?.id && item.reaction_type === 'like')
	const isDisliked = memoizedReactions?.some((item: Reaction) => item.user_id === memoizedUserData?.id && item.reaction_type === 'dislike')
	const isBookmarked = memoizedBookmarkData?.some((item: Bookmark) => item.user_id === memoizedUserData?.id && item.post_id === postData?.id)

	useEffect(() => {
		const synth = window.speechSynthesis;
		const u = new SpeechSynthesisUtterance(
			`${memoizedPostData?.title} - ${memoizedPostData?.description} - ${memoizedPostData?.content}`
		);
		setUtterance(u);

		return () => {
			synth.cancel();
		};
	}, [memoizedPostData]);

	if (!token) return <p>Loading access token</p>
	if (postLoading || commentsLoading || reactionsLoading || userLoading || bookmarLoading) return <p>Loading...</p>;
	if (postError || commentsError || reactionsError || userError || bookmarkError) return <p>Error: {postError instanceof Error ? postError.message : 'Unknown error'}</p>;

	function speak() {
		const synth = window.speechSynthesis;
		if (!speechStatus && utterance) {
			synth.speak(utterance);
			setSpeechStatus(true);
		} else {
			synth.pause();
			setSpeechStatus(false);
		}
	}

	return (
		<div className='font-cas place-self-center container mx-auto my-10 static' style={{ width: '40rem' }}>
			<img src={memoizedPostData?.featuredImage_url ? getImageUrl(memoizedPostData.featuredImage_url) : ''} alt="imageurl" className='w-auto h-auto mx-auto' />
			<p className='text-center font-medium text-base my-5'>{memoizedPostData?.title}</p>
			<h1 className='text-2xl font-semibold'>{memoizedPostData?.title}</h1>
			<p>{memoizedPostData?.description}</p>
			<div className='flex flex-row my-5'>
				<img src={memoizedPostData?.user?.avatar_url ? getAvatarUrl(memoizedPostData?.user.avatar_url) : ''} alt='' width={50} height={10} style={{ borderRadius: 10, marginRight: 10 }} />
				<div>
					<p className='text-sm'>{username?.replace("@", "")}</p>
					<p className='text-xs'>Published in The Pradeep Blog - 12 min - {formatDate(memoizedPostData?.created_at ? memoizedPostData?.created_at : new Date().toLocaleDateString())}</p>
				</div>
			</div>
			<div className='flex flex-row justify-between items-center my-5'>
				<div className='flex items-center space-x-4'>
					<button type="button" onClick={() => likePost()}>
						{!isLiked ? <BiLike size={24} /> : <BiSolidLike size={24} />}
					</button>
					<button type="button" onClick={() => dislikePost()}>
						{!isDisliked ? <BiDislike size={24} /> : <BiSolidDislike size={24} />}
					</button>
					<button type='button' className='flex flex-row space-x-2' onClick={() => setShowCommentSection(true)}>
						<MdOutlineInsertComment size={24} />
						<p>{memoizedCommentsData?.count}</p>
					</button>
				</div>
				<div className='flex items-center space-x-4'>
					<button type='button' onClick={() => bookmarkPost()}>
						{isBookmarked ? <MdBookmarkAdded size={24} /> : <MdOutlineBookmarkAdd size={24} />}
					</button>
					<button type='button' onClick={speak}>
						{!speechStatus ? <CiPlay1 size={23} /> : <CiPause1 size={23} />}
					</button>
				</div>
			</div>
			<p>{memoizedPostData?.content}</p>
			{showCommentSection && <div className='fixed top-0 right-0 pt-10 h-screen overflow-y-auto bg-slate-100 drop-shadow-2xl'>
				<CommentSection comments={memoizedCommentsData} onClose={() => setShowCommentSection(false)} username={memoizedUserData?.username} postId={postData?.id} />
			</div>}
		</div>
	);
};
export default ViewPost;