import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import { useNavigate } from 'react-router';
import { MajorData } from '../types';
import { FaSearch, FaStar, FaRegStar, FaCommentAlt, FaUniversity } from 'react-icons/fa';
import { getMajorList } from '../services/majorService';

const DUMMY_BACKEND_MAJORS: MajorData[] = [
  {
    ID: 1,
    Name: "Teknik Industri",
    UniversityData: {
      ID: 10,
      Name: "Universitas Indonesia",
      Logo: ""
    },
    Description: "",
    TotalReviews: 48,
    Rating: 5,
    CreatedAt: new Date("2026-01-15T08:00:00Z"),
    UpdatedAt: new Date("2026-02-20T14:30:00Z")
  },
  {
    ID: 2,
    Name: "Hukum",
    UniversityData: {
      ID: 12,
      Name: "Universitas Gadjah Mada",
      Logo: ""
    },
    Description: "",
    TotalReviews: 32,
    Rating: 4,
    CreatedAt: new Date("2026-01-16T09:15:00Z"),
    UpdatedAt: new Date("2026-03-01T11:20:00Z")
  },
  {
    ID: 3,
    Name: "Desain Komunikasi Visual",
    UniversityData: {
      ID: 30,
      Name: "Universitas Bina Nusantara",
      Logo: ""
    },
    Description: "",      
    TotalReviews: 14,
    Rating: 4,
    CreatedAt: new Date("2026-02-01T10:00:00Z"),
    UpdatedAt: new Date("2026-02-15T16:45:00Z")
  }
];

const Majors: React.FC = () => {
  const navigate = useNavigate();
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
        } else {
          setMajors(DUMMY_BACKEND_MAJORS);
        }
      } catch (err) {
        setMajors(DUMMY_BACKEND_MAJORS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMajors();
  }, []);

  const filteredMajors = majors.filter((major) => 
    major.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating: number | null) => {
    const totalStars = 5;
    const currentRating = rating || 0;
    return (
      <div className="flex items-center gap-0.5 text-amber-500 text-xs">
        {[...Array(totalStars)].map((_, i) => (
          i < currentRating ? <FaStar key={i} /> : <FaRegStar key={i} className="text-slate-300" />
        ))}
      </div>
    );
  };

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
                <div key={n} className="h-32 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-200/40" />
              ))}
            </div>
          ) : filteredMajors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMajors.map((major) => (
                <div 
                  className="group bg-white p-5 border border-slate-200/80 rounded-2xl hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md hover:shadow-slate-100/70 shadow-xs"
                  key={major.ID}
                  onClick={() => navigate(`/majors/${major.ID}`)}
                >
                  <div className="flex flex-col gap-1.5">
                    {major.UniversityData ? (
                      <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase flex items-center gap-1">
                        <FaUniversity className="text-[9px]" /> {major.UniversityData.Name}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        ID Universitas: #{major.ID}
                      </span>
                    )}
                    
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 leading-snug transition-colors">
                      {major.Name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-4 mt-5 pt-3 border-t border-slate-100">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Rating</span>
                      {renderStars(Number(major.Rating))}
                    </div>
                    
                    <div className="w-px h-6 bg-slate-200" />

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Total Ulasan</span>
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                        <FaCommentAlt className="text-slate-300 text-[10px]" />
                        {major.TotalReviews || 0} Ulasan
                      </span>
                    </div>
                  </div>
                </div>
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