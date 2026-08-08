import React, { useEffect, useState } from 'react';
import CreatePost from './CreatePost';
import RecommendationSection from './RecommendationSection';
import { FaChevronDown, FaGraduationCap, FaBookOpen, FaNewspaper, FaHatCowboy } from "react-icons/fa6";
import { SuggestionItemData } from '../types';
import { 
  getPostRecommendations, 
  getMajorRecommendations, 
  getUniversityRecommendations 
} from '../services/recommendationService';

const Rightbar: React.FC = () => {
  const [posts, setPosts] = useState<SuggestionItemData[]>([]);
  const [majors, setMajors] = useState<SuggestionItemData[]>([]);
  const [universities, setUniversities] = useState<SuggestionItemData[]>([]);

  const [loadingPosts, setLoadingPosts] = useState<boolean>(true);
  const [loadingMajors, setLoadingMajors] = useState<boolean>(true);
  const [loadingUniversities, setLoadingUniversities] = useState<boolean>(true);

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

      // Fetch Major Recommendations
      try {
        setLoadingMajors(true);
        const res = await getMajorRecommendations();
        setMajors(res?.data?.Items || []);
      } catch (err) {
        console.error('Failed to fetch major recommendations:', err);
      } finally {
        setLoadingMajors(false);
      }

      // Fetch University Recommendations
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

  return (
    <div className="hidden lg:flex flex-col gap-5 w-full sticky top-22 py-6">
      <div className="flex justify-between items-center gap-3 bg-white border border-slate-200/80 shadow-sm p-4 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all active:scale-[0.99]">
        <div className="flex gap-3 items-center min-w-0">
          <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100/50 shrink-0">
            <FaHatCowboy className="text-2xl" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
              Identitas Pembuat Post
            </span>
            <p className="font-semibold text-sm text-slate-800 truncate">
              Mahasiswa Universitas Gadjah Mada
            </p>
          </div>
        </div>
        <FaChevronDown className="text-slate-400 text-xs shrink-0 ml-1" />
      </div>

      <CreatePost />

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

      {/* Recommended Universities */}
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