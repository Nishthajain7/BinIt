'use client'
import Link from 'next/link';
import React, { useState } from 'react';

const AuthenticationPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle authentication logic here
        console.log('Logging in with:', { email, password });
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 px-5">

            {/* Falling Leaves */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className={`falling-leaf leaf-${index + 1}`}></div>
                ))}
            </div>
            <div className="absolute inset-0 z-0 pointer-events-none">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className={`falling-leaf-2 leaf-${index + 1+10}`}></div>
                ))}
            </div>

            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 z-10">
                <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">Sign In</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 px-4 py-2 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition">
                        Log In
                    </button>
                    <Link href="/signup" className='flex justify-center text-blue-400 underline w-full'>Dont have an account Sign-Up Today!</Link>
                </form>
            </div>
        </div>
    );
};

export default AuthenticationPage;
