import React, { useState, useEffect } from 'react';
import PostCustomDropdown from './PostCustomDropdown';
import { createPost } from '../services/postService';
import { getCommunityDetail } from '../services/communityService';
import useAuthStore from '../store/authStore';
import { useNavigate, useParams, useLocation } from 'react-router';
import { FaArrowLeft, FaHatCowboy, FaUser } from 'react-icons/fa6';

enum PostTypeOption {
  Text = "text",
  Media = "media",
  Poll = "poll",
  AMA = "ama",
}

export interface IdentityOption {
  isAnonymous: boolean;
  label: string;
  sublabel: string;
  universityOrigin?: string;
}

const PostSubmitForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { slug } = useParams();

  const passedIdentity = (location.state as { activeIdentity?: IdentityOption })?.activeIdentity;

  const [activeIdentity] = useState<IdentityOption>(
    passedIdentity || {
      isAnonymous: false,
      label: user?.email ? user.email.split('@')[0] : 'Pengguna',
      sublabel: 'Nama dan profil publik Anda akan terlihat',
    }
  );

  const [option, setOption] = useState<PostTypeOption>(PostTypeOption.Text);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
  const [communityName, setCommunityName] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchCommunityInfo = async () => {
      try {
        const res = await getCommunityDetail(slug);
        if (res?.data) {
          setCommunityName(res.data.Name);
          setSelectedCommunity(res.data.ID);
        }
      } catch (err) {
        console.error("Failed to fetch community detail:", err);
      }
    };

    fetchCommunityInfo();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      user_id: user?.id ? Number(user.id) : null,
      title: title.trim(),
      description: description.trim(),
      community_id: selectedCommunity,
      is_anonymous: activeIdentity.isAnonymous,
      university_origin: activeIdentity.universityOrigin || null,
    };

    try {
      setIsSubmitting(true);
      await createPost(payload);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl">
      <div className="flex items-center gap-3">
        <button 
          type="button"
          onClick={() => navigate(-1)} 
          className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-2xs group shrink-0 cursor-pointer"
          title="Kembali"
        >
          <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          {slug && communityName ? (
            <>
              <span>Komunitas</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-slate-600 truncate max-w-[150px]">{communityName}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
            </>
          ) : (
            <>
              <span>Feed</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
            </>
          )}
          <span className="text-indigo-600">Buat Postingan</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs w-full overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Buat Postingan Baru
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-400 mt-1">
              Bagikan pemikiran, pertanyaan, atau diskusi dengan anggota komunitas.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl shrink-0">
            {activeIdentity.isAnonymous ? (
              <FaHatCowboy className="text-indigo-600 text-sm" />
            ) : (
              <FaUser className="text-slate-500 text-xs" />
            )}
            <span className="text-xs font-semibold text-slate-700">
              {activeIdentity.label}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6">
          <div className="w-full max-w-xs">
            <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">
              Pilih Komunitas
            </label>
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
                  className={`pb-3 px-4 text-xs md:text-sm font-semibold tracking-tight border-b-2 transition-all whitespace-nowrap cursor-pointer ${
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

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Judul Postingan
              </label>
              <input 
                type="text" 
                placeholder="Tulis judul postingan yang jelas..." 
                name="title"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {option === PostTypeOption.Text && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Konten / Deskripsi
                </label>
                <textarea 
                  rows={8} 
                  name="description" 
                  placeholder="Tulis deskripsi atau isi postingan Anda di sini..." 
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs resize-none text-sm" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}

            {option === PostTypeOption.Media && (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50">
                <p className="text-xs md:text-sm font-medium text-slate-400">Fitur unggah gambar & video belum tersedia.</p>
              </div>
            )}

            {option === PostTypeOption.Poll && (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50">
                <p className="text-xs md:text-sm font-medium text-slate-400">Fitur pembuatan polling belum tersedia.</p>
              </div>
            )}

            {option === PostTypeOption.AMA && (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center bg-slate-50">
                <p className="text-xs md:text-sm font-medium text-slate-400">Fitur sesi tanya jawab (AMA) belum tersedia.</p>
              </div>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs md:text-sm transition-all cursor-pointer"
              >
                Batal
              </button>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-2xs transition-all text-xs md:text-sm cursor-pointer disabled:cursor-not-allowed" 
                type="submit"
                disabled={isSubmitting || !title.trim()}
              >
                {isSubmitting ? "Mengunggah..." : "Unggah Postingan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostSubmitForm;