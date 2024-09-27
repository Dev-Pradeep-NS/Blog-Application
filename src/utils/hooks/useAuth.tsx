import axios from "axios";
import { useMutation, useQuery } from "react-query";
import type { IFormInput, IResetPasswordInput } from "../../interfaces";

export const useRegister = (server_url: string) => {
	return useMutation({
		mutationFn: async (data: IFormInput) => {
			const response = await axios.post(
				`${server_url}/register`,
				{
					username: data.username.split(' ').join(''),
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

export const useVerifyEmail = (server_url: string, email: string) => {
	return useQuery({
		queryFn: async () => {
			const response = await axios.get(`${server_url}/verifyemail/${email}`,
				{
				}
			)
			return response
		},
		enabled: !!email && email.length > 0
	})
}

export const useResetPassword = (server_url: string) => {
	return useMutation<void, Error, IResetPasswordInput>({
		mutationFn: async (data: IResetPasswordInput) => {
			const response = await axios.put(`${server_url}/reset-password`, {
				email: data.email,
				oldPassword: data.oldPassword,
				newPassword: data.newPassword,
			});
			return response.data;
		},
	});
};