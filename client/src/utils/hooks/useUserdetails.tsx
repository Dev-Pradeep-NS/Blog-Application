import axios from "axios";
import { useQuery } from "react-query";
import type { Follower, User } from "../../interfaces";

export const useUserDetails = (server_url: string, token: string) => {
	return useQuery<User, Error>({
		queryKey: ['userDetails'],
		queryFn: async () => {
			const { data } = await axios.get(`${server_url}/users/`, {
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
		enabled: !!user_id && !!token && token.length > 0,
	});
};
