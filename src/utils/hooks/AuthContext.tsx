import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useGetAccessToken } from './useGetAccesstoken';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from './useAuth';

const AuthContext = createContext({
	token: '',
	isAuthenticated: false,
	refreshToken: () => { },
	logout: () => { },
	setIsAuthenticated: (value: boolean) => { },
	setToken: (value: string) => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string>('');
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const server_url = process.env.REACT_APP_SERVER_URL || '';
	const { mutate: getToken } = useGetAccessToken(server_url);
	const { mutate: logoutMutation } = useLogout(server_url);
	const navigate = useNavigate();

	const refreshToken = useCallback(() => {
		getToken(undefined, {
			onSuccess: (response) => {
				if (response.access_token) {
					setToken(response.access_token);
					setIsAuthenticated(true);
				} else {
					console.log("there")
					setIsAuthenticated(false);
				}
			},
			onError: (error) => {
				console.error("Error fetching access token:", error);
				setIsAuthenticated(false);
			},
		});
	}, [getToken]);

	const logout = useCallback(() => {
		logoutMutation(undefined, {
			onSuccess: () => {
				setToken('');
				setIsAuthenticated(false);
				navigate('/login');
			},
			onError: (error) => {
				console.error("Failed to logout:", error);
			}
		});
	}, [logoutMutation, navigate]);

	useEffect(() => {
		if (!isAuthenticated) {
			refreshToken();
		}
	}, [isAuthenticated, refreshToken]);

	return (
		<AuthContext.Provider value={{ token, isAuthenticated, refreshToken, logout, setIsAuthenticated, setToken }}>
			{children}
		</AuthContext.Provider>
	);
};
export const useAuth = () => {
	return useContext(AuthContext);
};
