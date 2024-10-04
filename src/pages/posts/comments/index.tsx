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
				<h2 className="text-sm sm:text-base md:text-lg">Responses ({comments.count})</h2>
				<button type="button" onClick={onClose}>
					<FiX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
				</button>
			</div>
			<div className="bg-slate-50 p-4 rounded-lg shadow-lg mx-4 mb-4">
				<p className="font-semibold text-xs sm:text-sm mb-2">{username}</p>
				<textarea
					className="w-full h-16 sm:h-22 md:h-28 border-none p-2 bg-slate-50 focus:outline-none resize-none text-2xs sm:text-xs"
					placeholder="What are your thoughts?" value={responseText} onChange={(e) => setResponseText(e.target.value)}
				/>
				<div className="flex flex-row justify-end items-center mt-2">
					<button type="button" className="mr-2 sm:mr-3 text-gray-600 hover:text-gray-800">
						<p className="text-2xs sm:text-xs">Cancel</p>
					</button>
					<button type="button" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-full px-2 py-0.5 sm:px-3 sm:py-1.5 transition duration-300 text-2xs sm:text-xs" onClick={() => { addResponse(); setResponseText('') }}>
						<p>Respond</p>
					</button>
				</div>
			</div>
			<hr className="mx-4 border-t border-gray-300" />
			<div className="px-4">
				{comments.comments.map((comment) => (
					<div key={comment.id} className="mb-3 sm:mb-3.5 md:mb-4 bg-white p-2 sm:p-3 rounded-lg shadow">
						<p className="text-sm sm:text-sm font-semibold mb-2">{comment.comment}</p>
						<div className="flex justify-between text-2xs sm:text-xs text-gray-600 mb-2">
							<p>By: {comment.username}</p>
							<p>Posted on: {new Date(comment.created_at).toLocaleDateString()}</p>
						</div>
						<div className="flex flex-row justify-between">
							<div className="flex flex-row space-x-1 sm:space-x-2">
								<button type="button" onClick={() => setShowReplies(prevId => prevId === comment.id ? null : comment.id)}>
									<MdOutlineInsertComment className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
								</button>
								<p className="text-2xs sm:text-xs">{comment?.replies?.length}</p>
							</div>
							<button type="button" onClick={() => setShowReplyId(prevId => prevId === comment.id ? null : comment.id)}>
								<p className="text-2xs sm:text-xs">Reply</p>
							</button>
						</div>
						{showReplyId === comment.id && (
							<div className="bg-slate-50 py-2 sm:py-3 md:py-3.5 rounded-lg shadow-lg mt-2 sm:mt-3 md:mt-3.5">
								<textarea
									className="w-full h-11 sm:h-14 border-none p-2 bg-slate-50 focus:outline-none resize-none text-2xs sm:text-xs"
									placeholder={`Reply to ${comment.username}`}
									value={replyText}
									onChange={(e) => setReplyText(e.target.value)}
								/>
								<div className="flex flex-row justify-end mr-2 sm:mr-3 md:mr-3.5 items-center mt-2">
									<button type="button" className="mr-2 sm:mr-3 text-gray-600 hover:text-gray-800" onClick={() => setShowReplyId(null)}>
										<p className="text-2xs sm:text-xs">Cancel</p>
									</button>
									<button type="button" className="bg-emerald-400 hover:bg-emerald-500 text-white rounded-full px-2 py-0.5 sm:px-3 sm:py-1.5 transition duration-300 text-2xs sm:text-xs" onClick={() => { replyComment(); setReplyText('') }}>
										<p>Respond</p>
									</button>
								</div>
							</div>
						)}
						{showReplies === comment.id && comment.replies.map((reply) => (
							<div key={reply.id} className="ml-2 sm:ml-3 mt-1.5 p-1.5 bg-gray-100 rounded">
								<p className="text-xs sm:text-sm">{reply.comment}</p>
								<div className="flex justify-between text-2xs sm:text-xs text-gray-600 mb-0.5 sm:mb-1.5">
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