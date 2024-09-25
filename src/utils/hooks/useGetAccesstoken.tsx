import axios from "axios"
import { useMutation } from "react-query"

export const useGetAccessToken = (server_url: string) => {
	return useMutation({
		mutationFn: async () => {
			const response = await axios.post(`${server_url}/refresh`, {}, {
				withCredentials: true
			});
			return response.data;
		},
	});
};
