import { createContext, useContext, useState, useEffect } from 'react';
import { useGetAccessToken } from './useGetAccesstoken';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext({ token: '' });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [token, setToken] = useState('');
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const { mutate: getToken } = useGetAccessToken(server_url);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		getToken(undefined, {
			onSuccess: (response) => {
				if (response.access_token) {
					setToken(response.access_token);
				} else {
					if (location.pathname !== '/register') {
						navigate('/login');
					}
				}
			},
			onError: (error) => {
				console.error("Error fetching access token:", error);
				if (location.pathname !== '/register') {
					navigate('/login');
				}
			},
		});
	}, [getToken, navigate, location]);

	return (
		<AuthContext.Provider value={{ token }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
