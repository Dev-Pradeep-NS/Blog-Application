import type React from "react"
import type { Comments } from "../../../interfaces"
import { FiX } from "react-icons/fi";
import { MdOutlineInsertComment } from "react-icons/md";
import { useState } from "react";
import { usePostComment, useReplyComment } from "../../../utils/hooks/useComments";
import { useAuth } from "../../../utils/hooks/AuthContext";

interface CommentSectionProps {
	comments: Comments | undefined;
	onClose: () => void,
	username: string | undefined;
	postId: number | undefined;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ comments, onClose, username, postId }) => {
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const [showReplyId, setShowReplyId] = useState<number | null>(null)
	const [showReplies, setShowReplies] = useState<number | null>(null)
	const [replyText, setReplyText] = useState<string>('')
	const [responseText, setResponseText] = useState<string>('')

	const { mutate: addResponse } = usePostComment(server_url, postId, responseText, token)

	const { mutate: replyComment } = useReplyComment(server_url, postId, showReplyId, replyText, token)

	if (!comments) return null;

	return (
		<div className="scroll-smooth w-full max-w-md h-screen fixed top-0 right-0 bg-white shadow-lg overflow-y-auto">
			<div className="flex flex-row justify-between items-center p-4">
				<h2 className="text-lg sm:text-xl md:text-2xl">Responses ({comments.count})</h2>
				<button type="button" onClick={onClose}>
					<FiX className="w-5 h-5 sm:w-6 sm:h-6" />
				</button>
			</div>
			<div className="bg-slate-50 p-4 rounded-lg shadow-lg mx-4 mb-4">
				<p className="font-semibold text-sm sm:text-base mb-2">{username}</p>
				<textarea
					className="w-full h-24 sm:h-32 md:h-40 border-none p-2 bg-slate-50 focus:outline-none resize-none text-xs sm:text-sm"
					placeholder="What are your thoughts?" value={responseText} onChange={(e) => setResponseText(e.target.value)}
				/>
				<div className="flex flex-row justify-end items-center mt-2">
					<button type="button" className="mr-2 sm:mr-3 text-gray-600 hover:text-gray-800">
						<p className="text-xs sm:text-sm">Cancel</p>
					</button>
					<button type="button" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 transition duration-300 text-xs sm:text-sm" onClick={() => { addResponse(); setResponseText('') }}>
						<p>Respond</p>
					</button>
				</div>
			</div>
			<hr className="mx-4 border-t border-gray-300" />
			<div className="px-4">
				{comments.comments.map((comment) => (
					<div key={comment.id} className="mb-4 sm:mb-5 md:mb-6 bg-white p-3 sm:p-4 rounded-lg shadow">
						<p className="text-base sm:text-lg font-semibold mb-2">{comment.comment}</p>
						<div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
							<p>By: {comment.username}</p>
							<p>Posted on: {new Date(comment.created_at).toLocaleDateString()}</p>
						</div>
						<div className="flex flex-row justify-between">
							<div className="flex flex-row space-x-1 sm:space-x-2">
								<button type="button" onClick={() => setShowReplies(prevId => prevId === comment.id ? null : comment.id)}>
									<MdOutlineInsertComment className="w-5 h-5 sm:w-6 sm:h-6" />
								</button>
								<p className="text-xs sm:text-sm">{comment?.replies?.length}</p>
							</div>
							<button type="button" onClick={() => setShowReplyId(prevId => prevId === comment.id ? null : comment.id)}>
								<p className="text-xs sm:text-sm">Reply</p>
							</button>
						</div>
						{showReplyId === comment.id && (
							<div className="bg-slate-50 py-3 sm:py-4 md:py-5 rounded-lg shadow-lg mt-3 sm:mt-4 md:mt-5">
								<textarea
									className="w-full h-16 sm:h-20 border-none p-2 bg-slate-50 focus:outline-none resize-none text-xs sm:text-sm"
									placeholder={`Reply to ${comment.username}`}
									value={replyText}
									onChange={(e) => setReplyText(e.target.value)}
								/>
								<div className="flex flex-row justify-end mr-3 sm:mr-4 md:mr-5 items-center mt-2">
									<button type="button" className="mr-2 sm:mr-3 text-gray-600 hover:text-gray-800" onClick={() => setShowReplyId(null)}>
										<p className="text-xs sm:text-sm">Cancel</p>
									</button>
									<button type="button" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 transition duration-300 text-xs sm:text-sm" onClick={() => { replyComment(); setReplyText('') }}>
										<p>Respond</p>
									</button>
								</div>
							</div>
						)}
						{showReplies === comment.id && comment.replies.map((reply) => (
							<div key={reply.id} className="ml-3 sm:ml-4 mt-2 p-2 bg-gray-100 rounded">
								<p className="text-sm sm:text-base">{reply.comment}</p>
								<div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
									<p>By: {reply.username}</p>
									<p>Posted on: {new Date(reply.created_at).toLocaleDateString()}</p>
								</div>
							</div>
						))}
					</div>
				))}
			</div>
		</div>
	)
}