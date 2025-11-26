
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { ChemIcon } from '../icons/ChemIcon';
import { GoogleIcon } from '../icons/GoogleIcon';

const AuthPage: React.FC = () => {
    const [view, setView] = useState<'signIn' | 'signUp'>('signIn');
    const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/app');
        }
    }, [user, navigate]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setIsSubmitting(true);

        if (view === 'signIn') {
            const { error } = await signInWithEmail(email, password);
            if (error) {
                setError(error.message);
                setIsSubmitting(false);
            } else {
                // Success: Do nothing. Keep loading true.
                // The useEffect([user]) will handle navigation when user state updates.
            }
        } else {
            const { error } = await signUpWithEmail(fullName, email, password);
            if (error) {
                setError(error.message);
                setIsSubmitting(false);
            } else {
                setMessage('Success! Please check your email for a confirmation link.');
                setView('signIn'); // Switch to sign-in view after successful sign-up
                setIsSubmitting(false);
            }
        }
    };

    const toggleView = (v: 'signIn' | 'signUp') => {
        setView(v);
        setError(null);
        setMessage(null);
        setEmail('');
        setPassword('');
        setFullName('');
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg animate-fade-in">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <ChemIcon className="w-10 h-10 text-deep-blue" />
                        <span className="font-display font-bold text-3xl text-gray-800">ChemXGen</span>
                    </Link>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">
                        {view === 'signIn' ? 'Access Your Account' : 'Create a New Account'}
                    </h2>
                </div>

                <button
                    onClick={signInWithGoogle}
                    disabled={loading || isSubmitting}
                    className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-deep-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <GoogleIcon className="w-5 h-5" />
                    <span>Sign {view === 'signIn' ? 'in' : 'up'} with Google</span>
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                </div>

                {error && <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm text-center">{error}</div>}
                {message && <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm text-center">{message}</div>}

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    {view === 'signUp' && (
                        <div>
                            <label htmlFor="fullName" className="sr-only">Full Name</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-deep-blue focus:border-deep-blue focus:z-10 sm:text-sm"
                                placeholder="Full Name"
                            />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email-address" className="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-deep-blue focus:border-deep-blue focus:z-10 sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-deep-blue focus:border-deep-blue focus:z-10 sm:text-sm"
                            placeholder="Password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || isSubmitting}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-deep-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-dark transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting || loading ? 'Processing...' : (view === 'signIn' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="text-sm text-center">
                    {view === 'signIn' ? (
                        <p>
                            Don't have an account?{' '}
                            <button onClick={() => toggleView('signUp')} className="font-medium text-molecular-teal hover:text-deep-blue">
                                Sign up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <button onClick={() => toggleView('signIn')} className="font-medium text-molecular-teal hover:text-deep-blue">
                                Sign in
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
