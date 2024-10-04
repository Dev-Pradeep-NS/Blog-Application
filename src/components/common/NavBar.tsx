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
		<div className="flex items-center justify-between py-2 font-heading font-bold">
			<div className="flex items-center">
				<Link to={`/@${user?.username}`}>
					<img src='/pB.png' alt="Logo" className="h-8 w-8" />
				</Link>
				{!category && <div className="hidden sm:flex ml-4 space-x-4">
					<Link to='/category/latest' className='text-sm'>Latest</Link>
					<Link to='/category/trending' className='text-sm'>Trending</Link>
				</div>}
			</div>
			<div className="flex items-center space-x-4">
				{isAuthenticated ? (
					<>
						<button type='button' onClick={() => navigate("/reading-list")}>
							<IoBookmarksOutline size={20} />
						</button>
						<button onClick={toggleSearch} type='button'>
							<CiSearch size={20} />
						</button>
						<button type='button' onClick={() => navigate('/new-story')} className="hidden sm:block text-sm">
							Write
						</button>
						<button type='button' onClick={logout} className="hidden sm:block text-sm bg-green-500 text-white px-3 py-1 rounded-full">
							Logout
						</button>
					</>
				) : (
					<>
						<button type='button' className='text-sm bg-green-500 text-white px-3 py-1 rounded-full' onClick={() => navigate("/login")}>
							Sign in
						</button>
					</>
				)}
				<button className="sm:hidden" onClick={toggleMenu} type='button'>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<title>some</title>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>
			</div>
			{showSearch && (
				<div className="absolute top-14 left-0 right-0 bg-white p-4 shadow-md">
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
			<div className={`sm:hidden fixed inset-0 bg-white z-50 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
				<div className="flex flex-col h-full p-4">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-xl font-semibold">Menu</h2>
						<button onClick={toggleMenu} className="text-gray-500" type='button'>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<title>toggle</title>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
					<nav className="flex-grow">
						<ul className="space-y-2">
							<li><Link to="/category/latest" className="block py-2">Latest</Link></li>
							<li><Link to="/category/trending" className="block py-2">Trending</Link></li>
							<li><Link to="/contact-us" className="block py-2">Contact Us</Link></li>
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