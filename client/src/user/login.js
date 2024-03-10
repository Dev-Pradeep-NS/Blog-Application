import React, { useState } from 'react';

async function loginUser(credentials) {
    return fetch('http://localhost:9292/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json());
}

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
        const formData = {
            username,password
        }

        const response = await loginUser(formData);
        localStorage.setItem('an_token', response.values.token);
        console.log(response.values.token);
    }

    return (
        <form class="max-w-sm mx-auto my-40" onSubmit={handleSubmit}>
            <h3 class="text-3xl mb-6 font-bold text-center text-gray-900 dark:text-white">Login Now</h3>
            <div class="mb-5">
                <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">UserName</label>
                <input type="text" id="username" value={username} onChange={e => setUsername(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <div class="mb-5">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
            </div>
            <div class="flex justify-between">
                <div class="flex items-start">
                    <div class="flex items-center h-5 mb-5">
                        <input id="remember" type="checkbox" value="" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                    </div>
                    <label for="remember" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                </div>
                <a href="#" class="text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
            </div>
            <button type="submit" class="mb-5 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Login to your account</button>
            <div class="text-sm font-medium text-gray-500 dark:text-gray-300">
                Not registered? <a href="/register" class="text-blue-700 hover:underline dark:text-blue-500">Create account</a>
            </div>
        </form>
    );
}