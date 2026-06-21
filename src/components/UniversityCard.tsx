import React from "react";
import { FaLocationDot, FaStar, FaGraduationCap, FaRegCommentDots } from "react-icons/fa6";
import { UniversityData } from "../types";
import { useNavigate } from "react-router-dom";

const UniversityCard: React.FC<UniversityData> = ({
  ID,
  Name,
  Slug,
  Summary,
  Logo,
  TotalReviews,
  TotalMajors,
  Address,
  Stars,
  Type,
  Accreditation
}) => {
  const navigate = useNavigate();

  return (
    <div 
      key={ID}
      onClick={() => navigate(`/university/${Slug}`)}
      className="group bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col md:flex-row gap-5 shadow-sm hover:shadow-md hover:border-slate-300 cursor-pointer transition-all duration-200 w-full"
    >
      <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
        {Logo ? (
          <img src={Logo} alt={`${Name} logo`} className="w-full h-full object-contain" />
        ) : (
          <FaGraduationCap className="text-3xl text-indigo-500" />
        )}
      </div>

      <div className="flex flex-col flex-1 gap-3 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
              {Name}
            </h2>
            
            <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-slate-500">
              <div className="flex gap-1 items-center text-amber-500">
                <FaStar className="text-sm shrink-0" />
                <span>{Stars.toFixed(1)}</span>
              </div>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <div className="flex gap-1 items-center">
                <FaLocationDot className="text-slate-400 shrink-0" />
                <span className="truncate">{Address}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 shrink-0 self-start sm:self-center">
            <span className="text-[11px] font-bold tracking-wide text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100/50">
              {Type}
            </span>
            <span className="text-[11px] font-bold tracking-wide text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">
              Akreditasi {Accreditation}
            </span>
          </div>
        </div>

        <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
          {Summary}
        </p>

        <div className="flex gap-6 pt-3 border-t border-slate-100 mt-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
              {/* Swapped out icon wrapper reference smoothly here */}
              <FaRegCommentDots className="text-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-800 leading-none">{TotalReviews || 0}</span>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5">Ulasan</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400 border border-slate-100">
              <FaGraduationCap className="text-sm" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-slate-800 leading-none">{TotalMajors || 0}</span>
              <span className="text-[11px] font-medium text-slate-400 mt-0.5">Program Studi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;