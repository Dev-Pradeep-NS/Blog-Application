import { useAuth } from "../hooks/AuthContext";

const useImageUrls = () => {
	const { token } = useAuth();

	const getImageUrl = (imageUrl: string) => {
		return `${imageUrl}?token=${token}`;
	};

	const getAvatarUrl = (imageUrl: string) => {
		let processedImageUrl: string = imageUrl;
		if (imageUrl.startsWith('http://localhost:8000')) {
			processedImageUrl = imageUrl.replace('http://localhost:8000', '/users');
		} else if (!imageUrl.startsWith('/users')) {
			processedImageUrl = `/users${processedImageUrl}`;
		}
		return `http://localhost:8000${processedImageUrl}?token=${token}`;
	};

	return { getImageUrl, getAvatarUrl };
};

export default useImageUrls;
