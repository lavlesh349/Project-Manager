// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.post('/auth/register', { username, password });
            setLoading(false);
            setSuccess('User registered successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login'); // Redirect to login after successful registration
            }, 2000); // 2-second delay before redirect
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="border border-gray-300 rounded-lg p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 text-white rounded-lg p-2 w-full hover:bg-blue-600 transition duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    {success && <p className="text-green-500 text-center mt-2">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
