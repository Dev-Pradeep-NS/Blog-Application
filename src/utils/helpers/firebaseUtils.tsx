import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../config";

export const fetchImageUrl = async (imagePath: string) => {
	try {
		const url = await getDownloadURL(ref(storage, imagePath));
		return url;
	} catch (error) {
		console.error("Error fetching image URL:", error);
		return "/specwiselogo.png";
	}
};
