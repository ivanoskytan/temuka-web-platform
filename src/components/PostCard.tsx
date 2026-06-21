import React, { useState, useEffect } from 'react';
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import { FaCommentDots } from "react-icons/fa";
import { MdSaveAlt } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { PostData, UserDetailData } from '../types';
import { getUserDetail } from '../services/userService';

const PostCard: React.FC<PostData> = ({ ID = '', UserID, Title, Description, Upvote, Comments, CreatedAt }) => {
  const navigate = useNavigate();
  const [postUserdata, setPostUserdata] = useState<UserDetailData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getUserDetail(UserID);
        setPostUserdata(data);
      } catch (err) {
        if (UserID === 101) {
          setPostUserdata({ Username: "budi_developer", ProfilePicture: "" });
        } else if (UserID === 102) {
          setPostUserdata({ Username: "siti_design", ProfilePicture: "" });
        }
      }
    };
    fetchData();
  }, [UserID]);

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const targetDate = new Date(date);
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

  const truncateText = (text: string): string => {
    if (text.length <= 160) return text;
    return text.substring(0, 160).trim() + "...";
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleDownvote = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col gap-3 hover:border-slate-300 cursor-pointer transition-all duration-200" 
      onClick={() => navigate(`/post/${ID}`)}
    >
      <div className="flex items-center gap-2">
        <img
          className="h-8 w-8 object-cover rounded-full bg-slate-100 ring-1 ring-slate-200"
          src={postUserdata?.ProfilePicture || "/assets/DefaultUser.png"}
          alt="profile"
        />
        <Link 
          to={`/community`}
          onClick={(e) => e.stopPropagation()}
          className='text-slate-800 text-sm font-bold hover:underline tracking-tight'
        >
          {postUserdata?.Username || `User #${UserID}`}
        </Link>
        <span className="text-slate-400 text-xs font-medium">
          • {getTimeAgo(CreatedAt)}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
          {Title}
        </h2>
        <p className="text-slate-600 font-medium text-sm leading-relaxed">
          {truncateText(Description)}
        </p>
      </div>

      <div className='flex items-center justify-between mt-2 pt-2 border-t border-slate-50'>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 rounded-xl px-1 py-0.5 border border-slate-200/40">
            <button 
              onClick={handleUpvote}
              className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <BiSolidUpvote className="text-lg" />
            </button>
            <span className="px-1 text-slate-700 font-bold text-xs">
              {Array.isArray(Upvote) ? Upvote.length : 0}
            </span>
            <button 
              onClick={handleDownvote}
              className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <BiSolidDownvote className="text-lg" />
            </button>
          </div>

          <div className="bg-slate-100 border border-slate-200/40 px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-600 hover:bg-slate-200/60 transition-colors">
            <FaCommentDots className="text-base text-slate-400" />
            <span className="text-xs font-bold text-slate-700">{Comments || 0}</span>
          </div>
        </div>

        <button 
          onClick={handleSave}
          className="p-2 text-slate-400 hover:text-amber-500 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <MdSaveAlt className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;