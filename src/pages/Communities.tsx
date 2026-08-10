import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import { CommunityCardData } from '../types';
import CommunityCard from '../components/CommunityCard';
import { getCommunities, joinCommunity, getUserJoinedCommunities } from '../services/communityService';
import { FaSearch, FaCheck } from 'react-icons/fa';
import { FaXmark } from "react-icons/fa6";
import useAuthStore from '../store/authStore';

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [joinedCommunityName, setJoinedCommunityName] = useState<string>("");

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [communitiesRes, joinedRes] = await Promise.all([
          getCommunities(),
          user?.id ? getUserJoinedCommunities({ user_id: user.id }) : Promise.resolve({ data: [] })
        ]);

        const allCommunities = communitiesRes?.data || [];
        const joinedCommunities = joinedRes?.data || [];

        const joinedIdsSet = new Set(joinedCommunities.map((item: any) => item.ID));

        const updatedCommunities = allCommunities.map((community: CommunityCardData) => {
          const isJoined = joinedIdsSet.has(community.ID);
          return {
            ...community,
            is_joined: isJoined,
            isJoined: isJoined
          };
        });

        setCommunities(updatedCommunities);
      } catch (err) {
        console.error("Error loading communities data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]); 

  const filteredCommunities = communities.filter((c) =>
    c.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoin = async (communityId: number, communityName: string) => {
    if (!user?.id || joiningId !== null) return;

    try {
      setJoiningId(communityId);
      await joinCommunity({ user_id: user.id }, communityId);

      setCommunities((prev) => 
        prev.map((item) =>
          item.ID === communityId
            ? {
                ...item,
                is_joined: true,
                isJoined: true,
                MembersCount: item.MembersCount + 1,
              }
            : item
        )
      );

      setJoinedCommunityName(communityName);    
      setShowJoinModal(true);
    } catch (err) {
      console.error("Failed to join community:", err);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />
        
        <main className="w-full py-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl text-slate-900 tracking-tight">Jelajahi Komunitas</h1>
              <p className="text-sm text-slate-500 mt-1">Temukan kelompok studi dan prodi yang sesuai dengan minat akademikmu.</p>
            </div>

            <div className="relative max-w-xs w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input 
                type="text" 
                placeholder="Cari nama komunitas..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white shadow-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {showJoinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-modal-backdrop">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center gap-4 relative animate-modal-card">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
                >
                  <FaXmark className="text-base" />
                </button>

                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
                  <FaCheck />
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-slate-900">
                    Berhasil Bergabung!
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Selamat! Kamu telah menjadi bagian dari{" "}
                    <span className="font-semibold text-slate-700">
                      {joinedCommunityName}
                    </span>
                    .
                  </p>
                </div>

                <button
                  onClick={() => setShowJoinModal(false)}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-indigo-100 text-sm"
                >
                  Mulai Eksplorasi
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommunities.map((u) => {
                const isJoined = u.isJoined || false;
                const isJoining = joiningId === u.ID;

                return (
                  <CommunityCard 
                    key={u.ID}
                    ID={u.ID}
                    Name={u.Name}
                    Slug={u.Slug}
                    Description={u.Description}
                    LogoPicture={u.LogoPicture}
                    MembersCount={u.MembersCount}
                    CoverPicture={u.CoverPicture}
                    isJoined={isJoined}
                    isJoining={isJoining}
                    onJoin={handleJoin}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
              <p className="text-slate-400 font-medium">
                {searchTerm ? `Tidak ditemukan komunitas dengan nama "${searchTerm}"` : 'Belum ada komunitas terdaftar saat ini.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Communities;