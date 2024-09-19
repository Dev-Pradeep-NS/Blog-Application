import axios from "axios";
import { useQuery } from "react-query";
import type { ItemType } from "../../interfaces";

export const usePost = (server_url: string, token: string) => {
	return useQuery({
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/posts`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
			return data as ItemType;
		},
	});
};

export const useShowPost = (server_url: string, userName: string, slug: string, token: string) => {
	return useQuery({
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/posts/${userName}/${slug}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			return data as ItemType
		}
	})
}