import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useLogin } from "../../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { IFormInput } from "../../interfaces";
import { useAuth } from "../../utils/hooks/AuthContext";
import { useEffect } from "react";

const Login = () => {
	const navigate = useNavigate();
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || '';

	useEffect(() => {
		if (token && token.length > 0) {
			navigate('/')
		}
	}, [token, navigate])

	const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
	const { mutate: handleLogin, isLoading, error } = useLogin(server_url);

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		handleLogin(
			{ email: data.email, password: data.password },
			{
				onSuccess: (response) => {
					if (response.refresh_token) {
						navigate('/');
					} else {
						console.error("No refresh token received");
					}
				},
				onError: (error) => {
					console.error("Login failed:", error);
				},
			}
		);
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.toString()}</div>;
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
			<div className="flex flex-col sm:flex-row items-center bg-white shadow-2xl rounded-xl w-full max-w-4xl">
				<img src="/Logo.png" alt="" className="w-full sm:w-1/2 max-w-xs mx-auto sm:mx-0 mb-8 sm:mb-0" />
				<div className="w-full sm:w-1/2 p-6 sm:p-10 space-y-4 sm:space-y-6">
					<h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-8">Login</h2>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
						<div>
							<label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
							<input
								id="email"
								type="email"
								{...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
								className="w-full px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							/>
							{errors.email && <span className="text-xs italic text-red-500 mt-1">{errors.email.message}</span>}
						</div>
						<div>
							<label htmlFor="password" className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
							<input
								id="password"
								type="password"
								{...register("password", { required: "Password is required" })}
								className="w-full px-3 sm:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							/>
							{errors.password && <span className="text-xs italic text-red-500 mt-1">{errors.password.message}</span>}
						</div>
						<button
							type="submit"
							className="w-full px-4 py-2 sm:py-3 text-sm sm:text-base font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
						>
							Login
						</button>
					</form>
					<div className="text-center mt-4">
						<p className="text-xs sm:text-sm text-gray-600">
							Don't have an account?{" "}
							<Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
								Register here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;