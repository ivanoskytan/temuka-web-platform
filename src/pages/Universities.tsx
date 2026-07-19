import React, { useEffect, useState } from 'react';
import Leftbar from '../components/Leftbar';
import Navbar from '../components/Navbar';
import UniversityCard from '../components/UniversityCard';
import { UniversityData } from "../types";
import { getUniversities } from '../services/universityService';
import { FaSearch } from 'react-icons/fa'; 

const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await getUniversities();
        
        if (data && data.length > 0) {
          setUniversities(data);
        } 
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredUniversities = universities.filter((u) =>
    u.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />
        
        <main className="w-full py-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl text-slate-900 tracking-tight">Cari Universitas</h1>
              <p className="text-sm text-slate-500 mt-1">Bandingkan akreditasi, biaya kuliah, serta ulasan jurusan kampus impianmu.</p>
            </div>

            <div className="relative max-w-xs w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input 
                type="text" 
                placeholder="Cari nama universitas..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white shadow-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-48 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : filteredUniversities.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredUniversities.map((u) => (
                <UniversityCard 
                  key={u.ID}
                  ID={u.ID}
                  Name={u.Name}
                  Slug={u.Slug}
                  Summary={u.Summary}
                  Website={u.Website}
                  Logo={u.Logo}
                  TotalReviews={u.TotalReviews}
                  TotalMajors={u.TotalMajors}
                  Address={u.Address}
                  Rating={u.Rating}
                  Type={u.Type}
                  MinTuition={u.MinTuition}
                  MaxTuition={u.MaxTuition}
                  Accreditation={u.Accreditation}
                  AcceptanceRate={u.AcceptanceRate}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
              <p className="text-slate-400 font-medium">
                {searchTerm ? `Tidak ditemukan universitas dengan nama "${searchTerm}"` : 'Belum ada universitas terdaftar saat ini.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Universities;