import React, { useState } from 'react';
import { LoginRequest, RegisterRequest } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import LogoSplash from '../components/LogoSplash';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { login, register } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        setSuccess('Login successful! Welcome back!');
        setTimeout(() => onLoginSuccess(), 1000);
      } else {
        await register(formData.email, formData.password, formData.fullName || undefined);
        setSuccess('Registration successful! Welcome to Rebel Budget!');
        setTimeout(() => onLoginSuccess(), 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({
      email: '',
      password: '',
      fullName: '',
      confirmPassword: ''
    });
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <LogoSplash onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-p5-black via-red-900 to-p5-black flex items-center justify-center p-4 relative overflow-hidden animate-p5-slide-in">
      {/* Simplified Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle static grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(230, 0, 18, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(230, 0, 18, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Minimal floating elements */}
        <div className="absolute top-20 left-10 w-16 h-16 border-2 border-p5-red transform rotate-45 opacity-20"></div>
        <div className="absolute bottom-32 right-16 w-20 h-20 border-2 border-p5-yellow transform -rotate-12 opacity-15"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-p5-yellow transform rotate-45 opacity-10"></div>
      </div>

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Stylized Header with P5 flair */}
        <div className="text-center mb-12 relative">
          {/* Main title with enhanced styling */}
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-p5-white uppercase tracking-wider mb-4 drop-shadow-2xl transform hover:scale-105 transition-all duration-500 animate-p5-slide-in leading-tight">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center">
                  <span className="inline-block transform hover:rotate-2 transition-transform duration-300">R</span>
                  <span className="inline-block transform hover:-rotate-1 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>E</span>
                  <span className="inline-block transform hover:rotate-1 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>B</span>
                  <span className="inline-block transform hover:-rotate-2 transition-transform duration-300" style={{ animationDelay: '0.3s' }}>E</span>
                  <span className="inline-block transform hover:rotate-1 transition-transform duration-300" style={{ animationDelay: '0.4s' }}>L</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block transform hover:-rotate-1 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>B</span>
                  <span className="inline-block transform hover:rotate-2 transition-transform duration-300" style={{ animationDelay: '0.6s' }}>U</span>
                  <span className="inline-block transform hover:-rotate-1 transition-transform duration-300" style={{ animationDelay: '0.7s' }}>D</span>
                  <span className="inline-block transform hover:rotate-1 transition-transform duration-300" style={{ animationDelay: '0.8s' }}>G</span>
                  <span className="inline-block transform hover:-rotate-2 transition-transform duration-300" style={{ animationDelay: '0.9s' }}>E</span>
                  <span className="inline-block transform hover:rotate-2 transition-transform duration-300" style={{ animationDelay: '1.0s' }}>T</span>
                </div>
              </div>
            </h1>
            
            {/* Stylized underline */}
            <div className="flex justify-center items-center mb-6 animate-p5-slide-in" style={{ animationDelay: '0.5s' }}>
              <div className="w-16 h-1 bg-p5-yellow transform -skew-x-12"></div>
              <div className="w-8 h-8 bg-p5-red transform rotate-45 mx-4 border-2 border-p5-white"></div>
              <div className="w-16 h-1 bg-p5-yellow transform skew-x-12"></div>
            </div>
            
            {/* Dynamic subtitle */}
            <div className="relative overflow-hidden h-8 animate-p5-slide-in" style={{ animationDelay: '0.7s' }}>
              <p className="text-p5-yellow font-bold text-xl uppercase tracking-wider transform transition-all duration-500 hover:text-p5-white">
                {isLogin ? 'Continue The Fight' : 'Fight Back Against Bad Budgeting'}
              </p>
            </div>
          </div>
        </div>

        {/* Stylized Login/Register Form */}
        <div className="relative">
          {/* Form background with P5 styling */}
          <div className="absolute inset-0 bg-gradient-to-br from-p5-black via-gray-900 to-p5-black border-comic border-4 border-p5-red rounded-comic shadow-2xl transform rotate-1"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-p5-black via-red-950 to-p5-black border-comic border-4 border-p5-yellow rounded-comic shadow-2xl transform -rotate-1"></div>
          
          {/* Main form container */}
          <div className="relative bg-gradient-to-br from-gray-900 via-p5-black to-gray-900 border-comic border-4 border-p5-white rounded-comic shadow-p5-pop p-8 transform hover:scale-105 transition-all duration-500 animate-p5-slide-in" style={{ animationDelay: '1s' }}>
            {/* Form mode indicator */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-p5-red border-comic border-2 border-p5-white rounded-comic px-6 py-2 shadow-lg">
                <span className="text-p5-white font-extrabold text-sm uppercase tracking-widest">
                  {isLogin ? 'ACCESS GRANTED' : 'NEW USER'}
                </span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            {/* Email Input */}
            <div className="relative group">
              <label htmlFor="email" className="block text-p5-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center">
                Email Address
                <span className="ml-auto text-p5-yellow">●</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gradient-to-r from-p5-black to-gray-900 border-comic border-3 border-p5-yellow rounded-comic text-p5-white placeholder-gray-400 focus:border-p5-red focus:outline-none focus:shadow-lg focus:shadow-p5-red/50 transition-all duration-500 transform focus:scale-105"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Full Name Input (Register only) */}
            {!isLogin && (
              <div className="relative group">
                <label htmlFor="fullName" className="block text-p5-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center">
                  Full Name (Optional)
                  <span className="ml-auto text-p5-yellow">●</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gradient-to-r from-p5-black to-gray-900 border-comic border-3 border-p5-yellow rounded-comic text-p5-white placeholder-gray-400 focus:border-p5-red focus:outline-none focus:shadow-lg focus:shadow-p5-red/50 transition-all duration-500 transform focus:scale-105"
                  placeholder="Your Name"
                />
              </div>
            )}

            {/* Password Input */}
            <div className="relative group">
              <label htmlFor="password" className="block text-p5-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center">
                Password
                <span className="ml-auto text-p5-yellow">●</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-6 py-4 bg-gradient-to-r from-p5-black to-gray-900 border-comic border-3 border-p5-yellow rounded-comic text-p5-white placeholder-gray-400 focus:border-p5-red focus:outline-none focus:shadow-lg focus:shadow-p5-red/50 transition-all duration-500 transform focus:scale-105"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Confirm Password Input (Register only) */}
            {!isLogin && (
              <div className="relative group">
                <label htmlFor="confirmPassword" className="block text-p5-white font-bold text-sm uppercase tracking-wider mb-3 flex items-center">
                  Confirm Password
                  <span className="ml-auto text-p5-yellow">●</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 bg-gradient-to-r from-p5-black to-gray-900 border-comic border-3 border-p5-yellow rounded-comic text-p5-white placeholder-gray-400 focus:border-p5-red focus:outline-none focus:shadow-lg focus:shadow-p5-red/50 transition-all duration-500 transform focus:scale-105"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-p5-red bg-opacity-20 border-2 border-p5-red rounded-comic p-3 text-p5-white text-center font-bold">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-p5-yellow bg-opacity-20 border-2 border-p5-yellow rounded-comic p-3 text-p5-white text-center font-bold">
                {success}
              </div>
            )}

            {/* Stylized Submit Button */}
            <div className="relative">
              <button
                type="submit"
                disabled={isLoading}
                className={`relative w-full py-5 px-8 font-extrabold text-xl uppercase tracking-widest rounded-comic border-comic border-4 transition-all duration-500 transform overflow-hidden group ${
                  isLoading
                    ? 'bg-p5-gray border-p5-gray text-p5-black cursor-not-allowed'
                    : 'bg-gradient-to-r from-p5-red to-red-600 border-p5-red text-p5-white hover:from-p5-yellow hover:to-yellow-500 hover:border-p5-yellow hover:text-p5-black hover:scale-110 hover:shadow-2xl hover:shadow-p5-red/50 active:scale-95'
                }`}
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:animate-p5-swoosh"></div>
                
                {/* Button content */}
                <div className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{isLogin ? 'Login' : 'Register'}</span>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Stylized Toggle between login/register */}
          <div className="mt-8 text-center">
            <div className="relative inline-block">
              <button
                type="button"
                onClick={toggleMode}
                className="relative text-p5-yellow hover:text-p5-white font-bold uppercase tracking-wider transition-all duration-500 transform hover:scale-110 group px-6 py-3 border-2 border-p5-yellow hover:border-p5-red rounded-comic hover:bg-p5-red hover:bg-opacity-20"
              >
                <span className="relative z-10">
                  {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
                </span>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-p5-red to-p5-yellow opacity-0 group-hover:opacity-10 rounded-comic transition-opacity duration-500"></div>
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* Stylized Footer */}
        <div className="text-center mt-12 animate-p5-slide-in" style={{ animationDelay: '1.5s' }}>
          <div className="relative inline-block">
            <div className="flex items-center justify-center space-x-4 text-p5-gray text-sm uppercase tracking-widest">
              <span>Secure</span>
              <div className="w-1 h-1 bg-p5-red rounded-full"></div>
              <span>Private</span>
              <div className="w-1 h-1 bg-p5-red rounded-full"></div>
              <span>Manual Entry Only</span>
            </div>
            
            {/* Decorative underline */}
            <div className="mt-3 flex justify-center">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-p5-red to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 