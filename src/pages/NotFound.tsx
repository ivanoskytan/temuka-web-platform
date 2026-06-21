import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:py-24 text-center mt-16 min-h-[calc(100vh-4rem)]">
        <div className="max-w-md w-full flex flex-col items-center gap-6">
          
          <div className="relative">
            <h1 className="text-9xl font-black tracking-tighter bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent select-none opacity-90">
              404
            </h1>
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full -z-10 transform scale-75"></div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-sm font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
              Maaf, kami tidak dapat menemukan halaman yang Anda cari. Halaman mungkin telah dipindahkan atau dihapus.
            </p>
          </div>

          <Link 
            to="/" 
            className="mt-2 inline-flex items-center justify-center font-semibold bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-6 py-3 rounded-xl shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            Kembali ke Beranda
          </Link>
          
        </div>
      </div>
    </div>
  );
}

export default NotFound;