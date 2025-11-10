import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Auth({ onSkip }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (isSignUp) {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setMessage('Success! Check your email to confirm your account.');
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
                setMessage('Successfully signed in!');
            }
        } catch (error) {
            setMessage(error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1 className="auth-brand">Funky To Do</h1>
            <div className="auth-card">
                <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
                <p className="auth-subtitle">
                    {isSignUp
                        ? 'Sign up to sync your todos across devices'
                        : 'Welcome back! Sign in to access your todos'}
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loading}
                            minLength={6}
                        />
                    </div>

                    {message && (
                        <div className={`auth-message ${message.includes('Success') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-btn"
                        disabled={loading}
                    >
                        {loading
                            ? 'Loading...'
                            : isSignUp
                            ? 'Sign Up'
                            : 'Sign In'}
                    </button>
                </form>

                <div className="auth-toggle">
                    <button
                        type="button"
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage('');
                        }}
                        className="auth-toggle-btn"
                    >
                        {isSignUp
                            ? 'Already have an account? Sign in'
                            : "Don't have an account? Sign up"}
                    </button>
                </div>

                <div className="auth-skip">
                    <button
                        type="button"
                        onClick={onSkip}
                        className="auth-skip-btn"
                    >
                        Continue without account
                    </button>
                    <p className="auth-skip-note">
                        Your todos will be saved locally on this device
                    </p>
                </div>
            </div>
        </div>
    );
}
