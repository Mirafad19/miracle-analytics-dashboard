// FIX: Imported 'React' to make 'React.FormEvent' type available.
import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { Activity, AlertCircle } from './Icons';
import { Button } from './ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      // FIX: Updated sign-in logic to use Firebase v8 syntax, resolving a module export error.
      await auth.signInWithEmailAndPassword(email, password);
      // No need to redirect, the AuthProvider will handle the state change
    } catch (err: any) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all";

  return (
    <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Activity className="relative h-14 w-14 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Miracle Analytics
          </h1>
          <p className="text-lg text-zinc-400">Secure Portal Access</p>
        </div>

        <div className="bg-black/70 backdrop-blur-2xl rounded-2xl border border-zinc-800 p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••••"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-3 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-lg font-semibold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white py-3 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </div>
          </form>
        </div>
        <footer className="text-center py-8 text-sm text-zinc-500">
            © 2025 Miracle Analytics. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}