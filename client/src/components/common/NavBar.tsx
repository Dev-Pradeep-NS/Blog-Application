import { useAuth } from '../../utils/hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../utils/hooks/useAuth';
import { useState } from 'react';

const NavBar = () => {
	const { token } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { logout } = useAuth()

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	return (
		<div className="flex flex-col md:flex-row items-center my-2 justify-between">
			<div className="flex flex-row items-center w-full md:w-auto justify-between md:justify-start">
				<img src='/pB.png' alt="Logo" className="h-16 w-16 md:h-24 md:w-24" />
				<div className="hidden md:flex md:flex-row items-center space-x-4">
					<a href='/latest' className='cursor-pointer'>LATEST</a>
					<a href='/trending' className='cursor-pointer'>TRENDING</a>
					<a href='/contact-us' className='cursor-pointer'>CONTACT US</a>
				</div>
				<button className="md:hidden" onClick={toggleMenu} type='button'>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img">
						<title>Menu</title>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>
			<div className="hidden md:flex md:flex-row items-center space-x-4">
				<button type='button' className='flex flex-row space-x-2 items-center' onClick={() => navigate('/new-story')}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-label="Write">
						<title>Write</title>
						<path fill="currentColor" d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z" /><path stroke="currentColor" d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2" />
					</svg>
					<h1>Write</h1>
				</button>
				<button type='button' className='font-light border-green-500 bg-green-500 border py-1 px-3 rounded-3xl text-slate-100 hover:bg-green-900' onClick={() => navigate("/register")}>
					Sign up
				</button>
				<button type='button' className='font-light border-green-500 bg-green-500 border py-1 px-3 rounded-3xl text-slate-100 hover:bg-green-900' onClick={!token ? () => navigate("/login") : logout}>
					{!token ? "Sign in" : "Sign out"}
				</button>
			</div>
			<div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
				<div className="flex flex-col h-full">
					<div className="flex justify-between items-center p-4 border-b">
						<h2 className="text-xl font-semibold">Menu</h2>
						<button onClick={toggleMenu} className="text-gray-500 hover:text-gray-700" type='button'>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Close</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<nav className="flex-grow">
						<ul className="py-4 space-y-2">
							<li><a href="/latest" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">LATEST</a></li>
							<li><a href="/trending" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">TRENDING</a></li>
							<li><a href="/contact-us" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">CONTACT US</a></li>
						</ul>
					</nav>
					<div className="p-4 border-t">
						<button type='button' className='w-full mb-2 flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600' onClick={() => navigate('/new-story')}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" aria-label="Write">
								<title>Write</title>
								<path fill="currentColor" d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z" /><path stroke="currentColor" d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2" />
							</svg>
							<span>Write</span>
						</button>
						<button type='button' className='w-full mb-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600' onClick={() => navigate("/register")}>
							Sign up
						</button>
						<button type='button' className='w-full bg-white text-green-500 border border-green-500 py-2 px-4 rounded-full hover:bg-green-50' onClick={!token ? () => navigate("/login") : logout}>
							{!token ? "Sign in" : "Sign out"}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default NavBar;