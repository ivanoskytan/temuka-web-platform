import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore';

const Register: React.FC = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  
  const register = useAuthStore((state) => state.register);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await register(formData)
      navigate("/login")
    } catch (err) {
      setError("Registrasi tidak berhasil, email atau username mungkin sudah terdaftar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4"> 
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10 transition-all">
        <form 
          className="flex flex-col gap-6"
          onSubmit={handleRegister}
        >
          <div className="text-center">
            <h1 className="font-bold text-3xl text-slate-900 tracking-tight">Create your account</h1>
            <p className="text-sm text-slate-500 mt-2">Get started with your new account today</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Username
              </label>
              <input 
                id="username"
                type="text" 
                placeholder="johndoe"
                name="username" 
                className="p-3 rounded-xl w-full border border-slate-200 text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm" 
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

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
            {isLoading ? 'Creating account...' : 'Register'}
          </button>

          <div className="text-center mt-2">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to={'/login'} className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Login now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register