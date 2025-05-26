import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as apiService from '../services/api';

const LoginPage: React.FC = () => {
  const [isUserLogin, setIsUserLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await apiService.login(email, password);
      
      if (!response.success || !response.data) {
        setError(response.message || 'Invalid email or password.');
        return;
      }
      
      const { user, token } = response.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginType = () => {
    setIsUserLogin(!isUserLogin);
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] flex items-center justify-center p-5">
      <div className="w-full max-w-[1000px] h-[550px] bg-white rounded-[30px] shadow-lg overflow-hidden relative">
        
        {/* Toggle Panel */}
        <div className="absolute w-full h-full">
          <div className={`absolute w-[300%] h-full bg-[#7494ec] rounded-[150px] z-20 transition-all duration-[1.8s] ease-in-out ${
            isUserLogin ? '-left-[250%]' : 'left-1/2'
          }`}></div>
          
          {/* Left Panel */}
          <div className={`absolute left-0 w-1/2 h-full flex flex-col justify-center items-center text-white z-20 transition-all duration-600 ease-in-out ${
            isUserLogin ? 'delay-[1.2s]' : 'left-[-50%] delay-[0.6s]'
          }`}>
            <h1 className="text-3xl font-bold mb-2">Hello, User!</h1>
            <p className="text-sm mb-5">Are you an admin?</p>
            <button 
              className="w-40 h-[46px] bg-transparent border-2 border-white rounded-lg text-white font-semibold"
              onClick={toggleLoginType}
            >
              Admin Login
            </button>
          </div>
          
          {/* Right Panel */}
          <div className={`absolute w-1/2 h-full flex flex-col justify-center items-center text-white z-20 transition-all duration-600 ease-in-out ${
            isUserLogin ? 'right-[-50%] delay-[0.6s]' : 'right-0 delay-[1.2s]'
          }`}>
            <h1 className="text-3xl font-bold mb-2">Welcome Admin!</h1>
            <p className="text-sm mb-5">Back to user login?</p>
            <button 
              className="w-40 h-[46px] bg-transparent border-2 border-white rounded-lg text-white font-semibold"
              onClick={toggleLoginType}
            >
              User Login
            </button>
          </div>
        </div>
        
        {/* Login Form */}
        <div className={`absolute right-0 w-1/2 h-full bg-white flex items-center text-gray-800 p-10 z-10 transition-all duration-600 ease-in-out delay-[1.2s] ${
          isUserLogin ? '' : 'right-1/2'
        }`}>
          <form onSubmit={handleSubmit} className="w-full">
            <h1 className="text-3xl font-bold mb-10 text-center">
              {isUserLogin ? 'User Login' : 'Admin Login'}
            </h1>
            
            {error && (
              <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
            )}
            
            <div className="relative mb-8">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-gray-800 outline-none"
                placeholder={`${isUserLogin ? 'User' : 'Admin'} ID`}
                required
              />
              <i className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </i>
            </div>
            
            <div className="relative mb-3">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-5 pr-12 bg-gray-100 rounded-lg text-gray-800 outline-none"
                placeholder="Password"
                required
              />
              <i className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </i>
            </div>
            
            <div className="text-right mb-4">
              <a href="#" className="text-sm text-gray-700">Forgot Password?</a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#7494ec] rounded-lg shadow-md text-white font-semibold text-base transition-opacity disabled:opacity-70"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;