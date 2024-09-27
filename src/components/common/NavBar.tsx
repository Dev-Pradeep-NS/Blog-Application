import { useAuth } from '../../utils/hooks/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { IoBookmarksOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { usePostStore, useUserStore } from "../../store";
import type { ItemType } from "../../interfaces";
import { useUserDetails } from '../../utils/hooks/useUserdetails';

const NavBar = () => {
	const { isAuthenticated } = useAuth();
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [showSearch, setShowSearch] = useState(false);
	const { logout } = useAuth();
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	const { postData } = usePostStore();
	const [suggestions, setSuggestions] = useState<ItemType[]>([]);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const { user } = useUserStore();
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
				setSuggestions([]);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (showSearch && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [showSearch]);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const toggleSearch = () => {
		setShowSearch(!showSearch);
	};

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const query = e.target.value;
		setSearchQuery(query);

		if (query.trim()) {
			const filtered = postData.filter(post =>
				post.title.toLowerCase().includes(query.toLowerCase())
			).slice(0, 5);
			setSuggestions(filtered);
		} else {
			setSuggestions([]);
		}
	};

	const handleSuggestionClick = (suggestion: ItemType) => {
		setSearchQuery(suggestion.title);
		setSuggestions([]);
		navigate(`/@${suggestion.user.username}/${suggestion.slug}`);
	};

	return (
		<div className="flex flex-col sm:flex-row items-center my-2 justify-between px-4">
			<div className="flex flex-row items-center w-full sm:w-auto justify-between sm:justify-start">
				<Link to={`/@${user?.username}`}>
					<img src='/pB.png' alt="Logo" className="h-12 w-12 sm:h-16 sm:w-16 md:h-24 md:w-24" />
				</Link>
				<div className="hidden sm:flex sm:flex-row items-center space-x-4">
					<Link to='/category/latest' className='cursor-pointer'>LATEST</Link>
					<Link to='/category/trending' className='cursor-pointer'>TRENDING</Link>
					<Link to='/category/contact-us' className='cursor-pointer'>CONTACT US</Link>
				</div>
				<div className="flex items-center space-x-2 ml-auto">
					{isMobile && isAuthenticated && (
						<>
							<button type='button' className='flex flex-row space-x-2 items-center' onClick={() => navigate("/reading-list")}>
								<IoBookmarksOutline size={24} />
							</button>
							<button onClick={toggleSearch} type='button' className='flex flex-row space-x-2 items-center'>
								<CiSearch size={24} />
							</button>
						</>
					)}
					<button className="sm:hidden" onClick={toggleMenu} type='button'>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" role="img">
							<title>Menu</title>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</div>
			<div className="hidden sm:flex sm:flex-row items-center space-x-4">
				{isAuthenticated ? (
					<>
						<button type='button' className='flex flex-row space-x-2 items-center' onClick={() => navigate("/reading-list")}>
							<IoBookmarksOutline size={24} />
						</button>
						{showSearch ? (
							<div className="relative">
								<form onSubmit={handleSearch} className='flex flex-row space-x-2 items-center'>
									<input
										ref={searchInputRef}
										type="text"
										value={searchQuery}
										onChange={handleSearchChange}
										placeholder="Search..."
										className="border rounded-md px-2 py-1 w-80"
									/>
								</form>
								{suggestions.length > 0 && (
									<div ref={suggestionsRef} className="absolute z-10 bg-white border border-gray-300 mt-1 w-full rounded-md shadow-lg">
										<p className="px-4 py-2 text-black font-semibold text-base">FROM THIS PUBLICATION</p>
										<hr />
										{suggestions.map((suggestion) => (
											<div
												key={suggestion.id}
												className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
												onClick={() => handleSuggestionClick(suggestion)}
												onKeyDown={(e) => {
													if (e.key === 'Enter' || e.key === ' ') {
														handleSuggestionClick(suggestion)
													}
												}}
												role="button"
												tabIndex={0}
											>
												{suggestion.title}
											</div>
										))}
									</div>
								)}
							</div>
						) : (
							<button onClick={toggleSearch} type='button' className='flex flex-row space-x-2 items-center'>
								<CiSearch size={30} />
							</button>
						)}
					</>
				) : (
					<>
						<button type='button' className='font-light border-green-500 bg-green-500 border py-1 px-3 rounded-3xl text-slate-100 hover:bg-green-900' onClick={() => navigate("/register")}>
							Sign up
						</button>
						<button type='button' className='font-light border-green-500 bg-green-500 border py-1 px-3 rounded-3xl text-slate-100 hover:bg-green-900' onClick={() => navigate("/login")}>
							Sign in
						</button>
					</>
				)}
				{isAuthenticated ? (
					<div className='items-center flex flex-row space-x-4'>
						<button type='button' className='flex flex-row space-x-2 items-center' onClick={() => navigate('/new-story')}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-label="Write">
								<title>Write</title>
								<path fill="currentColor" d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z" />
								<path stroke="currentColor" d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2" />
							</svg>
							<span>Write</span>
						</button>
						<button type='button' className='flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600' onClick={logout}>Logout</button>
					</div>
				) : (
					<>
						<button type='button' className='font-light border-green-500 bg-green-500 border py-1 px-3 rounded-3xl text-slate-100 hover:bg-green-900 mr-2' onClick={() => navigate("/register")}>
							Sign up
						</button>
						<button type='button' className='font-light border-green-500 bg-green-500 border py-1 px-3 rounded-3xl text-slate-100 hover:bg-green-900' onClick={() => navigate("/login")}>
							Sign in
						</button>
					</>
				)}
			</div>
			<div className={`sm:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
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
							<li><Link to="/category/latest" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">LATEST</Link></li>
							<li><Link to="/category/trending" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">TRENDING</Link></li>
							<li><Link to="/category/contact-us" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">CONTACT US</Link></li>
						</ul>
					</nav>
					<div className="p-4 border-t">
						<button type='button' className='w-full mb-2 flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600' onClick={() => navigate('/new-story')}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" aria-label="Write">
								<title>Write</title>
								<path fill="currentColor" d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z" />
								<path stroke="currentColor" d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2" />
							</svg>
							<span>Write</span>
						</button>
						<button type='button' className='w-full mb-2 flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600' onClick={() => logout}>Logout</button>
						{!isAuthenticated && (
							<>
								<button type='button' className='w-full mb-2 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600' onClick={() => navigate("/register")}>
									Sign up
								</button>
							</>
						)}
					</div>
				</div>
			</div>
			{showSearch && isMobile && (
				<div className="fixed inset-0 bg-white z-50 flex flex-col">
					<div className="p-4 border-b flex items-center justify-between">
						<form onSubmit={handleSearch} className='flex-grow mr-4'>
							<input
								ref={searchInputRef}
								type="text"
								value={searchQuery}
								onChange={handleSearchChange}
								placeholder="Search..."
								className="w-full border rounded-md px-2 py-1"
							/>
						</form>
						<button onClick={toggleSearch} className="text-gray-500 hover:text-gray-700" type='button'>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Close</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					{suggestions.length > 0 && (
						<div ref={suggestionsRef} className="flex-grow overflow-y-auto">
							<p className="px-4 py-2 text-black font-semibold text-base">FROM THIS PUBLICATION</p>
							<hr />
							{suggestions.map((suggestion) => (
								<div
									key={suggestion.id}
									className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
									onClick={() => handleSuggestionClick(suggestion)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											handleSuggestionClick(suggestion)
										}
									}}
									role="button"
									tabIndex={0}
								>
									{suggestion.title}
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default NavBar;