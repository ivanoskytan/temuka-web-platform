import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Leftbar from '../components/Leftbar';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import CommunityCard from '../components/CommunityCard';
import useAuthStore from '../store/authStore';
import { getFileStorage } from '../services/index';
import { getUserDetail } from '../services/userService';
import { getUserPosts } from '../services/postService';
import { getUserComments } from '../services/commentService';
import { getUserJoinedCommunities } from '../services/communityService';
import { UserDetailData, PostData, CommunityData } from '../types';
import { 
  FaUser, 
  FaStar, 
  FaCalendarDays, 
  FaClock, 
  FaNewspaper, 
  FaComments, 
  FaUsers, 
  FaSpinner 
} from 'react-icons/fa6';

type TabType = 'posts' | 'comments' | 'communities';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const targetUserId = Number(id);

  const publicFolder = getFileStorage();

  const [userdata, setUserdata] = useState<UserDetailData | null>(null);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [communities, setCommunities] = useState<CommunityData[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!targetUserId) return;
      setIsLoading(true);

      try {
        const userRes = await getUserDetail(targetUserId);
        setUserdata(userRes?.data || null);

        const postsRes = await getUserPosts(targetUserId);
        setPosts(postsRes?.data || postsRes || []);

        const commentsRes = await getUserComments(targetUserId);
        setComments(commentsRes?.data || commentsRes || []);

        const commsRes = await getUserJoinedCommunities({ user_id: targetUserId });
        setCommunities(commsRes?.data || commsRes || []);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [targetUserId]);

  const getProfileImageSrc = (): string | null => {
    if (userdata?.ProfilePicture) {
      return userdata.ProfilePicture.startsWith('http')
        ? userdata.ProfilePicture
        : `${publicFolder}${userdata.ProfilePicture}`;
    }
    return null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const getTenure = (dateString?: string) => {
    if (!dateString) return '-';
    const startDate = new Date(dateString);
    if (isNaN(startDate.getTime())) return '-';

    const now = new Date();
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += previousMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} tahun`);
    if (months > 0) parts.push(`${months} bulan`);
    if (years === 0 && months === 0) parts.push(`${Math.max(1, days)} hari`);

    return parts.join(' ');
  };

  const createdAt = userdata?.CreatedAt;
  const profileSrc = getProfileImageSrc();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="pt-20 pb-12 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-8 items-start">
        <Leftbar />

        <main className="w-full flex justify-center md:justify-start">
          <div className="flex flex-col gap-6 w-full max-w-3xl">

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-28 h-28 shrink-0 rounded-full overflow-hidden border-4 border-slate-50 shadow-xs ring-1 ring-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                {profileSrc ? (
                  <img
                    className="w-full h-full object-cover"
                    src={profileSrc}
                    alt="Foto Profil"
                  />
                ) : (
                  <FaUser className="text-4xl text-slate-400" />
                )}
              </div>

              <div className="flex flex-col text-center sm:text-left gap-2 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {userdata?.Username || `Pengguna #${targetUserId}`}
                    </h1>
                    <p className="text-xs font-medium text-slate-400">
                      {userdata?.Email || 'Email tidak tersedia'}
                    </p>
                  </div>

                  {userdata?.SocialPoint !== undefined && (
                    <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-amber-700 text-xs font-bold w-fit self-center sm:self-auto">
                      <FaStar className="text-amber-500 text-xs" />
                      <span>{userdata.SocialPoint} Poin</span>
                    </div>
                  )}
                </div>

                {userdata?.Desc && (
                  <p className="text-xs text-slate-600 font-medium leading-relaxed my-1">
                    {userdata.Desc}
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-500">
                    <FaCalendarDays className="text-indigo-500 text-sm shrink-0" />
                    <span>Bergabung: <strong className="text-slate-800 font-semibold">{formatDate(String(createdAt))}</strong></span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-500">
                    <FaClock className="text-indigo-500 text-sm shrink-0" />
                    <span>Lama Bergabung: <strong className="text-slate-800 font-semibold">{getTenure(String(createdAt))}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex border-b border-slate-200 gap-1 overflow-x-auto scrollbar-none w-full">
              <button
                onClick={() => setActiveTab('posts')}
                className={`pb-3 px-4 text-sm font-bold tracking-tight border-b-2 transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'posts'
                    ? 'border-indigo-600 text-indigo-600 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <FaNewspaper className="text-sm" />
                <span>Postingan</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === 'posts'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {posts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`pb-3 px-4 text-sm font-bold tracking-tight border-b-2 transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'comments'
                    ? 'border-indigo-600 text-indigo-600 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <FaComments className="text-sm" />
                <span>Komentar</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === 'comments'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {comments.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('communities')}
                className={`pb-3 px-4 text-sm font-bold tracking-tight border-b-2 transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  activeTab === 'communities'
                    ? 'border-indigo-600 text-indigo-600 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <FaUsers className="text-sm" />
                <span>Komunitas</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeTab === 'communities'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {communities.length}
                </span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
                  <FaSpinner className="animate-spin text-2xl text-indigo-600" />
                  <span className="text-xs font-semibold">Memuat data...</span>
                </div>
              ) : (
                <>
                  {activeTab === 'posts' && (
                    posts.length > 0 ? (
                      posts.map((p) => (
                        <PostCard
                          key={p.ID || Math.random().toString()}
                          ID={p.ID || ""}
                          UserID={p.UserID}
                          Title={p.Title}
                          Description={p.Description}
                          Image={p?.Image || ""}
                          LikeCount={p.LikeCount || 0}
                          Comments={p?.Comments}
                          CreatedAt={p.CreatedAt || new Date()}
                          UpdatedAt={p.UpdatedAt || new Date()}
                          currentUserId={userdata?.ID}
                        />
                      ))
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 font-medium text-xs">
                        Belum ada postingan yang dibuat.
                      </div>
                    )
                  )}

                  {activeTab === 'comments' && (
                    comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment.ID} className="bg-white p-5 border border-slate-200/80 rounded-2xl shadow-2xs flex flex-col gap-2">
                          <div className="text-xs font-medium text-slate-400">
                            Mengomentari postingan{' '}
                            <Link to={`/post/${comment.PostID}`} className="font-bold text-indigo-600 hover:underline">
                              #{comment.PostID}
                            </Link>
                          </div>
                          <p className="text-slate-800 text-sm font-medium leading-relaxed">
                            {comment.Content || comment.Description || comment.text}
                          </p>
                          <span className="text-[10px] font-medium text-slate-400">
                            {formatDate(comment.CreatedAt || comment.created_at)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 font-medium text-xs">
                        Belum ada komentar yang ditulis.
                      </div>
                    )
                  )}

                  {activeTab === 'communities' && (
                    communities.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {communities.map((u) => (
                          <CommunityCard 
                            key={u.ID}
                            ID={u.ID}
                            Name={u.Name}
                            Slug={u.Slug}
                            Description={u.Description}
                            LogoPicture={u.LogoPicture}
                            MembersCount={u.MemberCount}
                            CoverPicture={u.CoverPicture}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400 font-medium text-xs">
                        Belum bergabung dengan komunitas manapun.
                      </div>
                    )
                  )}
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;