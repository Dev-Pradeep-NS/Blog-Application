import type React from 'react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate()

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleImageLoad = () => {
		setIsLoading(false);
	};

	const explorePosts = () => {
		if (isAuthenticated)
			navigate('/posts')
		navigate('/register')
	}

	return (
		<div className="min-h-screen bg-gray-100 relative overflow-hidden">
			<AnimatePresence>
				<motion.div
					key={images[currentImageIndex]}
					className="absolute inset-0 w-full h-full"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}
				>
					<img
						src={images[currentImageIndex]}
						alt={`Background ${currentImageIndex + 1}`}
						className="w-full h-full object-cover"
						onLoad={handleImageLoad}
						style={{ display: isLoading ? 'none' : 'block' }}
					/>
				</motion.div>
			</AnimatePresence>
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
						<h1 className="text-3xl font-bold text-gray-900">Welcome to Pradeep Blog</h1>
					</div>
				</header>
				<main className="flex-grow flex items-center justify-center">
					<div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							className="bg-white bg-opacity-80 rounded-lg p-8 text-center"
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.5 }}
						>
							<h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 mb-4">Discover Amazing Content</h2>
							<p className="text-gray-500 text-sm sm:text-base md:text-lg mb-6">Stay tuned for insightful articles and engaging stories.</p>
							<motion.button
								className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm sm:text-base"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								type='button'
								onClick={() => explorePosts()}
							>
								Explore Posts
							</motion.button>
						</motion.div>
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