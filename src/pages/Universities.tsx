import React, { useEffect, useState } from 'react';
import Leftbar from '../components/Leftbar';
import Navbar from '../components/Navbar';
import UniversityCard from '../components/UniversityCard';
import { UniversityData } from "../types";
import { getUniversities } from '../services/universityService';

const DUMMY_UNIVERSITIES: UniversityData[] = [
  {
    ID: 1,
    Name: "Universitas Gadjah Mada",
    Slug: "ugm",
    Summary: "Universitas nasional tertua dan salah satu yang terbaik di Indonesia, berfokus pada pendidikan berkualitas tinggi dan pengabdian masyarakat.",
    Website: "https://ugm.ac.id",
    Logo: "",
    TotalReviews: 340,
    TotalMajors: 95,
    Address: "Sleman, DI Yogyakarta",
    Stars: 4.8,
    Type: "Negeri",
    MinTuition: 0,
    MaxTuition: 26000000,
    Accreditation: "Unggul",
    AcceptanceRate: 8.5
  },
  {
    ID: 2,
    Name: "Universitas Indonesia",
    Slug: "ui",
    Summary: "Kampus modern bernuansa hijau yang menghasilkan lulusan unggul berkompetensi global serta pusat riset mutakhir di Indonesia.",
    Website: "https://ui.ac.id",
    Logo: "",
    TotalReviews: 295,
    TotalMajors: 88,
    Address: "Depok, Jawa Barat",
    Stars: 4.7,
    Type: "Negeri",
    MinTuition: 0,
    MaxTuition: 20000000,
    Accreditation: "Unggul",
    AcceptanceRate: 7.2
  },
  {
    ID: 3,
    Name: "Institut Teknologi Bandung",
    Slug: "itb",
    Summary: "Pusat keunggulan sains, teknologi, dan seni di Indonesia dengan standar akademik ketat dan ekosistem inovasi digital.",
    Website: "https://itb.ac.id",
    Logo: "",
    TotalReviews: 180,
    TotalMajors: 52,
    Address: "Bandung, Jawa Barat",
    Stars: 4.9,
    Type: "Negeri",
    MinTuition: 0,
    MaxTuition: 25000000,
    Accreditation: "Unggul",
    AcceptanceRate: 6.8
  }
];

const Universities: React.FC = () => {
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await getUniversities();
        
        if (data && data.length > 0) {
          setUniversities(data);
        } else {
          setUniversities(DUMMY_UNIVERSITIES);
        }
      } catch (err) {
        setUniversities(DUMMY_UNIVERSITIES);
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
            <h1 className="font-bold text-2xl text-slate-900 tracking-tight">Cari Universitas</h1>
            <p className="text-sm text-slate-500 mt-1">Bandingkan akreditasi, biaya kuliah, serta ulasan jurusan kampus impianmu.</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-48 bg-slate-200/60 rounded-2xl animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : universities.length > 0 ? (
            <div className="flex flex-col gap-4">
              {universities.map((u) => (
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
                  Stars={u.Stars}
                  Type={u.Type}
                  MinTuition={u.MinTuition}
                  MaxTuition={u.MaxTuition}
                  Accreditation={u.Accreditation}
                  AcceptanceRate={u.AcceptanceRate}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
              <p className="text-slate-400 font-medium">Belum ada universitas terdaftar saat ini.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Universities;