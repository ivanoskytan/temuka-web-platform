import React from 'react';
import CreatePost from './CreatePost';
import { FaChevronDown } from "react-icons/fa";
import { FaHatCowboy } from "react-icons/fa6";
import RecentPosts from './RecentPosts';

const Rightbar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col gap-5 w-full sticky top-22 py-6">
      <div className="flex justify-between items-center gap-3 bg-white border border-slate-200/80 shadow-sm p-4 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all active:scale-[0.99]">
        <div className="flex gap-3 items-center min-w-0">
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100/50 shrink-0">
            <FaHatCowboy className="text-2xl" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
              Identitas Pembuat Post
            </span>
            <p className="font-semibold text-sm text-slate-800 truncate">
              Mahasiswa Universitas Gadjah Mada
            </p>
          </div>
        </div>
        <FaChevronDown className="text-slate-400 text-xs shrink-0 ml-1" />
      </div>

      <CreatePost />

      <RecentPosts />
    </div>
  );
}

export default Rightbar;