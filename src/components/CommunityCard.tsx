import React from "react";
import { useNavigate } from "react-router-dom";
import { CommunityCardData } from "../types";
import { FaUserGroup, FaCheck } from "react-icons/fa6";

interface CommunityCardProps extends CommunityCardData {
  onJoin?: (communityId: number, communityName: string) => void;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ 
  ID, 
  Name, 
  Slug, 
  Description, 
  MembersCount, 
  LogoPicture, 
  CoverPicture,
  isJoined=false,
  isJoining=false,
  onJoin 
}) => {
  const navigate = useNavigate();

  const truncateText = (text: string): string => {
    if (text.length <= 85) return text;
    return text.substring(0, 85) + "...";
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isJoined || isJoining || !onJoin) return;
    onJoin(ID, Name);
  };

  return (
    <div 
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer duration-200" 
      key={ID} 
      onClick={() => navigate(`/community/${Slug}`)}
    >
      <div className="relative h-32 w-full bg-gradient-to-r from-indigo-500 to-violet-600 shrink-0">
        {CoverPicture && (
          <img 
            src={CoverPicture} 
            alt="" 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}
        
        <div className="absolute -bottom-6 left-5 p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="h-14 w-14 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden font-bold text-lg text-indigo-600 border border-slate-100">
            {LogoPicture ? (
              <img
                className="h-full w-full object-cover"
                src={LogoPicture}
                alt={`${Name} logo`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              Name.charAt(0)
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 pt-8 justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-bold text-lg text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
            {Name}
          </h2>
          <p className="text-slate-500 text-xs font-medium leading-relaxed min-h-[3.5rem]">
            {truncateText(Description)}
          </p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-100">
          <div className="flex gap-2 items-center text-slate-500">
            <FaUserGroup className="text-sm shrink-0" />
            <span className="text-xs font-semibold">{(MembersCount ?? 0).toLocaleString('id-ID')} anggota</span>
          </div>
          
          <button 
            onClick={handleJoinClick}
            disabled={isJoined || isJoining}
            className={`text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all duration-150 flex items-center gap-1.5 ${
              isJoined 
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-default" 
                : "bg-indigo-600 hover:bg-indigo-500 active:scale-[0.97] text-white shadow-indigo-100 disabled:opacity-70"
            }`}
          >
            {isJoining ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Proses...</span>
              </>
            ) : isJoined ? (
              <>
                <FaCheck className="text-xs" />
                <span>Tergabung</span>
              </>
            ) : (
              "Gabung"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;