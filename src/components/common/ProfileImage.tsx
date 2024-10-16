import type React from 'react';
import { useState, useEffect } from 'react';
import { fetchImageUrl } from '../../utils/helpers/firebaseUtils';

interface ProfileProps {
	profile: {
		avatar_url?: string;
	};
}

const ProfileImage: React.FC<ProfileProps> = ({ profile }) => {
	const [imageUrl, setImageUrl] = useState('/specwiselogo.png');

	useEffect(() => {
		const loadImage = async () => {
			if (profile.avatar_url) {
				const url = await fetchImageUrl(profile.avatar_url);
				setImageUrl(url);
			}
		};

		loadImage();
	}, [profile.avatar_url]);

	return <img src={imageUrl} alt="Profile" className="w-16 h-16 rounded-full mb-3 sm:mb-0 sm:mr-3" />;
};

export default ProfileImage;
