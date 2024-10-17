import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../config";

export const fetchImageUrl = async (avatarUrl: string) => {
	try {
		if (avatarUrl.startsWith('https://')) {
			return avatarUrl;
		}

		const storageRef = ref(storage, `avatars/${avatarUrl}`);
		const url = await getDownloadURL(storageRef);
		return url;
	} catch (error) {
		console.error("Error fetching image URL:", error);
		return "/specwiselogo.png";
	}
};
