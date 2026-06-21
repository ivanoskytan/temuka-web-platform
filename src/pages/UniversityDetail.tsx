import React, { useEffect, useState } from "react";
import { UniversityData } from "../types";
import Navbar from "../components/Navbar";
import Leftbar from "../components/Leftbar";
import { 
  FaStar, 
  FaBookOpen, 
  FaWallet, 
  FaLocationDot, 
  FaRegStar, 
  FaArrowUpRightFromSquare,
  FaPercent,
  FaGraduationCap,
  FaCommentDots
} from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { getUniversityDetail } from "../services/universityService";

enum UniversityDetailMenu {
  OVERVIEW = "overview",
  MAJORS = "majors",
  REVIEWS = "reviews"
}

const StarRating: React.FC<{ stars: number }> = ({ stars }) => {
  const fullStars = Math.floor(stars);
  const partialStar = stars % 1;
  const emptyStars = Math.max(0, 5 - fullStars - (partialStar > 0 ? 1 : 0));

  const renderStar = (filledPercentage: number, key: string) => (
    <div className="relative w-5 h-5 md:w-6 md:h-6" key={key}>
      <FaRegStar className="absolute text-slate-200 text-xl md:text-2xl" /> 
      <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${filledPercentage}%` }}>
        <FaStar className="text-amber-500 text-xl md:text-2xl"/>
      </div>
    </div>
  );

  return (
    <div className="flex gap-0.5 items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm shrink-0">
      <span className="font-bold text-slate-700 text-sm mr-1.5 mt-0.5">{stars.toFixed(1)}</span>
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, index) => renderStar(100, `full-${index}`))}
        {partialStar > 0 && renderStar(partialStar * 100, "partial")}
        {[...Array(emptyStars)].map((_, index) => renderStar(0, `empty-${index}`))}
      </div>
    </div>
  );
};

const UniversityDetail: React.FC = () => {
  const [universityDetail, setUniversityDetail] = useState<UniversityData>();
  const [selectedMenu, setSelectedMenu] = useState<UniversityDetailMenu>(UniversityDetailMenu.OVERVIEW);
  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getUniversityDetail(String(slug));
        setUniversityDetail(data);
      } catch(err) {
        console.error(err);
      }
    }; 
    fetchData();
  }, [slug]); 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />
        
        <main className="w-full py-6 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
            <div className="flex gap-4 items-center min-w-0">
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-3 shrink-0">
                {universityDetail?.Logo ? (
                  <img src={universityDetail.Logo} alt={universityDetail?.Name} className="w-full h-full object-contain"/>
                ) : (
                  <FaGraduationCap className="text-4xl text-indigo-500" />
                )}
              </div>
              
              <div className="flex flex-col gap-2 min-w-0">
                <h1 className="text-xl md:text-3xl font-bold text-slate-900 tracking-tight line-clamp-1">
                  {universityDetail?.Name || "Memuat..."}
                </h1>
                <div className="flex gap-2 shrink-0">
                  <span className="text-[11px] font-bold tracking-wide text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50">
                    {universityDetail?.Type}
                  </span>
                  <span className="text-[11px] font-bold tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">
                    Akreditasi {universityDetail?.Accreditation}
                  </span>
                </div>
              </div>
            </div>

            <StarRating stars={Number(universityDetail?.Stars || 0)}/>
          </div>

          <div className="flex border-b border-slate-200 gap-1 overflow-x-auto scrollbar-none w-full">
            <button 
              onClick={() => setSelectedMenu(UniversityDetailMenu.OVERVIEW)} 
              className={`pb-3 px-4 text-sm font-bold tracking-tight border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                selectedMenu === UniversityDetailMenu.OVERVIEW 
                  ? "border-indigo-600 text-indigo-600 font-extrabold" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <FaBookOpen className="text-sm" /> Ringkasan
            </button>
            <button 
              onClick={() => setSelectedMenu(UniversityDetailMenu.MAJORS)} 
              className={`pb-3 px-4 text-sm font-bold tracking-tight border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                selectedMenu === UniversityDetailMenu.MAJORS 
                  ? "border-indigo-600 text-indigo-600 font-extrabold" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <FaGraduationCap className="text-base" /> Program Studi
            </button>
            <button 
              onClick={() => setSelectedMenu(UniversityDetailMenu.REVIEWS)} 
              className={`pb-3 px-4 text-sm font-bold tracking-tight border-b-2 transition-all shrink-0 flex items-center gap-2 ${
                selectedMenu === UniversityDetailMenu.REVIEWS 
                  ? "border-indigo-600 text-indigo-600 font-extrabold" 
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <FaCommentDots className="text-sm" /> Ulasan
            </button>
          </div>

          <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm min-h-[300px]">
            {selectedMenu === UniversityDetailMenu.OVERVIEW ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                
                <div className="md:col-span-2 flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/40 shrink-0">
                    <FaBookOpen className="text-lg md:text-xl" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Tentang Kampus</span>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed mt-1">
                      {universityDetail?.Summary || "Tidak ada ringkasan deskripsi tersedia."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl border border-sky-100/40 shrink-0">
                    <FaLocationDot className="text-lg md:text-xl" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Lokasi Wilayah</span>
                    <p className="text-slate-800 text-base font-semibold mt-0.5">{universityDetail?.Address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/40 shrink-0">
                    <FaWallet className="text-lg md:text-xl" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Estimasi UKT / Biaya Kuliah</span>
                    <p className="text-slate-800 text-base font-bold mt-0.5">
                      Rp {(universityDetail?.MinTuition || 0).toLocaleString('id-ID')} - Rp {(universityDetail?.MaxTuition || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100/40 shrink-0">
                    <FaPercent className="text-base md:text-lg" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Rasio Penerimaan</span>
                    <p className="text-slate-800 text-base font-semibold mt-0.5">{universityDetail?.AcceptanceRate}%</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                  <div className="p-3 bg-violet-50 text-violet-600 rounded-xl border border-violet-100/40 shrink-0">
                    <FaArrowUpRightFromSquare className="text-base" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">Situs Resmi</span>
                    <a 
                      href={universityDetail?.Website} 
                      className="text-indigo-600 font-semibold mt-0.5 hover:underline break-all block text-sm" 
                      rel="noopener noreferrer" 
                      target="_blank"
                    >
                      {universityDetail?.Website}
                    </a>
                  </div>
                </div>

              </div>
            ) : selectedMenu === UniversityDetailMenu.MAJORS ? (
              <div className="text-center py-12">
                <p className="text-slate-400 font-medium text-sm">Daftar Program Studi belum tersedia.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 font-medium text-sm">Belum ada ulasan untuk universitas ini.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default UniversityDetail;