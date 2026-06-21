import React, { useEffect, useState } from 'react';
import Leftbar from '../components/Leftbar';
import Navbar from '../components/Navbar';
import { PostData, PostCommentData } from '../types';
import { useNavigate, useParams } from 'react-router';
import { getPostDetail } from '../services/postService';
import { FaCircleChevronLeft } from "react-icons/fa6";
import { BiSolidDownvote, BiSolidUpvote } from 'react-icons/bi';
import { FaComment } from "react-icons/fa";
import useAuthStore from '../store/authStore';
import { addComment } from '../services/commentService';

interface UserData {
  Username: string;
  ProfilePicture: string;
}

interface PostDetail {
  user: UserData;
  post: PostData;
  comments: PostCommentData[];
}

interface CommentAddData {
  user_id: number | null;
  parent_id: number | null;
  post_id: number | string;
  content: string;
}

const Post: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [postData, setPostData] = useState<PostDetail>();
  const [content, setContent] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const fetchPostData = async () => {
    if (!id) return;
    try {
      const { data } = await getPostDetail(Number(id));
      setPostData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !postData?.post.ID) return;

    const payload: CommentAddData = {
      user_id: user?.id ? Number(user.id) : null,
      post_id: postData.post.ID,
      parent_id: null,
      content: content.trim(),
    };

    try {
      await addComment(payload);
      setContent("");
      setIsFocused(false);
      await fetchPostData();
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />

        <main className="w-full py-6 flex gap-4 items-start">
          <button 
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-indigo-600 transition-colors pt-1 backend-nav-btn"
          >
            <FaCircleChevronLeft className="w-8 h-8" />
          </button>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex-1 max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <img
                className="h-8 w-8 object-cover rounded-full ring-1 ring-slate-200 bg-slate-100"
                src={postData?.user.ProfilePicture || "/assets/DefaultUser.png"}
                alt="profile"
              />
              <span className="text-sm font-bold text-slate-800 tracking-tight">
                {postData?.user.Username || "Memuat..."}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-3">
              {postData?.post.Title}
            </h2>
            
            <p className="text-slate-700 font-medium text-sm leading-relaxed mb-6">
              {postData?.post.Description}
            </p>

            <div className="flex items-center bg-slate-100 rounded-xl px-1 py-0.5 border border-slate-200/40 w-max mb-8">
              <button className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200/60 transition-colors">
                <BiSolidUpvote className="text-lg" />
              </button>
              <span className="px-1 text-slate-700 font-bold text-xs">
                {Array.isArray(postData?.post.Upvote) ? postData?.post.Upvote.length : 0}
              </span>
              <button className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-200/60 transition-colors">
                <BiSolidDownvote className="text-lg" />
              </button>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">
                Komentar
              </h3>

              {isFocused ? (
                <form onSubmit={handleAddComment} className="flex flex-col border border-slate-200 rounded-xl p-3 bg-slate-50 gap-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                  <textarea
                    name="content"
                    rows={3}
                    placeholder="Tulis komentar Anda..."
                    className="w-full bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400 font-medium resize-none"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />                                
                  <div className="flex justify-end gap-2 border-t border-slate-200/60 pt-2">
                    <button 
                      type="button" 
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200/60 transition-colors" 
                      onClick={() => { setIsFocused(false); setContent(""); }}
                    >
                      Batalkan
                    </button>
                    <button 
                      type="submit" 
                      disabled={!content.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 px-4 py-1.5 rounded-lg text-white text-xs font-bold transition-colors shadow-sm"
                    >
                      Komen
                    </button>
                  </div>
                </form>
              ) : (
                <input 
                  type="text" 
                  placeholder="Tambahkan komentar fungsional..." 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-all shadow-sm" 
                  onClick={() => setIsFocused(true)}
                />
              )}

              <div className="flex flex-col gap-6 mt-4">
                {postData?.comments?.map((comment, index) => (
                  <div key={comment.ID || index} className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/assets/DefaultUser.png" 
                        alt="Komentator" 
                        className="w-6 h-6 rounded-full ring-1 ring-slate-200"
                      />
                      <span className="text-xs font-bold text-slate-800 tracking-tight">
                        {comment.Username}
                      </span>
                      <span className="text-slate-400 text-xs font-medium">
                        • {getTimeAgo(comment.CreatedAt)}
                      </span>
                    </div>
                    
                    <div className="pl-8 flex flex-col gap-2">
                      <p className="text-slate-700 text-sm font-medium leading-relaxed">
                        {comment.Content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-slate-500">
                        <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200/40">
                          <button className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors">
                            <BiSolidUpvote className="text-sm" />
                          </button>
                          <span className="px-1 text-slate-700 font-bold text-[11px]">
                            {comment.Votes || 0}
                          </span>
                          <button className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors">
                            <BiSolidDownvote className="text-sm" />
                          </button>
                        </div>
                        
                        <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                          <FaComment className="text-xs" />
                          <span>Balas</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Post;