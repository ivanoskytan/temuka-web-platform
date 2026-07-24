import React, { useEffect, useState } from "react";
import { RiTeamLine } from "react-icons/ri";
import { GrNotes } from "react-icons/gr";
import { TbMessageCircleQuestion } from "react-icons/tb";
import { FaChevronDown, FaPlus, FaCheck, FaXmark } from "react-icons/fa6";
import { getCommunityDetail, joinCommunity, getCommunityPosts, getUserJoinedCommunities } from "../services/communityService";
import { CommunityData, PostData } from "../types";
import useAuthStore from "../store/authStore";
import { useNavigate, useParams } from "react-router-dom";
import PostCard from "../components/PostCard"; 

const Community: React.FC = () => {
  const [communityDetail, setCommunityDetail] = useState<CommunityData>();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const fetchCommunityAndPosts = async () => {
      if (!slug) return;
      
      try {
        setLoadingPosts(true);
        
        const communityRes = await getCommunityDetail(String(slug));
        const communityData = communityRes.data?.data || communityRes.data;
        setCommunityDetail(communityData);

        const targetCommunityId = communityData?.ID || communityData?.id;

        if (user?.id && targetCommunityId) {
          try {
            const { data } = await getUserJoinedCommunities({ user_id: user?.id });
            const alreadyJoined = data.some(
              (item: any) => (item.ID === targetCommunityId)
            );
            setIsJoined(alreadyJoined);
          } catch (err) {
            console.error("Error fetching joined communities:", err);
          }
        }
        
        if (targetCommunityId) {
          const postsRes = await getCommunityPosts(targetCommunityId);
          const rawPostsList = postsRes.data?.data || postsRes.data || [];

          const formattedPosts: PostData[] = rawPostsList.map((item: any) => ({
            ID: item.post_id || item.id || item.ID,
            UserID: item.user_id,
            Title: item.title,
            Description: item.description || "",
            Image: item.image || "",
            Upvote: Array(item.upvote_count || 0).fill(""),
            Comments: item.comment_count || 0,
            CreatedAt: new Date(item.created_at),
            UpdatedAt: new Date(item.created_at),
          }));

          setPosts(formattedPosts);
        }
      } catch (err) {
        console.error("Error fetching community or posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchCommunityAndPosts();
  }, [slug, user?.id]);

  const handleJoin = async () => {
    if (!communityDetail?.ID || isJoining) return;

    try {
      setIsJoining(true);
      const payload = { user_id: user?.id };
      await joinCommunity(payload, communityDetail.ID);
      setCommunityDetail((prev) => prev ? {...prev, MemberCount: (prev.MemberCount || 0) + 1} : prev);
      setShowJoinModal(true);
      setIsJoined(true);
    } catch (err) {
      console.error("Gagal bergabung ke komunitas: ", err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-modal-backdrop">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center gap-4 relative animate-modal-card">
            <button 
              onClick={() => setShowJoinModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full transition-colors"
            >
              <FaXmark className="text-base" />
            </button>

            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl shadow-inner">
              <FaCheck />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-slate-900">Berhasil Bergabung!</h3>
              <p className="text-sm text-slate-500 font-medium">
                Selamat! Kamu telah menjadi bagian dari <span className="font-semibold text-slate-700">{communityDetail?.Name}</span>.
              </p>
            </div>

            <button
              onClick={() => setShowJoinModal(false)}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-indigo-100 text-sm"
            >
              Mulai Eksplorasi
            </button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden w-full">
        <div className="relative h-48 md:h-60 w-full bg-gradient-to-r from-indigo-500 to-violet-600">
          {communityDetail?.CoverPicture && (
            <img 
              src={communityDetail.CoverPicture} 
              alt="" 
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )}
          
          <div className="absolute -bottom-10 left-6 p-1.5 bg-white rounded-3xl shadow-md border border-slate-100">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden font-bold text-2xl text-indigo-600 border border-slate-100">
              {communityDetail?.LogoPicture ? (
                <img
                  className="h-full w-full object-cover"
                  src={communityDetail.LogoPicture}
                  alt="Community logo"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                communityDetail?.Name?.charAt(0)
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-14 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">
              {communityDetail?.Name}
            </h1>
            <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-wide">
              c/{slug}
            </p>
          </div>
          
          <div className="flex gap-2.5 shrink-0">
            <button 
              onClick={handleJoin}
              disabled={isJoining}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 active:scale-[0.97] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-indigo-100 transition-all duration-150 flex items-center gap-2"
            >
            {isJoining ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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
            <button 
              onClick={() => navigate(`/community/${slug}/submit`)}
              className="bg-amber-500 hover:bg-amber-400 active:scale-[0.97] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm shadow-amber-100 transition-all duration-150 flex items-center gap-1.5"
            >
              <FaPlus className="text-xs" /> Buat Post
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 w-full items-start">
        <div className="flex flex-col gap-4 w-full">
          {loadingPosts ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-400 text-sm font-medium">
              Memuat postingan...
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.ID} {...post} />
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 text-center text-slate-500 text-sm font-medium">
              Belum ada postingan di komunitas ini. Jadilah yang pertama membuat post!
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-5 w-full sticky top-22">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Deskripsi</h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed mt-2">
                {communityDetail?.Description || "Tidak ada deskripsi untuk komunitas ini."}
              </p>
            </div>

            <div className="flex gap-6 py-3 border-y border-slate-100 my-1">
              <div className="flex flex-col">
                <span className="font-bold text-base text-slate-800 leading-none">
                  {(communityDetail?.MemberCount || 0).toLocaleString('id-ID')}
                </span>
                <span className="text-[11px] font-medium text-slate-400 mt-1">Pengikut</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base text-slate-800 leading-none">
                  {(posts.length || communityDetail?.PostCount || 0).toLocaleString('id-ID')}
                </span>
                <span className="text-[11px] font-medium text-slate-400 mt-1">Post</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span>0 Anggota sedang aktif</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight pb-1">Resources</h3>
            
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer items-center text-slate-700 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex gap-2.5 items-center text-sm font-semibold">
                  <GrNotes className="text-slate-400 text-sm" />
                  <span>Peraturan</span>
                </div>
                <FaChevronDown className="text-slate-400 text-xs" />
              </div>
              
              <div className="flex justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer items-center text-slate-700 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex gap-2.5 items-center text-sm font-semibold">
                  <RiTeamLine className="text-slate-400 text-base" />
                  <span>Moderator</span>
                </div>
                <FaChevronDown className="text-slate-400 text-xs" />
              </div>
              
              <div className="flex justify-between p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer items-center text-slate-700 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex gap-2.5 items-center text-sm font-semibold">
                  <TbMessageCircleQuestion className="text-slate-400 text-base" />
                  <span>FAQ</span>
                </div>
                <FaChevronDown className="text-slate-400 text-xs" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;