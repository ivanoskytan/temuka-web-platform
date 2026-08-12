import React, { useState, useEffect } from 'react';
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { FaCommentDots, FaUser } from "react-icons/fa";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { PostData, UserDetailData } from '../types';
import { getUserDetail } from '../services/userService';
import { likePost, unlikePost, savePost, unsavePost } from '../services/postService';

interface PostCardProps extends PostData {
  currentUserId?: number;
}

const PostCard: React.FC<PostCardProps> = ({
  ID = 0,
  UserID,
  Title,
  Description,
  LikeCount = 0,
  Comments,
  CreatedAt,
  IsLiked = false,
  IsSaved = false,
  currentUserId,
}) => {
  const navigate = useNavigate();
  const [postUserdata, setPostUserdata] = useState<UserDetailData>();

  const [likeCountState, setLikeCountState] = useState<number>(LikeCount);
  const [isLiked, setIsLiked] = useState<boolean>(Boolean(IsLiked));
  const [isSaved, setIsSaved] = useState<boolean>(Boolean(IsSaved));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setLikeCountState(LikeCount);
  }, [LikeCount]);

  useEffect(() => {
    setIsLiked(Boolean(IsLiked));
  }, [IsLiked]);

  useEffect(() => {
    setIsSaved(Boolean(IsSaved));
  }, [IsSaved]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getUserDetail(UserID);
        setPostUserdata(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    if (UserID) {
      fetchData();
    }
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
    if (!text) return '';
    if (text.length <= 160) return text;
    return text.substring(0, 160).trim() + "...";
  };

  const handleLikeToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    const previousLiked = isLiked;
    const previousCount = likeCountState;

    if (isLiked) {
      setIsLiked(false);
      setLikeCountState(prev => Math.max(0, prev - 1));
    } else {
      setIsLiked(true);
      setLikeCountState(prev => prev + 1);
    }

    try {
      const payload = { user_id: currentUserId };
      if (previousLiked) {
        await unlikePost(payload, Number(ID));
      } else {
        await likePost(payload, Number(ID));
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      setIsLiked(previousLiked);
      setLikeCountState(previousCount);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLiked) {
      handleLikeToggle(e);
    }
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading || !currentUserId || !ID) return;

    setIsLoading(true);
    const previousSaved = isSaved;

    setIsSaved(!previousSaved);

    try {
      const payload = { user_id: currentUserId };
      if (previousSaved) {
        await unsavePost(payload, Number(ID));
      } else {
        await savePost(payload, Number(ID));
      }
    } catch (error) {
      console.error('Error updating save status:', error);
      setIsSaved(previousSaved);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-sm flex flex-col gap-3 hover:border-slate-300 cursor-pointer transition-all duration-200" 
      onClick={() => navigate(`/post/${ID}`)}
    >
      <div className="flex items-center gap-2">
        {postUserdata?.ProfilePicture ? (
          <img
            className="h-8 w-8 object-cover rounded-full bg-slate-100 ring-1 ring-slate-200"
            src={postUserdata.ProfilePicture}
            alt="profile"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center text-slate-400 shrink-0">
            <FaUser className="text-sm" />
          </div>
        )}
        <Link 
          to={`/profile/${UserID}`}
          onClick={(e) => e.stopPropagation()}
          className='text-slate-800 text-sm font-bold hover:underline tracking-tight'
        >
          {postUserdata?.Username || 'User'}
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
              onClick={handleLikeToggle}
              disabled={isLoading}
              title={isLiked ? "Unlike post" : "Like post"}
              className={`p-1.5 rounded-lg transition-colors ${
                isLiked 
                  ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' 
                  : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60'
              }`}
            >
              <BiSolidLike className="text-lg" />
            </button>
            <span className={`px-1 font-bold text-xs ${isLiked ? 'text-indigo-600' : 'text-slate-700'}`}>
              {likeCountState}
            </span>
            <button 
              onClick={handleUnlike}
              disabled={isLoading}
              className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200/60 transition-colors"
            >
              <BiSolidDislike className="text-lg" />
            </button>
          </div>

          <div className="bg-slate-100 border border-slate-200/40 px-3 py-1.5 rounded-xl flex items-center gap-2 text-slate-600 hover:bg-slate-200/60 transition-colors">
            <FaCommentDots className="text-base text-slate-400" />
            <span className="text-xs font-bold text-slate-700">{Comments || 0}</span>
          </div>
        </div>

        <button 
          onClick={handleSaveToggle}
          disabled={isLoading}
          title={isSaved ? "Remove from saved" : "Save post"}
          className={`p-2 rounded-xl transition-colors ${
            isSaved 
              ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' 
              : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100'
          }`}
        >
          {isSaved ? (
            <MdBookmark className="text-xl" />
          ) : (
            <MdBookmarkBorder className="text-xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PostCard;