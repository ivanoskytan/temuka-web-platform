import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLayerGroup, FaUser, FaGear, FaRightFromBracket, FaStar } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

import { IoPerson, IoChatbubbleEllipsesOutline } from "react-icons/io5";

import useAuthStore from '../store/authStore';
import { UserDetailData } from '../types';
import { searchUsers, getUserDetail } from '../services/userService';
import { getFileStorage } from '../services/index';
import useChatStore from '../store/chatStore';

const Navbar: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { isChatVisible, setChatVisible } = useChatStore();
  const [usersList, setUsersList] = useState<UserDetailData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<UserDetailData | null>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const publicFolder = getFileStorage();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      try {
        const { data } = await getUserDetail(Number(user.id));
        setUserDetail(data);
      } catch (err) {
        console.error("Failed to fetch user profile details:", err);
      }
    };
    fetchUserData();
  }, [user?.id]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current && 
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const getProfileImageSrc = (picturePath?: string) => {
    if (picturePath) {
      return picturePath.startsWith('http') 
        ? picturePath 
        : `${publicFolder}${picturePath}`;
    }
    return '/assets/DefaultUser.png';
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md flex items-center justify-between px-6 border-b border-slate-200 z-50 shadow-xs">
      <div className="flex items-center">
        <Link to="/" className="text-indigo-600 font-black text-2xl tracking-tight hover:opacity-90 transition-opacity">
          temuka
        </Link>
      </div>

      <div className="relative w-full max-w-md mx-4">
        <div className="flex gap-2.5 bg-slate-100 rounded-xl px-4 py-2 w-full items-center focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600 focus-within:shadow-xs transition-all border border-transparent focus-within:border-transparent">
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
                      src={getProfileImageSrc(u?.ProfilePicture)}
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
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${isChatVisible ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'}`}
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

        <div className="relative" ref={profileMenuRef}>
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              isProfileMenuOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="User Profile Options"
          >
            <IoPerson className="text-xl" />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 px-3 z-50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 p-2 border-b border-slate-100 pb-3">
                <img
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0"
                  src={getProfileImageSrc(userDetail?.ProfilePicture)}
                  alt="Profile Avatar"
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-slate-900 text-sm truncate">
                    {userDetail?.Username || 'Pengguna'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium truncate">
                    {userDetail?.Email || user?.email || '-'}
                  </span>
                  {userDetail?.SocialPoint !== undefined && (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-0.5">
                      <FaStar className="text-amber-500 text-[10px]" />
                      <span>{userDetail.SocialPoint} Poin</span>
                    </div>
                  )}
                </div>
              </div>


              <div className="flex flex-col gap-0.5">
                <Link
                  to={`/settings`}
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FaUser className="text-slate-400 text-sm" />
                  <span>Lihat Profil</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FaGear className="text-slate-400 text-sm" />
                  <span>Pengaturan</span>
                </Link>
              </div>

              <hr className="border-slate-100 my-0.5" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left cursor-pointer"
              >
                <FaRightFromBracket className="text-rose-500 text-sm" />
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;