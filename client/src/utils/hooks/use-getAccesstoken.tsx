import axios from "axios"
import { useMutation, useQuery } from "react-query"

export const useGetAccessToken = (server_url: string) => {
	return useMutation({
		mutationFn: () => {
			return axios.post(`${server_url}/refresh`, {}, {
				headers: {
					'Refresh-Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjczMzAxOTAsInVzZXJfaWQiOjIsInVzZXJuYW1lIjoibmV3dXNlciJ9.ImuwDxCi3CUwuWFjp97A_ArfdRQehLXTm4So7nnWeRk'
				}
			})
		},
	})
}