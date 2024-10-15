import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className="container mx-auto max-w-sm">
			<div className="flex flex-col items-center justify-center min-h-screen">
				<h1 className="text-6xl font-bold mb-4 animate-bounce">404</h1>
				<h2 className="text-2xl font-semibold mb-4 animate-pulse">Page Not Found</h2>
				<div className="mb-6 relative">
					<img src="https://media.giphy.com/media/3o7aCTPPm4OHfRLSH6/giphy.gif" alt="Crazy gif" className="w-64 h-64 rounded-full" />
				</div>
				<p className="text-center mb-6 animate-pulse">
					Woah! The page you're looking for has vanished into thin air!
				</p>
				<Link
					to="/"
					className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded-full animate-pulse"
				>
					Escape to Home!
				</Link>
			</div>
		</div>
	);
};

export default NotFound;
