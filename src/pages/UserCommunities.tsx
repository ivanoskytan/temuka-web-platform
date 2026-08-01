import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import CommunityCard from '../components/CommunityCard';
import { getUserJoinedCommunities } from '../services/communityService';
import useAuthStore from '../store/authStore';
import { CommunityCardData } from '../types';
import { FaSearch, FaLayerGroup } from 'react-icons/fa';

const UserCommunities: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const currentUser = useAuthStore((state) => state.user);

  // Target ID comes from route param (e.g., /communities/:userId) or falls back to logged-in user ID
  const targetUserId = userId ? Number(userId) : Number(currentUser?.id);

  const [communities, setCommunities] = useState<CommunityCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!targetUserId) return;

      try {
        setIsLoading(true);
        const res = await getUserJoinedCommunities({ user_id: targetUserId });

        // Normalizing data response structure
        const communityList = res?.data || (Array.isArray(res) ? res : []);
        setCommunities(communityList);
      } catch (err) {
        console.error('Failed to fetch user communities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCommunities();
  }, [targetUserId]);

  // Handle search filter across Name and Description fields
  const filteredCommunities = communities.filter((c) => {
    const name = c.Name || (c as any).name || '';
    const desc = c.Description || (c as any).description || '';
    const query = searchTerm.toLowerCase();

    return name.toLowerCase().includes(query) || desc.toLowerCase().includes(query);
  });

  const isSelf = currentUser?.id && Number(currentUser.id) === targetUserId;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />

        <main className="w-full py-6 flex flex-col gap-6">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl text-slate-900 tracking-tight">
                {isSelf ? 'Komunitas Saya' : 'Komunitas Tergabung'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {isSelf
                  ? 'Daftar kelompok studi dan komunitas akademik yang Anda ikuti.'
                  : 'Daftar komunitas yang diikuti oleh pengguna ini.'}
              </p>
            </div>

            <div className="relative max-w-xs w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Cari komunitas diikuti..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white shadow-2xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Grid Content / Skeletons / Empty States */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-64 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-100"
                />
              ))}
            </div>
          ) : filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommunities.map((item: any) => (
                <CommunityCard
                  key={item.ID || item.id}
                  ID={item.ID || item.id}
                  Name={item.Name || item.name}
                  Slug={item.Slug || item.slug}
                  Description={item.Description || item.description}
                  LogoPicture={item.LogoPicture || item.logo_picture}
                  MembersCount={item.MembersCount || item.members_count}
                  CoverPicture={item.CoverPicture || item.cover_picture}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <FaLayerGroup className="text-xl text-slate-400" />
              </div>

              <div className="flex flex-col gap-1 max-w-sm">
                <p className="text-slate-800 font-semibold text-sm">
                  {searchTerm
                    ? `Tidak ditemukan komunitas dengan nama "${searchTerm}"`
                    : isSelf
                    ? 'Anda belum bergabung dengan komunitas manapun.'
                    : 'Pengguna ini belum bergabung dengan komunitas manapun.'}
                </p>
                <p className="text-slate-400 text-xs font-medium">
                  {searchTerm
                    ? 'Coba periksa kata kunci atau cari komunitas lain.'
                    : isSelf
                    ? 'Jelajahi berbagai komunitas yang tersedia untuk mulai berdiskusi dan belajar bersama.'
                    : ''}
                </p>
              </div>

              {isSelf && !searchTerm && (
                <Link
                  to="/communities"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
                >
                  <FaSearch className="text-xs" />
                  <span>Jelajahi Komunitas</span>
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserCommunities;