import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import MajorCard from '../components/MajorCard';
import { MajorData } from '../types';
import { FaSearch } from 'react-icons/fa';
import { getMajorList } from '../services/majorService';

const Majors: React.FC = () => {
  const [majors, setMajors] = useState<MajorData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        setIsLoading(true);
        const { data } = await getMajorList();
        if (data && data.length > 0) {
          setMajors(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMajors();
  }, []);

  const filteredMajors = majors.filter((major) =>
    major.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />

        <main className="w-full py-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl text-slate-900 tracking-tight">Cari Jurusan</h1>
              <p className="text-sm text-slate-500 mt-1">Eksplorasi jurusan universitas dan ulasan mahasiswa.</p>
            </div>

            <div className="relative max-w-xs w-full">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input 
                type="text" 
                placeholder="Cari nama jurusan..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white shadow-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-36 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-200/40" />
              ))}
            </div>
          ) : filteredMajors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMajors.map((major) => (
                <MajorCard key={major.ID} major={major} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-xs">
              <p className="text-slate-400 font-medium">Tidak ditemukan jurusan dengan nama "{searchTerm}"</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Majors;