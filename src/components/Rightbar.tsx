import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import RecommendationSection from './RecommendationSection';
import { 
  FaChevronDown, 
  FaGraduationCap, 
  FaBookOpen, 
  FaNewspaper, 
  FaHatCowboy, 
  FaUser, 
  FaXmark, 
  FaCheck, 
  FaLock 
} from "react-icons/fa6";
import { SuggestionItemData } from '../types';
import { 
  getPostRecommendations, 
  getMajorRecommendations, 
  getUniversityRecommendations 
} from '../services/recommendationService';
import { getUserDetail } from '../services/userService';
import useAuthStore from '../store/authStore';

export interface IdentityOption {
  isAnonymous: boolean;
  label: string;
  sublabel: string;
  universityOrigin?: string;
}

const Rightbar: React.FC = () => {
  const { user } = useAuthStore();

  const [userDisplayName, setUserDisplayName] = useState<string>('Pengguna');
  const [userUniversityName, setUserUniversityName] = useState<string | null>(null);

  const [activeIdentity, setActiveIdentity] = useState<IdentityOption>({
    isAnonymous: false,
    label: user?.email ? user.email.split('@')[0] : 'Pengguna',
    sublabel: 'Nama dan profil publik Anda akan terlihat',
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [posts, setPosts] = useState<SuggestionItemData[]>([]);
  const [majors, setMajors] = useState<SuggestionItemData[]>([]);
  const [universities, setUniversities] = useState<SuggestionItemData[]>([]);

  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [loadingMajors, setLoadingMajors] = useState<boolean>(true);
  const [loadingUniversities, setLoadingUniversities] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUserData = async () => {
      try {
        const res = await getUserDetail(user.id as number);
        const userData = res?.data || res;

        const name = userData?.Username || 'Pengguna';
        const uniName = userData?.University?.Name || null;

        setUserDisplayName(name);
        setUserUniversityName(uniName);

        if (uniName) {
          setActiveIdentity({
            isAnonymous: true,
            label: `Mahasiswa ${uniName}`,
            sublabel: 'Nama dan profil disembunyikan, hanya institusi yang muncul',
            universityOrigin: uniName,
          });
        } else {
          setActiveIdentity({
            isAnonymous: false,
            label: name,
            sublabel: 'Nama dan profil publik Anda akan terlihat',
          });
        }
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      }
    };

    fetchUserData();
  }, [user?.id, user?.email]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingPosts(true);
        const res = await getPostRecommendations();
        setPosts(res?.data?.Items || []);
      } catch (err) {
        console.error('Failed to fetch post recommendations:', err);
      } finally {
        setLoadingPosts(false);
      }

      try {
        setLoadingMajors(true);
        const res = await getMajorRecommendations();
        setMajors(res?.data?.Items || []);
      } catch (err) {
        console.error('Failed to fetch major recommendations:', err);
      } finally {
        setLoadingMajors(false);
      }

      try {
        setLoadingUniversities(true);
        const res = await getUniversityRecommendations();
        setUniversities(res?.data?.Items || []);
      } catch (err) {
        console.error('Failed to fetch university recommendations:', err);
      } finally {
        setLoadingUniversities(false);
      }
    };

    fetchRecommendations();
  }, []);

  const realIdentity: IdentityOption = {
    isAnonymous: false,
    label: userDisplayName,
    sublabel: 'Nama dan profil publik Anda akan terlihat',
  };

  const anonymousIdentity: IdentityOption = {
    isAnonymous: true,
    label: userUniversityName ? `Mahasiswa ${userUniversityName}` : 'Anonim',
    sublabel: 'Nama dan profil disembunyikan, hanya institusi yang muncul',
    universityOrigin: userUniversityName || undefined,
  };

  const isEligibleForAnon = Boolean(userUniversityName);

  return (
    <div className="hidden lg:flex flex-col gap-5 w-full sticky top-22 py-6">
      <div 
        onClick={() => setIsModalOpen(true)}
        className="flex justify-between items-center gap-3 bg-white border border-slate-200/80 shadow-xs p-4 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all active:scale-[0.99]"
      >
        <div className="flex gap-3 items-center min-w-0">
          <div className={`p-2.5 rounded-xl border shrink-0 ${
            activeIdentity.isAnonymous 
              ? 'bg-indigo-50 text-indigo-600 border-indigo-100/50' 
              : 'bg-slate-100 text-slate-600 border-slate-200/60'
          }`}>
            {activeIdentity.isAnonymous ? (
              <FaHatCowboy className="text-2xl" />
            ) : (
              <FaUser className="text-xl" />
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
              Identitas Pembuat Post
            </span>
            <p className="font-semibold text-sm text-slate-800 truncate">
              {activeIdentity.label}
            </p>
          </div>
        </div>
        <FaChevronDown className="text-slate-400 text-xs shrink-0 ml-1" />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white border border-slate-200/80 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">Pilih Identitas Pembuat Post</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <FaXmark className="text-lg" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div
                onClick={() => {
                  setActiveIdentity(realIdentity);
                  setIsModalOpen(false);
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  !activeIdentity.isAnonymous 
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl shrink-0">
                    <FaUser className="text-lg" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-slate-800 truncate">
                      {realIdentity.label}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {realIdentity.sublabel}
                    </span>
                  </div>
                </div>
                {!activeIdentity.isAnonymous && (
                  <FaCheck className="text-indigo-600 text-sm shrink-0" />
                )}
              </div>

              <div
                onClick={() => {
                  if (isEligibleForAnon) {
                    setActiveIdentity(anonymousIdentity);
                    setIsModalOpen(false);
                  }
                }}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  !isEligibleForAnon
                    ? 'border-slate-100 bg-slate-50/60 opacity-60 cursor-not-allowed'
                    : activeIdentity.isAnonymous
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs cursor-pointer'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50 shrink-0">
                    <FaHatCowboy className="text-lg" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-800 truncate">
                        {isEligibleForAnon ? anonymousIdentity.label : 'Anonim (Khusus Mahasiswa)'}
                      </span>
                      {!isEligibleForAnon && <FaLock className="text-slate-400 text-xs shrink-0" />}
                    </div>
                    <span className="text-xs text-slate-500 truncate">
                      {isEligibleForAnon
                        ? anonymousIdentity.sublabel
                        : 'Gunakan email kampus untuk membuka fitur anonim'}
                    </span>
                  </div>
                </div>
                {activeIdentity.isAnonymous && (
                  <FaCheck className="text-indigo-600 text-sm shrink-0" />
                )}
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-500 leading-normal">
                Pilihan ini akan menentukan bagaimana nama Anda ditampilkan pada postingan yang akan dibuat.
              </p>
            </div>
          </div>
        </div>
      )}

      <CreatePost activeIdentity={activeIdentity} />

      <RecommendationSection
        title="Rekomendasi Post"
        icon={<FaNewspaper />}
        items={posts}
        loading={loadingPosts}
        emptyText="Tidak ada rekomendasi post saat ini."
        getItemLink={(item) => item.Slug ? `/posts/${item.Slug}` : `/posts/${item.ID}`}
      />

      <RecommendationSection
        title="Rekomendasi Jurusan"
        icon={<FaBookOpen />}
        items={majors}
        loading={loadingMajors}
        emptyText="Tidak ada rekomendasi jurusan saat ini."
        getItemLink={(item) => item.Slug ? `/majors/${item.Slug}` : `/majors/${item.ID}`}
      />

      <RecommendationSection
        title="Rekomendasi Universitas"
        icon={<FaGraduationCap />}
        items={universities}
        loading={loadingUniversities}
        emptyText="Tidak ada rekomendasi universitas saat ini."
        getItemLink={(item) => item.Slug ? `/universities/${item.Slug}` : `/universities/${item.ID}`}
      />
    </div>
  );
};

export default Rightbar;