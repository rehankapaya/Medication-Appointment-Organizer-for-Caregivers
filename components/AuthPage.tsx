
import React, { useState } from 'react';
import { AtSignIcon, LockIcon, UserIcon } from './icons/Icons';

interface AuthPageProps {
    onLogin: (email: string, password: string) => Promise<boolean>;
    onSignup: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignup }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        let success = false;
        if (isLoginView) {
            success = await onLogin(email, password);
            if (!success) {
                setError('Invalid email or password. Please try again.');
            }
        } else {
            success = await onSignup(name, email, password);
            if (!success) {
                setError('An account with this email already exists.');
            }
        }
        setIsLoading(false);
    };
    
    const InputField: React.FC<{icon: React.ReactNode, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ icon, type, placeholder, value, onChange }) => (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                {icon}
            </div>
            <input
                type={type}
                className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-lg focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-800">Caregiver's Companion</h1>
                    <p className="text-slate-500 mt-2 text-lg">Your partner in providing the best care.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                        onClick={() => { setIsLoginView(true); setError(null); }}
                        className={`w-1/2 py-3 text-lg font-semibold rounded-md transition-colors ${isLoginView ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => { setIsLoginView(false); setError(null); }}
                        className={`w-1/2 py-3 text-lg font-semibold rounded-md transition-colors ${!isLoginView ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLoginView && (
                        <InputField icon={<UserIcon className="w-5 h-5"/>} type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
                    )}
                    <InputField icon={<AtSignIcon className="w-5 h-5"/>} type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} />
                    <InputField icon={<LockIcon className="w-5 h-5"/>} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    
                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-blue-500 text-white font-bold text-lg rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                         {isLoading && (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        {isLoading ? 'Processing...' : (isLoginView ? 'Login to Your Account' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;