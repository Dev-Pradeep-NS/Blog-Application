import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../utils/hooks/useAuth";
import type { IFormInput } from "../../interfaces";
import { useEffect } from "react";
import { useAuth } from "../../utils/hooks/AuthContext";

const Register = () => {
	const { token, setIsAuthenticated, setToken } = useAuth()
	const navigate = useNavigate();
	const server_url = process.env.REACT_APP_SERVER_URL || '';

	useEffect(() => {
		if (token && token.length > 0) {
			navigate('/posts');
		}
	}, [token, navigate])

	const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
	const { mutate: handleRegister, isLoading, error } = useRegister(server_url);

	const onSubmit: SubmitHandler<IFormInput> = async (data) => {
		handleRegister(data, {
			onSuccess: (response) => {
				setIsAuthenticated(true);
				setToken(response.access_token);
				navigate("/posts");
				console.log("Registration successful");
			},
			onError: (error) => {
				console.error("Registration failed:", error);
			},
		});
	};

	const password = watch("password");

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
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="flex flex-col md:flex-row items-center bg-white shadow-2xl rounded-xl w-full max-w-4xl">
				<img src="/specwiselogo.png" alt="" className="w-full sm:w-2/5 max-w-xs mx-auto sm:mx-0 mb-6 sm:mb-0" />
				<div className="w-full md:w-2/3 p-6 md:p-10 space-y-4 md:space-y-6">
					<h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-5">Register</h2>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-3 md:space-y-4">
						<div>
							<label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">Username</label>
							<input
								id="username"
								{...register("username", { required: "Username is required" })}
								className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300"
							/>
							{errors.username && <span className="text-xs italic text-red-500 mt-1">{errors.username.message}</span>}
						</div>
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
								{...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
								className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300"
							/>
							{errors.password && <span className="text-xs italic text-red-500 mt-1">{errors.password.message}</span>}
						</div>
						<div>
							<label htmlFor="confirm_password" className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
							<input
								id="confirm_password"
								type="password"
								{...register("confirm_password", {
									required: "Please confirm your password",
									validate: (value: string) => value === password || "Passwords do not match"
								})}
								className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition duration-300"
							/>
							{errors.confirm_password && <span className="text-xs italic text-red-500 mt-1">{errors.confirm_password.message}</span>}
						</div>
						<button
							type="submit"
							className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
						>
							Register
						</button>
					</form>
					<div className="text-center mt-3">
						<p className="text-xs text-gray-600">
							Already have an account?{" "}
							<Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
								Login here
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;