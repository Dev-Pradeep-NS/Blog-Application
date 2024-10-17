import type React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useResetPassword, useVerifyEmail } from '../../utils/hooks/useAuth';
import { useAuth } from '../../utils/hooks/AuthContext';

interface IForgotPasswordInput {
	email: string;
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

const ForgotPassword: React.FC = () => {
	const navigate = useNavigate();
	const { token } = useAuth();
	const server_url = process.env.REACT_APP_SERVER_URL || window.env.REACT_APP_SERVER_URL;
	const { register, handleSubmit, formState: { errors }, watch } = useForm<IForgotPasswordInput>();
	const [emailVerified, setEmailVerified] = useState(false);
	const [email, setEmail] = useState<string>('');
	const resetPassword = useResetPassword(server_url);

	const { refetch: verifyEmail } = useVerifyEmail(server_url, email);

	const onSubmit = async (data: IForgotPasswordInput) => {
		setEmail(data.email);

		if (!emailVerified) {
			try {
				const result = await verifyEmail();
				console.log("Verifying email:", result);

				if (result.data) {
					setEmailVerified(true);
				} else {
					console.error("Email verification failed:", result.data || "Unknown error");
				}
			} catch (error) {
				console.error("Error during email verification:", error);
			}
		} else {
			resetPassword.mutate(data, {
				onSuccess: () => {
					// Handle successful password reset
					console.log('Password reset successful');
					navigate('/login'); // Redirect to login page after successful reset
				},
				onError: (error) => {
					// Handle error
					console.error('Password reset failed:', error);
				},
			});
		}
	};

	return (
		<div className="flex flex-col justify-center min-h-screen py-12 bg-gray-50 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
					{emailVerified ? "Reset your password" : "Forgot your password?"}
				</h2>
				<p className="mt-2 text-sm text-center text-gray-600">
					{emailVerified ? "Enter your old and new password below" : "Enter your email address and we'll send you a reset link"}
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
					<form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<div className="mt-1">
								<input
									id="email"
									type="email"
									autoComplete="email"
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^\S+@\S+$/i,
											message: "Invalid email address"
										}
									})}
									className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
								/>
								{errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
							</div>
						</div>

						{emailVerified && (
							<>
								<div>
									<label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
										Old Password
									</label>
									<div className="mt-1">
										<input
											id="oldPassword"
											type="password"
											autoComplete="current-password"
											{...register("oldPassword", {
												required: "Old password is required"
											})}
											className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
										{errors.oldPassword && <p className="mt-2 text-sm text-red-600">{errors.oldPassword.message}</p>}
									</div>
								</div>

								<div>
									<label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
										New Password
									</label>
									<div className="mt-1">
										<input
											id="newPassword"
											type="password"
											autoComplete="new-password"
											{...register("newPassword", {
												required: "New password is required",
												minLength: {
													value: 8,
													message: "Password must be at least 8 characters"
												}
											})}
											className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
										{errors.newPassword && <p className="mt-2 text-sm text-red-600">{errors.newPassword.message}</p>}
									</div>
								</div>

								<div>
									<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
										Confirm New Password
									</label>
									<div className="mt-1">
										<input
											id="confirmPassword"
											type="password"
											autoComplete="new-password"
											{...register("confirmPassword", {
												required: "Please confirm your new password",
												validate: (value) => value === watch('newPassword') || "Passwords do not match"
											})}
											className="block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
										/>
										{errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
									</div>
								</div>
							</>
						)}

						<div>
							<button
								type="submit"
								className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								{emailVerified ? "Reset Password" : "Send reset link"}
							</button>
						</div>
					</form>

					<div className="mt-6">
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-300" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="px-2 text-gray-500 bg-white">
									Or
								</span>
							</div>
						</div>

						<div className="mt-6 text-center">
							<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
								Back to Login
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;