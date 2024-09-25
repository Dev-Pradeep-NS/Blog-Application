import axios from "axios";
import { useMutation } from "react-query";
import type { IFormInput } from "../../interfaces";

export const useRegister = (server_url: string) => {
	return useMutation({
		mutationFn: async (data: IFormInput) => {
			const response = await axios.post(
				`${server_url}/register`,
				{
					username: data.username,
					email: data.email,
					password: data.password,
				},
				{
					headers: {
						'Content-Type': 'application/json'
					},
					withCredentials: true
				}
			);
			return response.data;
		}
	});
};

export const useLogin = (server_url: string) => {
	return useMutation({
		mutationFn: async (data: Pick<IFormInput, 'email' | 'password'>) => {
			const response = await axios.post(
				`${server_url}/login`,
				{
					email: data.email,
					password: data.password,
				},
				{
					headers: {
						'Content-Type': 'application/json'
					},
					withCredentials: true
				}
			);
			return response.data;
		}
	});
};


export const useLogout = (server_url: string) => {
	return useMutation({
		mutationFn: async () => {
			const response = await axios.post(`${server_url}/logout`, {}, {
				withCredentials: true
			}
			);
			return response
		}
	})
};
