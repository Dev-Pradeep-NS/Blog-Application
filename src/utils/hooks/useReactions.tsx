import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "react-query"

export const useReactions = (server_url: string, post_id: number, token: string) => {
	return useQuery({
		queryKey: ["likesanddislikes", post_id],
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/posts/${post_id}/reactions`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			return data
		},
		enabled: post_id > 0 && !Number.isNaN(post_id)
	})
}

export const useLikePost = (server_url: string, post_id: number, token: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => {
			return axios.post(`${server_url}/posts/${post_id}/like`, {}, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["likesanddislikes", post_id]
			});
			queryClient.invalidateQueries({
				queryKey: ["getPosts"]
			});
		}
	});
};

export const useDisLikePost = (server_url: string, post_id: number, token: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => {
			return axios.post(`${server_url}/posts/${post_id}/dislike`, {}, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["likesanddislikes", post_id]
			});
			queryClient.invalidateQueries({
				queryKey: ["getPosts"]
			});
		}
	});
};