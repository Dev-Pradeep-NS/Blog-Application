import axios from "axios";
import { QueryClient, useMutation, useQuery } from "react-query";
import { usePostStore } from "../../store";
import type { ItemType, PostData, PostDataForEmail } from "../../interfaces";
import { useNavigate } from "react-router-dom";
import { useSendEmail } from "./useSendEmail";
import { useGetUserandEmail } from "./useUserdetails";

export const usePost = (server_url: string, token: string) => {
	const { setPostData } = usePostStore();

	return useQuery({
		queryKey: ["getPosts"],
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/posts`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
			setPostData(data);
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
	const { data: usersemails } = useGetUserandEmail(server_url, token);
	const sendEmail = useSendEmail();

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
		},
		onSuccess: async (response) => {
			if (usersemails && Array.isArray(usersemails.Users) && response.data) {
				const postDetails: PostDataForEmail = {
					title: response.data.post.title,
					author: response.data.user.username,
					image: response.data.post.featuredImage_url,
					description: response.data.post.description,
					link: `${window.location.origin}/@${response.data.user.username}/${response.data.post.slug}`,
				};

				try {
					await sendEmail.mutateAsync({ users: usersemails.Users, post: postDetails });
					console.log('Email sent successfully');
				} catch (error) {
					console.error('Failed to send email:', error);
				}
			} else {
				console.log('No users to send email to');
			}

			navigate('/posts');
		},
		onError: (error) => {
			console.error('Post creation failed', error);
		},
	});
};

export const useDeletePost = (server_url: string, token: string, post_id: number) => {
	const queryClient = new QueryClient()
	const navigate = useNavigate()
	return useMutation({
		mutationFn: async () => {
			const response = await axios.delete(`${server_url}/posts/${post_id}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			return response
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["getPosts"]
			});
			navigate("/posts")
		}
	})
}