import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import PostCustomDropdown from './PostCustomDropdown';
import { createPost } from '../services/postService';
import useAuthStore from '../store/authStore';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

enum PostTypeOption {
  Text = "text",
  Media = "media",
  Poll = "poll",
  AMA = "ama",
}

interface FormData {
  user_id: number | null;
  title: string;
  description: string;
  community_id: number | null | undefined;
}

const PostSubmitForm: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { slug } = useParams();

  const [option, setOption] = useState<PostTypeOption>(PostTypeOption.Text);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [postData, setPostData] = useState<FormData>({
    user_id: Number(user?.id),
    title: "",
    description: "",
    community_id: selectedCommunity
  });

  useEffect(() => {
    setPostData((prev) => ({
      ...prev,
      community_id: selectedCommunity
    }));
  }, [selectedCommunity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postData.title.trim()) return;
    
    try {
      setIsSubmitting(true);
      await createPost(postData);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden transition-all transform scale-100 flex flex-col'>
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Buat Postingan
        </h1>
        <Link to="/" className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <IoClose className="text-2xl" />
        </Link>
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div className="w-full max-w-xs">
          <PostCustomDropdown 
            current_slug={slug || null} 
            setSelectedCommunity={setSelectedCommunity}
          />
        </div>

        <div className="flex border-b border-slate-100 gap-1 overflow-x-auto scrollbar-none">
          {(Object.keys(PostTypeOption) as Array<keyof typeof PostTypeOption>).map((key) => {
            const value = PostTypeOption[key];
            const labels: Record<PostTypeOption, string> = {
              [PostTypeOption.Text]: "Teks",
              [PostTypeOption.Media]: "Gambar & Video",
              [PostTypeOption.Poll]: "Poll",
              [PostTypeOption.AMA]: "AMA",
            };

            return (
              <button
                key={value}
                type="button"
                onClick={() => setOption(value)}
                className={`pb-3 px-4 text-sm font-semibold tracking-tight border-b-2 transition-all whitespace-nowrap ${
                  option === value
                    ? "border-indigo-600 text-indigo-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
                }`}
              >
                {labels[value]}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className="flex flex-col gap-1.5">
            <input 
              type="text" 
              placeholder='Judul postingan' 
              name='title'
              required
              className='w-full px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm'
              value={postData.title}
              onChange={handleInputChange}
            />
          </div>

          {option === PostTypeOption.Text && (
            <div className="flex flex-col gap-1.5">
              <textarea 
                rows={6} 
                name="description" 
                placeholder='Tulis deskripsi atau isi postingan Anda di sini...' 
                className='w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm resize-none' 
                value={postData.description}
                onChange={handleInputChange}
              />
            </div>
          )}

          {option === PostTypeOption.Media && (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
              <p className="text-sm font-medium text-slate-400">Fitur unggah gambar & video belum tersedia.</p>
            </div>
          )}

          {option === PostTypeOption.Poll && (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
              <p className="text-sm font-medium text-slate-400">Fitur pembuatan polling belum tersedia.</p>
            </div>
          )}

          {option === PostTypeOption.AMA && (
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
              <p className="text-sm font-medium text-slate-400">Fitur sesi tanya jawab (AMA) belum tersedia.</p>
            </div>
          )}

          <div className="pt-2 flex justify-end border-t border-slate-100 mt-2">
            <button 
              className='bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all text-sm' 
              type='submit'
              disabled={isSubmitting || !postData.title.trim()}
            >
              {isSubmitting ? "Mengunggah..." : "Unggah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostSubmitForm;