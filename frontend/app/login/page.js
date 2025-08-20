"use client"
import React, { useState } from 'react';
import { Mail, Lock, Users, LogIn } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

const App = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const values = { email, password, role };

        try {
            console.log('Logging in with values:', api);
            const res = await api.post('/auth/login', values);
            const data = res.data;

            setMessage({ type: 'success', text: 'Login successful!' });
            localStorage.setItem('token', data.token);

            router.push('/jobs');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed due to a network error.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 font-sans p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 hover:shadow-3xl">
                <div className="flex flex-col items-center mb-6">
                    <LogIn size={48} className="text-indigo-500 dark:text-indigo-400 mb-3 animate-pulse" />
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">Welcome Back!</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-center">Sign in to your account</p>
                </div>

                {message.text && (
                    <div className={`p-3 mb-4 rounded-lg text-center font-medium ${message.type === 'success'
                        ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                        : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Mail size={20} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 transition-colors"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Lock size={20} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                            type="password"
                            id="password"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 transition-colors"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Users size={20} className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <select
                            id="role"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading && (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <a href="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default App;