import { useAuth } from '../../utils/hooks/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
	const { postData } = usePostStore();
	const [suggestions, setSuggestions] = useState<ItemType[]>([]);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const { user } = useUserStore();
	const { category } = useParams();

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
		<div className="flex items-center justify-between py-2 font-bold -my-5 px-4 md:px-8 lg:-ml-10 sm:-ml-5 md:-ml-0">
			<div className="flex items-center">
				<Link to={"/posts"}>
					<img src='/specwiselogo.png' alt="Logo" className="h-16 w-16 md:h-20 md:w-20 pt-3" />
				</Link>
				{!category && <div className="hidden md:flex space-x-4">
					<Link to='/category/latest' className='text-base'>Latest</Link>
					<Link to='/category/trending' className='text-base'>Trending</Link>
				</div>}
			</div>
			<div className="flex items-center space-x-4">
				<button type='button' onClick={() => navigate("/reading-list")} className="hidden sm:block">
					<IoBookmarksOutline size={20} />
				</button>
				<div className="hidden md:flex items-center">
					<button onClick={toggleSearch} type='button'>
						<CiSearch size={24} />
					</button>
					{showSearch && (
						<div className="ml-2 relative">
							<form onSubmit={handleSearch} className='flex'>
								<input
									ref={searchInputRef}
									type="text"
									value={searchQuery}
									onChange={handleSearchChange}
									placeholder="Search..."
									className="w-full border rounded-md px-2 py-1 text-sm font-normal"
								/>
							</form>
							{suggestions.length > 0 && (
								<div ref={suggestionsRef} className="absolute mt-2 bg-white shadow-md w-full">
									{suggestions.map((suggestion) => (
										<div
											key={suggestion.id}
											className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
											onClick={() => handleSuggestionClick(suggestion)}
											onKeyDown={(e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													handleSuggestionClick(suggestion)
												}
											}}
											role="button"
											tabIndex={0}
										>
											<p className='text-sm font-normal'>{suggestion.title}</p>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
				<button onClick={toggleSearch} type='button' className="md:hidden">
					<CiSearch size={24} />
				</button>
				<button type='button' onClick={() => navigate('/new-story')} className="hidden md:block text-base">
					Write
				</button>
				<div className="relative ml-3 hidden md:block">
					<div>
						<button
							type="button"
							className="relative flex rounded-full bg-blue-600 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
							id="user-menu-button"
							aria-expanded={isMenuOpen}
							aria-haspopup="true"
							onClick={toggleMenu}
						>
							<span className="absolute -inset-1.5" />
							<span className="sr-only">Open user menu</span>
							<div className='h-8 w-8 rounded-full text-white bg-blue-600 flex items-center justify-center'>
								<span className="text-sm font-medium">{user?.username.charAt(0).toUpperCase()}</span>
							</div>
						</button>
					</div>

					{isMenuOpen && (
						<div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
							<a href={`/${user?.username}`} className="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center" role="menuitem" tabIndex={-1} id="user-menu-item-0">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<title>profile</title>
									<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
								</svg>
								Your Profile
							</a>
							<a href="/chart" className="px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center" role="menuitem" tabIndex={-1} id="user-menu-item-1">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<title>stats</title>
									<path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
									<path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
								</svg>
								Stats
							</a>
							<button className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 flex items-center" role="menuitem" type='button' onClick={logout} tabIndex={-1} id="user-menu-item-2">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
									<title>sign out</title>
									<path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
								</svg>
								Sign out
							</button>
						</div>
					)}
				</div>
				<button className="md:hidden" onClick={toggleMenu} type='button'>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<title>Menu</title>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>
			{showSearch && (
				<div className="md:hidden absolute top-14 left-0 right-0 bg-white p-4 shadow-md">
					<form onSubmit={handleSearch} className='flex'>
						<input
							ref={searchInputRef}
							type="text"
							value={searchQuery}
							onChange={handleSearchChange}
							placeholder="Search..."
							className="w-full border rounded-md px-2 py-1"
						/>
					</form>
					{suggestions.length > 0 && (
						<div ref={suggestionsRef} className="mt-2">
							{suggestions.map((suggestion) => (
								<div
									key={suggestion.id}
									className="py-2 hover:bg-gray-100 cursor-pointer"
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
			<div className={`md:hidden fixed inset-0 bg-white z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
				<div className="flex flex-col h-full p-4">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Menu</h2>
						<button onClick={toggleMenu} className="text-gray-500" type='button'>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>Close</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<nav className="flex-grow">
						<ul className="space-y-2">
							<li><Link to="/category/latest" className="block py-2">Latest</Link></li>
							<li><Link to="/category/trending" className="block py-2">Trending</Link></li>
							<li><Link to="/contact-us" className="block py-2">Contact Us</Link></li>
							<li><Link to="/reading-list" className="block py-2">Reading List</Link></li>
							<li><Link to={`/${user?.username}`} className="block py-2">Your Profile</Link></li>
							<li><Link to="/chart" className="block py-2">Stats</Link></li>
						</ul>
					</nav>
					<div className="mt-auto">
						{isAuthenticated ? (
							<>
								<button type='button' className='w-full mb-2 bg-green-500 text-white py-2 rounded-full' onClick={() => navigate('/new-story')}>
									Write
								</button>
								<button type='button' className='w-full bg-green-500 text-white py-2 rounded-full' onClick={logout}>
									Logout
								</button>
							</>
						) : (
							<button type='button' className='w-full bg-green-500 text-white py-2 rounded-full' onClick={() => navigate("/login")}>
								Sign in
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default NavBar;