import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "react-query"
import type { Comments } from "../../interfaces";

export const useComment = (server_url: string, post_id: number, token: string) => {
	return useQuery({
		queryKey: ['comments', post_id],
		queryFn: async () => {
			const { data } = await axios(`${server_url}/posts/${post_id}/comments`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			return data as Comments;
		},
		enabled: post_id > 0 && !Number.isNaN(post_id)
	});
}

export const usePostComment = (server_url: string, post_id: number | undefined, comment: string, token: string) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => {
			return axios.post(`${server_url}/posts/${post_id}/comments`, { comment: comment }, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["comments"]
			})
		}
	})
}

export const useReplyComment = (server_url: string, post_id: number | undefined, parentId: number | null, comment: string, token: string) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () => {
			return axios.post(`${server_url}/posts/${post_id}/comments?parent_id=${parentId}`, { comment: comment }, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["comments"]
			})
		}
	})
}