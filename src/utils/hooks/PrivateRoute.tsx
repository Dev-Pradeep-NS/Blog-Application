import type React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { isAuthenticated, token } = useAuth();
	const [shouldRedirect, setShouldRedirect] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!isAuthenticated && !token) {
				setShouldRedirect(true);
			}
		}, 3000);

		return () => clearTimeout(timer);
	}, [isAuthenticated, token]);

	if (shouldRedirect) {
		return <Navigate to="/login" />;
	}

	return <>{children}</>;
};

export default PrivateRoute;
