import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useRegister } from "../../utils/hooks/useAuth";
import type { IFormInput } from "../../interfaces";
import { useEffect } from "react";
import { useAuth } from "../../utils/hooks/AuthContext";

const Register = () => {
	const { token } = useAuth()
	const navigate = useNavigate();
	const server_url = process.env.REACT_APP_SERVER_URL || '';

	useEffect(() => {
		if (token && token.length > 0) {
			navigate('/');
		}
	}, [token, navigate])

	const { register, handleSubmit, watch, formState: { errors } } = useForm<IFormInput>();
	const { mutate: handleRegister, isLoading, error } = useRegister(server_url);

	const onSubmit: SubmitHandler<IFormInput> = (data) => {
		handleRegister(data, {
			onSuccess: () => {
				navigate("/");
				console.log("Registration successful");
			},
			onError: (error) => {
				console.error("Registration failed:", error);
			},
		});
	};

	const password = watch("password");

	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.toString()}</div>;
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
			<div className="flex flex-col md:flex-row items-center bg-white shadow-2xl rounded-xl w-full max-w-4xl">
				<img src="/Logo.png" alt="" className="w-1/2 max-w-xs mx-auto md:mx-0 md:w-1/3 mb-6 md:mb-0 md:mr-8" />
				<div className="w-full md:w-2/3 p-6 md:p-10 space-y-4 md:space-y-6">
					<h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 md:mb-8">Register</h2>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
						<div>
							<label htmlFor="username" className="block mb-1 md:mb-2 text-sm font-semibold text-gray-700">Username</label>
							<input
								id="username"
								{...register("username", { required: "Username is required" })}
								className="w-full px-3 md:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							/>
							{errors.username && <span className="text-xs italic text-red-500 mt-1">{errors.username.message}</span>}
						</div>
						<div>
							<label htmlFor="email" className="block mb-1 md:mb-2 text-sm font-semibold text-gray-700">Email</label>
							<input
								id="email"
								type="email"
								{...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
								className="w-full px-3 md:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							/>
							{errors.email && <span className="text-xs italic text-red-500 mt-1">{errors.email.message}</span>}
						</div>
						<div>
							<label htmlFor="password" className="block mb-1 md:mb-2 text-sm font-semibold text-gray-700">Password</label>
							<input
								id="password"
								type="password"
								{...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
								className="w-full px-3 md:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							/>
							{errors.password && <span className="text-xs italic text-red-500 mt-1">{errors.password.message}</span>}
						</div>
						<div>
							<label htmlFor="confirm_password" className="block mb-1 md:mb-2 text-sm font-semibold text-gray-700">Confirm Password</label>
							<input
								id="confirm_password"
								type="password"
								{...register("confirm_password", {
									required: "Please confirm your password",
									validate: (value: string) => value === password || "Passwords do not match"
								})}
								className="w-full px-3 md:px-4 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
							/>
							{errors.confirm_password && <span className="text-xs italic text-red-500 mt-1">{errors.confirm_password.message}</span>}
						</div>
						<button
							type="submit"
							className="w-full px-4 py-2 md:py-3 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
						>
							Register
						</button>
					</form>
					<div className="text-center mt-4">
						<p className="text-sm text-gray-600">
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