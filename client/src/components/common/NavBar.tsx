import { SocialIcon } from 'react-social-icons'
import { useAuth } from '../../utils/hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../utils/hooks/useAuth';

const NavBar = () => {
	const { token } = useAuth();
	const navigate = useNavigate();
	const logout = useLogout();

	const handleLogout = () => {
		logout();
	};

	return (
		<div className="flex flex-row items-center my-2 justify-between">
			<div className="flex flex-row items-center">
				<img src='/pB.png' alt="Logo" style={{ height: 100, width: 100 }} />
				<h2 className='mr-3'>LATEST</h2>
				<h2 className='mx-3'>TRENDING</h2>
				<div className="font-bold text-orange-500">|</div>
				<h2 className='mx-3'>CONTACT US</h2>
			</div>
			<div className="flex flex-row items-center justify-around space-x-4">
				<button type='button' className='flex flex-row space-x-2' onClick={() => navigate('/new-story')}>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" aria-label="Write">
						<title>Write</title>
						<path fill="currentColor" d="M14 4a.5.5 0 0 0 0-1zm7 6a.5.5 0 0 0-1 0zm-7-7H4v1h10zM3 4v16h1V4zm1 17h16v-1H4zm17-1V10h-1v10zm-1 1a1 1 0 0 0 1-1h-1zM3 20a1 1 0 0 0 1 1v-1zM4 3a1 1 0 0 0-1 1h1z" /><path stroke="currentColor" d="m17.5 4.5-8.458 8.458a.25.25 0 0 0-.06.098l-.824 2.47a.25.25 0 0 0 .316.316l2.47-.823a.25.25 0 0 0 .098-.06L19.5 6.5m-2-2 2.323-2.323a.25.25 0 0 1 .354 0l1.646 1.646a.25.25 0 0 1 0 .354L19.5 6.5m-2-2 2 2" />
					</svg>
					<h1>Write</h1>
				</button>
				<button type='button' className='font-light border-green-500 bg-green-500 border py-1 px-3 rounded-3xl text-slate-100 hover:bg-green-900' onClick={() => navigate("/register")}>
					Sign up
				</button>
				<button type='button' className='font-light border-green-500 bg-green-500 border py-1 px-3 rounded-3xl text-slate-100 hover:bg-green-900' onClick={!token ? () => navigate("/login") : handleLogout}>
					{!token ? "Sign in" : "Sign out"}
				</button>
			</div>
		</div>
	)
}

export default NavBar;