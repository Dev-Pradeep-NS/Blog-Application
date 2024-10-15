import { useParams } from 'react-router-dom';
import { useDeletePost, useShowPost } from '../../../utils/hooks/usePosts';
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import { MdOutlineInsertComment } from "react-icons/md";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import { MdBookmarkAdded } from "react-icons/md";
import { CiPlay1 } from "react-icons/ci";
import { CiPause1 } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { useComment } from '../../../utils/hooks/useComments';
import formatDate from '../../../utils/helpers/formatDate';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useDisLikePost, useLikePost, useReactions } from '../../../utils/hooks/useReactions';
import { useUserDetails } from '../../../utils/hooks/useUserdetails';
import type { Bookmark, Comments, Reaction } from '../../../interfaces';
import { useBookmarkPost, useBookmarks } from '../../../utils/hooks/useBookmarks';
import { CommentSection } from '../comments';
import { useAuth } from '../../../utils/hooks/AuthContext';
import useImageUrls from '../../../utils/helpers/getImageUrl';
import 'highlight.js/styles/github.css';
import '../index.css'
import DOMPurify from 'dompurify';
import { useUserStore } from '../../../store';
import readingTime from '../../../utils/helpers/readingTime';

const ViewPost = () => {
	const [speechStatus, setSpeechStatus] = useState(false);
	const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
	const [showCommentSection, setShowCommentSection] = useState(false)
	const { getImageUrl, getAvatarUrl } = useImageUrls();
	const { username, slug } = useParams();
	const userName = username?.replace("@", "") || '';
	const { token } = useAuth();
	const { user } = useUserStore();
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const contentRef = useRef<HTMLDivElement>(null);

	const { isLoading: postLoading, error: postError, data: postData } = useShowPost(server_url, userName, slug || '', token);
	const { isLoading: userLoading, error: userError, data: userData } = useUserDetails(server_url, token);
	const { isLoading: commentsLoading, error: commentsError, data: commentsData } = useComment(server_url, postData?.id || 0, token);
	const { isLoading: reactionsLoading, error: reactionsError, data: reactionsData } = useReactions(server_url, postData?.id || 0, token);
	const { isLoading: bookmarLoading, error: bookmarkError, data: bookmarkData } = useBookmarks(server_url, token);
	const { mutate: likePost } = useLikePost(server_url, postData?.id || 0, token);
	const { mutate: dislikePost } = useDisLikePost(server_url, postData?.id || 0, token)
	const { mutate: bookmarkPost } = useBookmarkPost(server_url, postData?.id || 0, token)
	const { mutate: deletePost } = useDeletePost(server_url, token, postData?.id || 0)

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
			`${memoizedPostData?.title} - ${memoizedPostData?.description} - ${contentRef.current?.textContent || ''}`
		);
		setUtterance(u);

		return () => {
			synth.cancel();
			setSpeechStatus(false)
		};
	}, [memoizedPostData]);

	useEffect(() => {
		if (utterance) {
			utterance.onend = () => {
				setSpeechStatus(false);
				window.speechSynthesis.cancel();
			};
		}
	}, [utterance]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	useEffect(() => {
		if (memoizedPostData?.content) {
			const timer = setTimeout(() => {
				const sanitizedContent = DOMPurify.sanitize(memoizedPostData.content, {
					ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre'],
					ALLOWED_ATTR: ['href', 'name', 'target', 'class', 'id', 'start'],
				});

				if (contentRef.current) {
					const parser = new DOMParser();
					const doc = parser.parseFromString(sanitizedContent, 'text/html');

					let listCounter = 1;
					for (const ol of doc.querySelectorAll('ol')) {
						ol.setAttribute('start', listCounter.toString());
						listCounter += ol.children.length;
					}

					const modifiedContent = new XMLSerializer().serializeToString(doc.body);

					contentRef.current.innerHTML = modifiedContent;
					contentRef.current.classList.add('custom-content');

					const codeBlocks = contentRef.current.querySelectorAll('pre');
					for (const block of codeBlocks) {
						block.classList.add('code-block-custom');
						hljs.highlightElement(block);
					}
				}
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [memoizedPostData]);

	if (!token || !memoizedPostData) return <p>Loading access token</p>
	if (postLoading || commentsLoading || reactionsLoading || userLoading || bookmarLoading) return <p>Loading...</p>;
	if (postError || commentsError || reactionsError || userError || bookmarkError) return <p>Error: {postError instanceof Error ? postError.message : 'Unknown error'}</p>;

	function speak() {
		const synth = window.speechSynthesis;
		if (!speechStatus && utterance) {
			utterance.voice = synth.getVoices()[2];
			synth.speak(utterance);
			setSpeechStatus(true);
		} else {
			synth.pause();
			setSpeechStatus(false);
		}
	}

	return (
		<div className='max-w-screen-lg mx-auto mt-10 '>
			<div className='place-self-center container mx-auto mb-10 px-4 sm:px-6 lg:px-8 max-w-4xl'>
				<img src={memoizedPostData?.featuredImage_url ? getImageUrl(memoizedPostData.featuredImage_url) : ''} alt="imageurl" className='w-full h-auto mx-auto' />
				<p className='text-center text-lg my-3 font-semibold'>{memoizedPostData?.title}</p>
				<p className='mt-2 md:text-base sm:text-base lg:text-base'>{memoizedPostData?.description}</p>
				<div className='flex flex-row items-center my-2'>
					<img src={memoizedPostData?.user?.avatar_url ? getAvatarUrl(memoizedPostData?.user.avatar_url) : '/specwiselogo.png'} alt='' className='w-12 h-12 rounded-full mr-4' />
					<div>
						<p className='text-sm font-medium text-green-500'>{username?.replace("@", "")}</p>
						<p className='text-xs'>Published in The Specwise Blogs - {readingTime(memoizedPostData.content)} - {formatDate(memoizedPostData?.created_at ? memoizedPostData?.created_at : new Date().toLocaleDateString())}</p>
					</div>
				</div>
				<div className='flex flex-col sm:flex-row justify-between items-center my-5 space-y-4 sm:space-y-0'>
					<div className='flex items-center space-x-4'>
						<button
							type="button"
							onClick={() => likePost()}
							className='focus:outline-none hover:text-blue-500 transition-colors duration-200'
							title={`Likes: ${memoizedReactions.filter(i => i.reaction_type === 'like').length}`}
							aria-label="Like post"
						>
							{isLiked ? <BiSolidLike size={20} className="text-blue-500" /> : <BiLike size={20} />}
						</button>
						<button
							type="button"
							onClick={() => dislikePost()}
							className='focus:outline-none hover:text-red-500 transition-colors duration-200'
							title={`Dislikes: ${memoizedReactions.filter(i => i.reaction_type === 'dislike').length}`}
							aria-label="Dislike post"
						>
							{isDisliked ? <BiSolidDislike size={20} className="text-red-500" /> : <BiDislike size={20} />}
						</button>
						<button
							type='button'
							className='flex flex-row items-center space-x-2 focus:outline-none hover:text-green-500 transition-colors duration-200'
							onClick={() => setShowCommentSection(true)}
							aria-label="Show comments"
						>
							<MdOutlineInsertComment size={20} />
							<span>{memoizedCommentsData?.count}</span>
						</button>
					</div>
					<div className='flex items-center space-x-4'>
						<button type='button' onClick={() => bookmarkPost()} className='focus:outline-none'>
							{isBookmarked ? <MdBookmarkAdded size={20} /> : <MdOutlineBookmarkAdd size={20} />}
						</button>
						<button type='button' onClick={speak} className='focus:outline-none'>
							{!speechStatus ? <CiPlay1 size={20} /> : <CiPause1 size={20} />}
						</button>
						{memoizedPostData.user_id === user?.id ? <button type='button' onClick={() => deletePost()} className='focus:outline-none'>
							<MdDeleteForever size={20} />
						</button> : null}
					</div>
				</div>
				<div className='prose max-w-none custom-content font-medium' ref={contentRef} />
				{showCommentSection && (
					<div className='fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4'>
						<div className='bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
							<CommentSection
								comments={memoizedCommentsData}
								onClose={() => setShowCommentSection(false)}
								username={memoizedUserData?.username}
								postId={postData?.id}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
export default ViewPost;