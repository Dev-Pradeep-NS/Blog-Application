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
	const { token, setIsAuthenticated, setToken } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || window.env.REACT_APP_SERVER_URL;

	useEffect(() => {
		if (token && token.length > 0) {
			navigate('/posts')
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
						setIsAuthenticated(true);
						setToken(response.access_token);
						navigate('/posts');
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
		return <div className='flex space-x-2 justify-center items-center bg-white h-screen dark:invert'>
			<span className='sr-only'>Loading...</span>
			<div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]' />
			<div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]' />
			<div className='h-8 w-8 bg-black rounded-full animate-bounce' />
		</div>;
	}

	if (error) {
		return <div>Error: {error.toString()}</div>;
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
			<div className="flex flex-col sm:flex-row items-center bg-white shadow-xl rounded-lg w-full max-w-3xl">
				<img src="/specwiselogo.png" alt="" className="w-full sm:w-2/5 max-w-xs mx-auto sm:mx-0 mb-6 sm:mb-0" />
				<div className="w-full sm:w-3/5 p-4 sm:p-6 space-y-3 sm:space-y-4">
					<h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-5">Login</h2>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
						<div>
							<label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
							<input
								id="email"
								type="email"
								{...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
								className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300"
							/>
							{errors.email && <span className="text-xs italic text-red-500 mt-1">{errors.email.message}</span>}
						</div>
						<div>
							<label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
							<input
								id="password"
								type="password"
								{...register("password", { required: "Password is required" })}
								className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300"
							/>
							{errors.password && <span className="text-xs italic text-red-500 mt-1">{errors.password.message}</span>}
						</div>
						<div className="flex justify-end">
							<Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-500">
								Forgot Password?
							</Link>
						</div>
						<button
							type="submit"
							className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
						>
							Login
						</button>
					</form>
					<div className="text-center mt-3">
						<p className="text-xs text-gray-600">
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