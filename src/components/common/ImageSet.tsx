import type React from 'react';
import { useState, useEffect } from 'react';
import { fetchImageUrl } from '../../utils/helpers/firebaseUtils';

interface ProfileProps {
	source: string;
	classname: string;
}

const ImageSet: React.FC<ProfileProps> = ({ source, classname }) => {
	const [imageUrl, setImageUrl] = useState('/specwiselogo.png');

	useEffect(() => {
		const loadImage = async () => {
			if (source) {
				const url = await fetchImageUrl(source);
				setImageUrl(url);
			}
		};

		loadImage();
	}, [source]);

	return <img src={imageUrl} alt="Profile" className={classname} />;
};

export default ImageSet;
