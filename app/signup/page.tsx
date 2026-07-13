'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { apiService } from '@/services/apiService';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await apiService.signup(formData.username, formData.email, formData.password);
      toast.success('Account created! Please login.');
      router.push('/login');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Signup failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Column - 40% */}
      <div className="hidden lg:flex lg:w-[40%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(135deg, #5B5CEB 0%, #4949D4 50%, #7C3AED 100%)',
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">TaskAnnotate</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative">
            <div className="w-80 h-64 bg-white/10 rounded-card border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-card flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <p className="text-white/90 text-sm font-medium">Create Your Account</p>
                <p className="text-white/50 text-xs mt-1">Join the radiology platform</p>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-white/10 rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-white/10 rounded-full" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Join TaskAnnotate</h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Create an account to start managing tasks and annotating images on our modern platform.
          </p>
        </div>

        <div className="text-white/30 text-sm mt-4">
          &copy; {new Date().getFullYear()} TaskAnnotate. All rights reserved.
        </div>
      </div>

      {/* Right Auth Form Column - 60% */}
      <div className="flex-1 flex items-center justify-center bg-white p-8">
        <div className="w-full" style={{ maxWidth: '420px' }}>
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-text-primary font-bold text-xl">TaskAnnotate</span>
          </div>

          {/* Logo for desktop */}
          <div className="hidden lg:flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-text-primary font-bold text-xl">TaskAnnotate</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
            <p className="text-text-secondary">Join TaskAnnotate to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-1.5">
                Username
              </label>
              <div className="relative">
                <UserIcon className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="john_doe"
                  className="input pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <div className="relative">
                <EnvelopeIcon className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="input pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="input pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <LockClosedIcon className="w-5 h-5 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="input pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 text-sm font-semibold rounded-button mt-2"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  Sign Up
                  <ArrowRightIcon className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
