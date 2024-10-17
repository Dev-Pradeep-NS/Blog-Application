import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../utils/hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
	const images = [
		'/imageone.jpeg',
		'/imagetwo.jpeg',
		'/imagethree.jpeg',
		'/imagefour.jpeg'
	];

	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isHovering, setIsHovering] = useState(false);
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();

	const nextImage = useCallback(() => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
		setIsLoading(true);
	}, []);

	useEffect(() => {
		const interval = setInterval(nextImage, 8000);
		return () => clearInterval(interval);
	}, [nextImage]);

	const handleImageLoad = () => {
		setIsLoading(false);
	};

	const explorePosts = () => {
		if (isAuthenticated) navigate('/posts');
		else navigate('/register');
	};

	return (
		<div className="min-h-screen bg-gray-100 relative overflow-hidden">
			<div
				className="absolute inset-0 w-full h-full transition-opacity duration-1000"
				style={{
					backgroundImage: `url(${images[currentImageIndex]})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					opacity: isLoading ? 0 : 1
				}}
			>
				<img
					src={images[currentImageIndex]}
					alt={`Background ${currentImageIndex + 1}`}
					className="hidden"
					onLoad={handleImageLoad}
				/>
			</div>
			{isLoading && (
				<div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
					<span className='sr-only'>Loading...</span>
					<div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]' />
					<div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]' />
					<div className='h-8 w-8 bg-black rounded-full animate-bounce' />
				</div>
			)}
			<div className="relative z-10 min-h-screen flex flex-col">
				<header className="bg-white bg-opacity-80 shadow">
					<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold text-gray-900">Welcome to Specwise Blogs</h1>
					</div>
				</header>
				<main className="flex-grow flex items-center justify-center">
					<div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
						<div
							className="bg-white bg-opacity-80 rounded-lg p-8 text-center transform transition-all duration-300"
							style={{
								transform: isHovering ? 'scale(1.05)' : 'scale(1)',
								boxShadow: isHovering ? '0 10px 25px rgba(0, 0, 0, 0.1)' : 'none'
							}}
							onMouseEnter={() => setIsHovering(true)}
							onMouseLeave={() => setIsHovering(false)}
						>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 mb-4">Discover Amazing Content</h2>
							<p className="text-gray-500 text-sm sm:text-base md:text-lg mb-6">Stay tuned for insightful articles and engaging stories.</p>
							<button
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-base transition-all duration-300"
								style={{
									transform: isHovering ? 'translateY(-2px)' : 'translateY(0)',
									boxShadow: isHovering ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
								}}
								type="button"
								onClick={explorePosts}
							>
								Explore Posts
							</button>
						</div>
					</div>
				</main>
				<footer className="bg-white bg-opacity-80">
					<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
						<p className="text-center text-gray-500 text-sm">
							© {new Date().getFullYear()} My Blog. All rights reserved.
						</p>
					</div>
				</footer>
			</div>
		</div>
	);
};
export default HomePage;
