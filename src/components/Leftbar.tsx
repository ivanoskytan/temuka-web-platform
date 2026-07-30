import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLayerGroup, FaUniversity } from "react-icons/fa";
import { IoSettings, IoSchool } from "react-icons/io5";
import { getUserJoinedCommunities } from '../services/communityService';
import useAuthStore from '../store/authStore';

interface CommunityItem {
  ID?: number;
  id?: number;
  Name?: string;
  name?: string;
  Slug?: string;
  slug?: string;
}

const Leftbar: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [userCommunities, setUserCommunities] = useState<CommunityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserCommunities = async () => {
      setIsLoading(true);
      try {
        const res = await getUserJoinedCommunities({ user_id: Number(user.id) });
        if (res?.data) {
          setUserCommunities(res.data);
        } else if (Array.isArray(res)) {
          setUserCommunities(res);
        }
      } catch (err) {
        console.error("Failed to fetch user joined communities:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCommunities();
  }, [user?.id]);

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm transition-all group ${
      isActive 
        ? 'bg-indigo-50 text-indigo-600' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  };

  const mainNavigation = [
    { name: 'Beranda', path: '/', icon: FaHome },
    { name: 'Komunitas', path: '/communities', icon: FaLayerGroup },
    { name: 'Universitas', path: '/universities', icon: FaUniversity },
    { name: 'Prodi', path: '/majors', icon: IoSchool },
    { name: 'Pengaturan', path: '/settings', icon: IoSettings },
  ];

  return (
    <div className="hidden md:flex flex-col gap-8 w-full sticky top-22 py-6">
      <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
        {mainNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
              <Icon className="text-xl shrink-0 transition-transform group-hover:scale-105" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <hr className="border-slate-200/80 mx-2" />

      <div className="flex flex-col gap-3">
        <h2 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Komunitas Kamu
        </h2>
        
        <nav className="flex flex-col gap-1.5" aria-label="Communities Navigation">
          {isLoading ? (
            <div className="px-4 py-2 text-xs font-medium text-slate-400">
              Memuat...
            </div>
          ) : userCommunities.length > 0 ? (
            userCommunities.map((item) => {
              const communitySlug = item.Slug || item.slug || '';
              const communityName = item.Name || item.name || '';
              const path = `/community/${communitySlug}`;

              return (
                <Link key={item.ID || item.id || communitySlug} to={path} className={getLinkClass(path)}>
                  <span className="truncate">{communityName}</span>
                </Link>
              );
            })
          ) : (
            <div className="px-4 py-2 text-xs font-medium text-slate-400">
              Belum bergabung dengan komunitas
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

export default Leftbar;