import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function registerUser(credentials) {
    return fetch('http://localhost:9292/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json());
}

export default function Register() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async e => {
        const username = `${firstname} ${lastname}`
        e.preventDefault();

        const formData = {
            username,
            password,
            email,
            mobile
        };
        const response = await registerUser(formData);
        console.log(response);
        navigate('/login');
    }

    return (
        <div class="min-h-screen flex justify-center items-center">
            <form class="max-w-sm mx-auto" onSubmit={handleSubmit}>
                <h3 class="text-3xl mb-6 font-bold text-center text-gray-900 dark:text-white">Register</h3>
                <div class="grid grid-rows-1 grid-flow-col gap-3">
                    <div class="mb-5">
                        <label for="firstname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                        <input type="firstname" id="firstname" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={firstname} onChange={e => setFirstname(e.target.value)} />
                    </div>
                    <div class="mb-5">
                        <label for="lastname" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                        <input type="lastname" id="lastname" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={lastname} onChange={e => setLastname(e.target.value)} />
                    </div>
                </div>
                <div class="mb-5">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email Address</label>
                    <input type="email" id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" placeholder="name@flowbite.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div class="mb-5">
                    <label for="mobile" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
                    <input type="number" id="mobile" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={mobile} onChange={e => setMobile(e.target.value)} />
                </div>
                <div class="mb-5">
                    <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input type="password" id="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Create your Account</button>
                <div class="flex items-center mt-4 mb-4">
                    <div class="border-t border-gray-300 flex-grow"></div>
                    <div class="mx-4 text-gray-500 dark:text-gray-400">OR</div>
                    <div class="border-t border-gray-300 flex-grow"></div>
                </div>
                <div class="w-full flex justify-center">
                    <div>Already User? <a href="/login" class="text-blue-700 hover:underline">Login</a></div>
                </div>
            </form>
        </div>
    );
}