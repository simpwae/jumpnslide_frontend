import React, { useState } from 'react';
import { LockIcon, MailIcon, Loader2Icon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
interface LoginPageProps {
  onLogin: () => void;
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Mock auth delay
    setTimeout(() => {
      if (password === 'admin123') {
        onLogin();
      } else {
        setError('Invalid email or password. Hint: try "admin123"');
        setIsLoading(false);
      }
    }, 1000);
  };
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-brand-pink/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 bg-gradient-brand rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/20 mb-4">
            <LockIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-center text-3xl font-heading font-extrabold text-white">
            Jump N Slide
          </h2>
          <p className="mt-2 text-center text-sm text-brand-pink font-bold tracking-widest uppercase">
            Admin Portal
          </p>
        </div>

        <Card className="border-slate-800/60 shadow-2xl bg-slate-900/80 backdrop-blur-xl">
          <CardHeader className="border-b-0 pb-0">
            <h3 className="text-xl font-heading font-bold text-slate-100 text-center">
              Sign in to your account
            </h3>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-300 mb-2">
                  
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors sm:text-sm"
                    placeholder="admin@jns4k.com" />
                  
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-300 mb-2">
                  
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-colors sm:text-sm"
                    placeholder="••••••••" />
                  
                </div>
              </div>

              {error &&
              <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-center">
                  {error}
                </div>
              }

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 text-base font-semibold shadow-lg shadow-brand-blue/20">
                  
                  {isLoading ?
                  <>
                      <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
                      Signing in...
                    </> :

                  'Sign in'
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>);

}