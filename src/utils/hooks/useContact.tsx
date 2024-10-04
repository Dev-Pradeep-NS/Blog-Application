import axios from "axios"
import { useMutation } from "react-query"
import type { ContactData } from "../../interfaces"
import { useNavigate } from "react-router-dom"

export const useAddContact = (server_url: string, token: string) => {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (contactData: ContactData) => {
			return axios.post(`${server_url}/contact-us`, contactData, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
		},
		onSuccess: () => {
			navigate("/posts");
		}
	});
};