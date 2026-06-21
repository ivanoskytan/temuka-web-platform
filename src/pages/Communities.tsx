import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import { CommunityCardData } from '../types';
import CommunityCard from '../components/CommunityCard';
import { getCommunities } from '../services/communityService';

const DUMMY_COMMUNITIES: CommunityCardData[] = [
  {
    ID: "1",
    Name: "Informatika Indonesia",
    Slug: "informatika",
    Description: "Wadah diskusi seputar software engineering, web development, AI, dan tips coding mahasiswa IT.",
    LogoPicture: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80",
    CoverPicture: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    MembersCount: 1420
  },
  {
    ID: "2",
    Name: "Anak Matematika",
    Slug: "matematika",
    Description: "Komunitas pencinta matematika murni, kalkulus, aljabar linear, dan statistika data.",
    LogoPicture: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=150&auto=format&fit=crop&q=80",
    CoverPicture: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    MembersCount: 840
  },
  {
    ID: "3",
    Name: "Fisika Eksperimen",
    Slug: "fisika",
    Description: "Berbagi riset, bantuan tugas mekanika, fisika kuantum, hingga proyek instrumen laboratorium.",
    LogoPicture: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=80",
    CoverPicture: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
    MembersCount: 610
  },
  {
    ID: "4",
    Name: "Pejuang KKN 2026",
    Slug: "kkn-2026",
    Description: "Ruang berbagi cerita, program kerja kreatif, dan persiapan kebutuhan KKN antar universitas.",
    LogoPicture: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80",
    CoverPicture: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80",
    MembersCount: 2350
  }
];

const Communities: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await getCommunities();
        
        if (data && data.length > 0) {
          setCommunities(data);
        } else {
          setCommunities(DUMMY_COMMUNITIES);
        }
      } catch (err) {
        setCommunities(DUMMY_COMMUNITIES);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />
        
        <main className="w-full py-6 flex flex-col gap-6">
          <div>
            <h1 className="font-bold text-2xl text-slate-900 tracking-tight">Jelajahi Komunitas</h1>
            <p className="text-sm text-slate-500 mt-1">Temukan kelompok studi dan prodi yang sesuai dengan minat akademikmu.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : communities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((u) => (
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
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-slate-400 font-medium">Belum ada komunitas terdaftar saat ini.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Communities;