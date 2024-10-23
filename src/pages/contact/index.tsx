import type React from 'react';
import { useState } from 'react';
import { useAddContact } from '../../utils/hooks/useContact';
import { useAuth } from '../../utils/hooks/AuthContext';
import { getEnvVariable } from '../../utils/helpers/getEnvVariable';

const ContactUs: React.FC = () => {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const server_url = getEnvVariable('REACT_APP_SERVER_URL') || "https://specwise-server.onrender.com";
	const { token } = useAuth();
	const createContact = useAddContact(server_url, token);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const formData = {
			name,
			email,
			subject,
			message
		};
		createContact.mutate(formData);
	};

	return (
		<div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
			<div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
				<div className="p-6 space-y-6">
					<h1 className="text-3xl font-bold mb-8 text-gray-900">Contact Us</h1>
					<div className="flex flex-col lg:flex-row gap-8">
						<div className="lg:w-1/2">
							<img src="/specwiselogo.png" alt="Contact Us" className="w-full h-auto rounded-lg mx-auto lg:max-w-full" />
						</div>
						<div className="lg:w-1/2">
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
										Name
									</label>
									<input
										type="text"
										id="name"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
										required
									/>
								</div>
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
										Email
									</label>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
										required
									/>
								</div>
								<div>
									<label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
										Subject
									</label>
									<input
										type="text"
										id="subject"
										value={subject}
										onChange={(e) => setSubject(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
										required
									/>
								</div>
								<div>
									<label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
										Message
									</label>
									<textarea
										id="message"
										value={message}
										onChange={(e) => setMessage(e.target.value)}
										rows={6}
										className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
										required
									/>
								</div>
								<div>
									<button
										type="submit"
										className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
									>
										Send Message
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactUs;