import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw signInError;
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Incorrect credentials or authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[110px] animate-pulse-slow" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#0A0A0A] border border-white/5 p-8 md:p-10 rounded-sm border-gold-glow flex flex-col items-center text-center shadow-[0_0_50px_rgba(197,160,89,0.05)]">
        
        {/* Viora Brand */}
        <div className="flex items-center gap-3 mb-6">
          <img 
            src="/logo.jpg" 
            alt="Viora Logo" 
            className="h-12 w-12 object-contain rounded-md border border-secondary/20 shadow-[0_0_15px_rgba(197,160,89,0.2)]"
          />
          <div className="text-left flex flex-col">
            <span className="font-serif tracking-[0.25em] text-lg font-semibold text-white">
              VIORA
            </span>
            <span className="text-[9px] tracking-[0.4em] text-secondary font-medium -mt-1 uppercase">
              Media
            </span>
          </div>
        </div>

        <span className="text-[10px] tracking-[0.25em] text-secondary font-semibold uppercase mb-2">
          Secure Portal
        </span>
        <h2 className="font-serif text-2xl text-white tracking-wide mb-3">
          Console Authentication
        </h2>
        <p className="text-xs text-accent-muted/80 leading-relaxed font-light mb-8 max-w-xs">
          Access is restricted to authorized administrative personnel.
        </p>

        {/* Credentials Form */}
        <form onSubmit={handleSignIn} className="w-full space-y-5 text-left">
          <div>
            <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
              Gmail Address / Email
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@gmail.com"
              className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-secondary font-semibold uppercase mb-2">
              Password
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/60 border border-white/10 focus:border-secondary focus:outline-none px-4 py-3 text-xs text-white placeholder-white/20 transition-all rounded-sm focus:ring-1 focus:ring-secondary/30"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-light tracking-wide bg-red-950/25 border border-red-500/25 p-3.5 rounded-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-gold-gradient hover:bg-none hover:bg-secondary text-black font-semibold text-xs tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] border border-secondary"
          >
            {loading ? (
              <div className="h-4 w-4 rounded-full border-2 border-black/20 border-t-black animate-spin" />
            ) : null}
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Console Details */}
        <div className="mt-10 border-t border-white/5 pt-6 w-full flex items-center justify-between text-[8px] tracking-widest text-accent-muted/40 uppercase">
          <span>Version 1.2.0</span>
          <span>Security Layer Active</span>
        </div>

      </div>
    </div>
  );
}
