import axios from "axios"
import { useMutation, useQuery, useQueryClient } from "react-query"

export const useBookmarks = (server_url: string, token: string) => {
	return useQuery({
		queryKey: ["bookmarks"],
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/users/bookmarks`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			return data
		}
	})
}

export const useBookmarkPost = (server_url: string, post_id: number, token: string) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => {
			return axios.post(`${server_url}/users/${post_id}/bookmark`, {}, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["bookmarks"]
			})
		}
	})
}