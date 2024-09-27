import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import type { Follower, User, Following } from "../../interfaces";

export const useUserDetails = (server_url: string, token: string) => {
	return useQuery<User, Error>({
		queryKey: ['userDetails'],
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return data;
		},
		enabled: !!token && token.length > 0,
	});
};

export const useUserDetailsById = (server_url: string, token: string, username: string | undefined) => {
	return useQuery<User, Error>({
		queryKey: ['userDetailsbyid'],
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/users/${username}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return data;
		},
		enabled: !!token && token.length > 0,
	});
};

export const useUserFollowers = (server_url: string, user_id: number, token: string) => {
	return useQuery<Follower, Error>({
		queryKey: ['userFollowers', user_id],
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/users/${user_id}/followers`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return data;
		},
		enabled: !!user_id && !!token && token.length > 0 && user_id > 0,
	});
};

export const useUserFollowing = (server_url: string, user_id: number, token: string) => {
	return useQuery<Following, Error>({
		queryKey: ['userFollowing', user_id],
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/users/${user_id}/following`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return data;
		},
		enabled: !!user_id && !!token && token.length > 0 && user_id > 0,
	});
};

export const useFollowUser = (server_url: string, followingID: number, token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => {
			return axios.post(`${server_url}/users/follow/${followingID}`,
				{}, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["userDetailsbyid"]
			});
			queryClient.invalidateQueries({
				queryKey: ["userFollowing"]
			});
			queryClient.invalidateQueries({
				queryKey: ["userFollowers"]
			});
		}
	})
}

export const useUnFollowUser = (server_url: string, followingID: number, token: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => {
			return axios.delete(`${server_url}/users/unfollow/${followingID}`,
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				}
			)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["userDetailsbyid"]
			});
			queryClient.invalidateQueries({
				queryKey: ["userFollowing"]
			});
			queryClient.invalidateQueries({
				queryKey: ["userFollowers"]
			});
		}
	})
}

export const useUpdateProfile = (server_url: string, token: string, user_id: number, username: string, email: string, bio: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => {
			return axios.put(`${server_url}/users/${user_id}`,
				{ username: username, email: email, bio: bio },
				{
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["userDetails"]
			})
		}
	})
}