import type React from "react"
import type { Comments } from "../../../interfaces"
import { FiX } from "react-icons/fi";
import { MdOutlineInsertComment } from "react-icons/md";
import { useState } from "react";
import { usePostComment, useReplyComment } from "../../../utils/hooks/use-comments";

interface CommentSectionProps {
	comments: Comments | undefined;
	onClose: () => void,
	username: string | undefined;
	postId: number | undefined;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onClose, username, postId }) => {
	console.log(JSON.stringify(comments))
	const token = process.env.REACT_APP_TOKEN || '';
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const [showReplyId, setShowReplyId] = useState<number | null>(null)
	const [showReplies, setShowReplies] = useState<number | null>(null)
	const [replyText, setReplyText] = useState<string>('')
	const [responseText, setResponseText] = useState<string>('')

	const { mutate: addResponse } = usePostComment(server_url, postId, responseText, token)

	const { mutate: replyComment } = useReplyComment(server_url, postId, showReplyId, replyText, token)

	if (!comments) return null;

	return (
		<div className="scroll-smooth w-96 h-screen mx-10">
			<div className="flex flex-row justify-between">
				<h2>Responses ({comments.count})</h2>
				<button type="button" onClick={onClose}>
					<FiX size={24} />
				</button>
			</div>
			<div className="bg-slate-50 py-5 rounded-lg drop-shadow-2xl mt-5">
				<p className="ml-2 font-semibold">{username}</p>
				<textarea
					className="w-full h-40 border-none p-2 bg-slate-50 focus:outline-none resize-none text-sm"
					placeholder="What are your thoughts?" value={responseText} onChange={(e) => setResponseText(e.target.value)}
				/>
				<div className="flex flex-row justify-end mr-5 items-center mt-2">
					<button type="button" className="mr-3 text-gray-600 hover:text-gray-800">
						<p className="text-sm">Cancel</p>
					</button>
					<button type="button" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-full px-4 py-2 transition duration-300" onClick={() => { addResponse(); setResponseText('') }}>
						<p className="text-sm">Respond</p>
					</button>
				</div>
			</div>
			<hr className="my-6 border-t border-gray-300" />
			{comments.comments.map((comment) => (
				<div key={comment.id} className="mb-6 bg-white p-4 rounded-lg shadow">
					<p className="text-lg font-semibold mb-2">{comment.comment}</p>
					<div className="flex justify-between text-sm text-gray-600 mb-2">
						<p>By: {comment.username}</p>
						<p>Posted on: {new Date(comment.created_at).toLocaleDateString()}</p>
					</div>
					<div className="flex flex-row justify-between">
						<div className="flex flex-row space-x-2">
							<button type="button" onClick={() => setShowReplies(prevId => prevId === comment.id ? null : comment.id)}>
								<MdOutlineInsertComment size={23} />
							</button>
							<p>{comment?.replies?.length}</p>
						</div>
						<button type="button" onClick={() => setShowReplyId(prevId => prevId === comment.id ? null : comment.id)}>
							<p>Reply</p>
						</button>
					</div>
					{showReplyId === comment.id && (
						<div className="bg-slate-50 py-5 rounded-lg drop-shadow-2xl mt-5">
							<textarea
								className="w-full h-20 border-none p-2 bg-slate-50 focus:outline-none resize-none text-sm"
								placeholder={`Reply to ${comment.username}`}
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
							/>
							<div className="flex flex-row justify-end mr-5 items-center mt-2">
								<button type="button" className="mr-3 text-gray-600 hover:text-gray-800" onClick={() => setShowReplyId(null)}>
									<p className="text-sm">Cancel</p>
								</button>
								<button type="button" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-full px-4 py-2 transition duration-300" onClick={() => { replyComment(); setReplyText('') }}>
									<p className="text-sm">Respond</p>
								</button>
							</div>
						</div>
					)}
					{showReplies === comment.id && comment.replies.map((reply) => (
						<div key={reply.id} className="ml-4 mt-2 p-2 bg-gray-100 rounded">
							<p className="text-base">{reply.comment}</p>
							<div className="flex justify-between text-md text-gray-600 mb-2">
								<p className="text-sm">By: {reply.username}</p>
								<p className="text-sm">Posted on: {new Date(reply.created_at).toLocaleDateString()}</p>
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	)
}