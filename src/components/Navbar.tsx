import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaLayerGroup } from "react-icons/fa";
import { IoPerson, IoChatbubbleEllipsesOutline } from "react-icons/io5";

import useAuthStore from '../store/authStore';
import { UserDetailData } from '../types';
import { searchUsers } from '../services/userService';
import useChatStore from '../store/chatStore';

const Navbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const { isChatVisible, setChatVisible } = useChatStore();
  const [usersList, setUsersList] = useState<UserDetailData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const publicFolder = process.env.REACT_APP_BACKEND_URI + "/images/";

  useEffect(() => {
    const fetchData = async () => {
      if (!searchQuery.trim()) {
        setUsersList([]);
        return;
      }
      try {
        const { data } = await searchUsers(searchQuery);
        setUsersList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [searchQuery]);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-6 border-b border-slate-200 z-50 shadow-sm backdrop-blur-md bg-white/95">
      <div className="flex items-center">
        <Link to="/" className="text-indigo-600 font-black text-2xl tracking-tight hover:opacity-90 transition-opacity">
          temuka
        </Link>
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="flex gap-2.5 bg-slate-100 rounded-xl px-4 py-2 w-full items-center focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600 focus-within:shadow-sm transition-all border border-transparent focus-within:border-transparent">
          <FaSearch className="text-slate-400 text-sm shrink-0" />
          <input 
            type="search" 
            className="text-slate-800 font-medium text-sm w-full bg-transparent outline-none placeholder-slate-400"
            placeholder="Cari prodi, universitas, komunitas"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {searchQuery.trim() && (
          <div className="absolute top-13 left-0 right-0 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 flex flex-col gap-1 max-h-80 overflow-y-auto">
            {usersList?.length ? (
              usersList.map((u) => (
                <Link key={u.ID} to={`/profile/${u.ID}`} onClick={() => setSearchQuery('')}>
                  <div className="flex p-2 items-center gap-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors">
                    <img
                      className="h-9 w-9 object-cover rounded-full border border-slate-100"
                      src={u?.ProfilePicture ? publicFolder + u.ProfilePicture : "/assets/DefaultUser.png"}
                      alt="profile"
                    />
                    <p className="text-slate-700 font-semibold text-sm">{u?.Username}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                  <FaSearch className="text-base text-slate-400/80" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-slate-800 font-semibold text-sm tracking-tight">
                    Tidak ada hasil ditemukan
                  </p>
                  <p className="text-slate-400 text-xs font-medium max-w-[240px] mx-auto leading-normal">
                    Coba periksa kembali ejaan kata kunci pencarian Anda.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-1.5 items-center">
        <button 
          onClick={() => setChatVisible(!isChatVisible)}
          className={`p-2.5 rounded-xl transition-all ${isChatVisible ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
          aria-label="Toggle Chat"
        >
          <IoChatbubbleEllipsesOutline className="text-2xl" />
        </button>
        <Link 
          to={`/communities/${Number(user?.id)}`}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <FaLayerGroup className="text-xl" />
        </Link>
        <Link 
          to={`/profile/${Number(user?.id)}`}
          className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
        >
          <IoPerson className="text-xl" />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;