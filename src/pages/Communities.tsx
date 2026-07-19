import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import { CommunityCardData } from '../types';
import CommunityCard from '../components/CommunityCard';
import { getCommunities } from '../services/communityService';
import { FaSearch } from 'react-icons/fa';

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityCardData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await getCommunities();
        
        if (data && data.length > 0) {
          setCommunities(data);
        } 
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); 

  const filteredCommunities = communities.filter((c) =>
    c.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredCommunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommunities.map((u) => (
                <CommunityCard 
                  key={u.ID}
                  ID={u.ID}
                  Name={u.Name}
                  Slug={u.Slug}
                  Description={u.Description}
                  LogoPicture={u.LogoPicture}
                  MembersCount={u.MembersCount}
                  CoverPicture={u.CoverPicture}
                />
              ))}
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