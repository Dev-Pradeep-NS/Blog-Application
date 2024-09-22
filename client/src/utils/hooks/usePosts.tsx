import axios from "axios";
import { useMutation, useQuery } from "react-query";
import type { ItemType, PostData } from "../../interfaces";
import { useNavigate } from "react-router-dom";

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
		enabled: token.length > 0 && !!token,
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
		},
		enabled: token.length > 0 && !!token,
	})
}

export const useCreatePost = (server_url: string, token: string) => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (postData: PostData) => {
			const formData = new FormData();
			for (const [key, value] of Object.entries(postData)) {
				if (value !== undefined) {
					formData.append(key, value);
				}
			}

			return axios.post(`${server_url}/posts`, formData, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'multipart/form-data'
				}
			});
		}, onSuccess: () => {
			navigate("/");
		}
	});
};
