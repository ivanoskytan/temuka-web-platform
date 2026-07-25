import React, { useEffect, useState, useCallback } from "react";
import { UniversityData, UniversityReview, UniversityMajorData } from "../types";
import Navbar from "../components/Navbar";
import Leftbar from "../components/Leftbar";
import MajorCard from "../components/MajorCard";
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
import { getUniversityDetail, getUniversityReviews } from "../services/universityService";
import { getMajorsByUniversity } from "../services/majorService";
import CreateReview from "../components/CreateReview";
import UniversityReviewSubmitForm from "../components/UniversityReviewSubmitForm";

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
    <div className="flex gap-0.5 items-center bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 shadow-xs shrink-0">
      <span className="font-bold text-slate-700 text-sm mr-1.5 mt-0.5">{stars.toFixed(1)}</span>
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, index) => renderStar(100, `full-${index}`))}
        {partialStar > 0 && renderStar(partialStar * 100, "partial")}
        {[...Array(emptyStars)].map((_, index) => renderStar(0, `empty-${index}`))}
      </div>
    </div>
  );
};

const getTimeAgo = (dateInput: Date | string): string => {
  const now = new Date();
  const targetDate = new Date(dateInput);
  const diff = now.getTime() - targetDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} tahun yang lalu`;
  if (months > 0) return `${months} bulan yang lalu`;
  if (weeks > 0) return `${weeks} minggu yang lalu`;
  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  if (minutes > 0) return `${minutes} menit yang lalu`;
  return seconds <= 10 ? 'Baru saja' : `${seconds} detik yang lalu`;
};

const ReviewCard: React.FC<{ review: UniversityReview }> = ({ review }) => {
  return (
    <div className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-xs flex flex-col gap-3 hover:border-slate-300 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            className="h-9 w-9 object-cover rounded-full bg-slate-100 ring-1 ring-slate-200"
            src={review.ProfilePicture || "/assets/DefaultUser.png"}
            alt={review.Username || "User"}
          />
          <div className="flex flex-col">
            <span className="text-slate-800 text-sm font-bold tracking-tight">
              {review.Displayname || review.Username || `User #${review.UserID}`}
            </span>
            <span className="text-slate-400 text-xs font-medium">
              {getTimeAgo(review.CreatedAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100/60 rounded-lg px-2.5 py-1">
          <FaStar className="text-amber-500 text-sm" />
          <span className="text-xs font-bold text-amber-700">{review.Stars}</span>
        </div>
      </div>

      <p className="text-slate-600 font-medium text-sm leading-relaxed mt-1">
        {review.Text}
      </p>
    </div>
  );
};

const UniversityDetail: React.FC = () => {
  const [universityDetail, setUniversityDetail] = useState<UniversityData>();
  const [reviews, setReviews] = useState<UniversityReview[]>([]);
  const [majors, setMajors] = useState<UniversityMajorData[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [loadingMajors, setLoadingMajors] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<UniversityDetailMenu>(UniversityDetailMenu.OVERVIEW);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
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

  const fetchReviews = useCallback(async () => {
    if (!universityDetail?.ID) return;
    setLoadingReviews(true);
    try {
      const res = await getUniversityReviews(universityDetail.ID);
      setReviews(res.data || res || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  }, [universityDetail?.ID]);

  const fetchMajors = useCallback(async () => {
    if (!universityDetail?.ID) return;
    setLoadingMajors(true);
    try {
      const res = await getMajorsByUniversity(universityDetail.ID);
      setMajors(res.data || res || []);
    } catch (err) {
      console.error("Failed to fetch majors:", err);
    } finally {
      setLoadingMajors(false);
    }
  }, [universityDetail?.ID]);

  useEffect(() => {
    if (selectedMenu === UniversityDetailMenu.REVIEWS && universityDetail?.ID) {
      fetchReviews();
    } else if (selectedMenu === UniversityDetailMenu.MAJORS && universityDetail?.ID) {
      fetchMajors();
    }
  }, [selectedMenu, universityDetail?.ID, fetchReviews, fetchMajors]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />
        
        <main className="w-full py-6 flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
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

            <StarRating stars={Number(universityDetail?.Rating || 0)}/>
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

          <div className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs min-h-[300px]">
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
              loadingMajors ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="h-36 bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : majors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {majors.map((major) => (
                    <MajorCard key={major.ID} major={major} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-400 font-medium text-sm">Daftar Program Studi belum tersedia.</p>
                </div>
              )
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Ulasan Pengguna</h2>
                    <p className="text-xs text-slate-400 font-medium">Pengalaman mahasiswa dan alumni di kampus ini</p>
                  </div>
                  <CreateReview onClick={() => setIsReviewModalOpen(true)} />
                </div>

                {loadingReviews ? (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-medium text-sm">Memuat ulasan...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {reviews.map((rev, index) => (
                      <ReviewCard key={rev.ID || index} review={rev} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-medium text-sm">Belum ada ulasan untuk universitas ini.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {isReviewModalOpen && universityDetail?.ID && (
        <UniversityReviewSubmitForm
          universityId={universityDetail.ID}
          onClose={() => setIsReviewModalOpen(false)}
          onSuccess={fetchReviews}
        />
      )}
    </div>
  );
};

export default UniversityDetail;