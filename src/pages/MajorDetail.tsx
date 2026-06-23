import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import { useParams, useNavigate } from 'react-router';
import { MajorData } from '../types';
import { FaArrowLeft, FaStar, FaRegStar, FaUserCircle, FaCalendarAlt, FaComments, FaUniversity, FaFileAlt } from 'react-icons/fa';

const DUMMY_DETAIL_BACKEND: MajorData = {
  ID: 1,
  Name: "Ilmu Komputer",
  Description: "Program Studi Ilmu Komputer berfokus pada pengembangan kemampuan analitis dan praktis dalam rekayasa perangkat lunak, sistem cerdas, arsitektur jaringan, serta pengolahan data skala besar (Big Data). Kurikulum dirancang secara adaptif untuk membekali mahasiswa dengan fondasi algoritma yang kuat serta penguasaan teknologi mutakhir guna mencetak inovator teknologi digital masa depan.",
  UniversityData: {
    ID: 10,
    Name: "Universitas Indonesia",
    Logo: ""
  },
  TotalReviews: 2,
  Rating: 5,
  CreatedAt: new Date("2026-01-15T08:00:00Z"),
  UpdatedAt: new Date("2026-02-20T14:30:00Z"),
  Reviews: [
    {
      ID: 101,
      MajorID: 1,
      UserData: {
        ID: 1,
        Username: "John Rex",
        Displayname: "Mahasiswa sejati",
        ProfilePicture: ""
      },
      Text: "Materi kuliah sangat relevan dengan kebutuhan industri saat ini, terutama pada fokus Cloud Architecture dan Artificial Intelligence.",
      Stars: 5,
      CreatedAt: new Date("2026-05-10T12:00:00Z"),
      UpdatedAt: new Date("2026-05-10T12:00:00Z")
    },
    {
      ID: 102,
      MajorID: 1,
      UserData: {
        ID: 2,
        Username: "Axel",
        Displayname: "Mahasiswa abadi",
        ProfilePicture: ""
      },
      Text: "Dosen-dosennya sangat suportif dan praktikal. Banyak proyek riil yang bisa dimasukkan ke portofolio buat bekal lulus nanti.",
      Stars: 5,
      CreatedAt: new Date("2026-05-12T09:15:00Z"),
      UpdatedAt: new Date("2026-05-12T09:15:00Z")
    }
  ]
};

const MajorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [major, setMajor] = useState<MajorData | null>(DUMMY_DETAIL_BACKEND);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          i < rating ? <FaStar key={i} className="text-sm" /> : <FaRegStar key={i} className="text-slate-200 text-sm" />
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  };

  if (!major) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-medium text-slate-400">
        Memuat info jurusan...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />

        <main className="w-full py-6 flex flex-col gap-6">
          
          <div className="flex flex-col gap-4 max-w-4xl w-full">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)} 
                className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-2xs group shrink-0"
                title="Kembali"
              >
                <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              </button>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span>Eksplorasi</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-indigo-600">Detail Jurusan</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm relative overflow-hidden w-full">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
                  {major.Name}
                </h1>
                
                {/* Connected University Meta Section */}
                {major.UniversityData && (
                  <div className="flex items-center gap-2 text-slate-500 font-semibold text-sm mt-1 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl w-fit">
                    <FaUniversity className="text-indigo-500 text-base" />
                    <span className="text-slate-700">{major.UniversityData.Name}</span>
                    <span className="text-xs font-bold text-slate-300 px-1">ID: #{major.UniversityData.ID}</span>
                  </div>
                )}
              </div>

              {/* Micro Metrics Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="bg-slate-50/60 border border-slate-150 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-xl text-amber-500 text-lg shadow-2xs border border-amber-100/40">
                    <FaStar />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rating Jurusan</span>
                    <span className="text-lg font-black text-slate-800 mt-0.5 block leading-none">
                      {major.Rating ? `${major.Rating}.0` : '0.0'} <span className="text-xs font-medium text-slate-400">/ 5.0</span>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50/60 border border-slate-150 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500 text-lg shadow-2xs border border-indigo-100/40">
                    <FaComments />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Review</span>
                    <span className="text-lg font-black text-slate-800 mt-0.5 block leading-none">
                      {major.TotalReviews || 0} <span className="text-xs font-medium text-slate-400">Ulasan</span>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50/60 border border-slate-150 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500 text-lg shadow-2xs border border-emerald-100/40">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Terakhir Diperbarui</span>
                    <span className="text-sm font-bold text-slate-700 mt-1 block leading-none">
                      {formatDate(major.UpdatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-2">
                  <FaFileAlt className="text-slate-400 text-xs" />
                  <span>Deskripsi Program Studi</span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  {major.Description || "Belum ada informasi deskripsi resmi untuk program studi ini."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2 w-full">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Arsip Testimoni Mahasiswa
                </h2>
                <span className="text-xs bg-slate-200/60 font-bold px-2.5 py-0.5 rounded-full text-slate-600">
                  {major.Reviews?.length || 0} Terverifikasi
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {major.Reviews && major.Reviews.length > 0 ? (
                  major.Reviews.map((rev) => (
                    <div 
                      key={rev.ID} 
                      className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {rev.UserData.ProfilePicture ? (
                            <img 
                              src={rev.UserData.ProfilePicture} 
                              alt={rev.UserData.Username} 
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shrink-0" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 shrink-0">
                              <FaUserCircle className="w-6 h-6" />
                            </div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-800 tracking-tight truncate">
                              {rev.UserData.Displayname || rev.UserData.Username}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium truncate">
                              @{rev.UserData.Username} • {formatDate(rev.CreatedAt)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="shrink-0 pt-0.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                          {renderStars(rev.Stars)}
                        </div>
                      </div>

                      <p className="text-slate-600 font-medium text-sm leading-relaxed bg-slate-50/40 p-4 rounded-xl border border-slate-100/70 italic">
                        "{rev.Text}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-white border border-slate-200 border-dashed p-12 rounded-2xl text-center">
                    <p className="text-slate-400 font-semibold text-sm">Belum ada evaluasi atau ulasan tertulis untuk prodi ini.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default MajorDetail;