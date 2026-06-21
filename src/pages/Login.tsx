import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Login: React.FC = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      setError("Login tidak berhasil, email atau password yang anda masukkan tidak sesuai");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4"> 
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 transition-all">
        <form 
          className="flex flex-col gap-6"
          onSubmit={handleLogin}
        >
          <div className="text-center">
            <h1 className="font-bold text-3xl text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-2">Please enter your details to sign in</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <input 
                id="email"
                type="email" 
                placeholder="name@example.com" 
                name="email" 
                className="p-3 rounded-xl w-full border border-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm" 
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <input 
                id="password"
                type="password" 
                placeholder="••••••••" 
                name="password" 
                className="p-3 rounded-xl w-full border border-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm" 
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button 
            type='submit' 
            disabled={isLoading}
            className="text-white font-semibold bg-indigo-600 rounded-xl hover:bg-indigo-500 py-3 px-5 w-full shadow-md shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="text-center mt-2">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to={'/register'} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Register now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login