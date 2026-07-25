import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaCommentAlt, FaUniversity } from 'react-icons/fa';
import { MajorData, UniversityMajorData } from '../types';

interface MajorCardProps {
  major: MajorData | UniversityMajorData;
}

const MajorCard: React.FC<MajorCardProps> = ({ major }) => {
  const navigate = useNavigate();

  const renderStars = (rating: number | null | undefined) => {
    const totalStars = 5;
    const currentRating = Math.round(rating || 0);
    return (
      <div className="flex items-center gap-0.5 text-amber-500 text-xs">
        {[...Array(totalStars)].map((_, i) =>
          i < currentRating ? (
            <FaStar key={i} />
          ) : (
            <FaRegStar key={i} className="text-slate-300" />
          )
        )}
      </div>
    );
  };

  return (
    <div
      className="group bg-white p-5 border border-slate-200/80 rounded-2xl hover:border-indigo-500/40 cursor-pointer transition-all flex flex-col justify-between hover:shadow-md hover:shadow-slate-100/70 shadow-xs"
      onClick={() => navigate(`/majors/${major.ID}`)}
    >
      <div className="flex flex-col gap-1.5">
        {major.UniversityName && (
          <span className="text-[10px] font-bold tracking-wider text-indigo-600 uppercase flex items-center gap-1.5">
            {major.UniversityLogo ? (
              <img
                src={major.UniversityLogo}
                alt={major.UniversityName}
                className="w-3.5 h-3.5 object-contain rounded-full"
              />
            ) : (
              <FaUniversity className="text-[9px]" />
            )}
            <span className="line-clamp-1">{major.UniversityName}</span>
          </span>
        )}

        <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 leading-snug transition-colors line-clamp-2">
          {major.Name}
        </h2>
      </div>

      <div className="flex items-center gap-4 mt-5 pt-3 border-t border-slate-100">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Rating
          </span>
          {renderStars(Number(major.Rating))}
        </div>

        <div className="w-px h-6 bg-slate-200" />

        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
            Total Ulasan
          </span>
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <FaCommentAlt className="text-slate-300 text-[10px]" />
            {major.TotalReviews || 0} Ulasan
          </span>
        </div>
      </div>
    </div>
  );
};

export default MajorCard;