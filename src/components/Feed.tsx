import React, { useEffect, useState } from 'react';
import { PostData } from '../types';
import { getTimelinePosts } from '../services/postService';
import useAuthStore from '../store/authStore';
import PostCard from './PostCard';

const DUMMY_POSTS: PostData[] = [
  {
    ID: "post-1",
    UserID: 101,
    Title: "Panduan Lengkap Memulai Belajar React dengan TypeScript di Tahun 2026",
    Description: "TypeScript memberikan keamanan tipe data yang membuat pengembangan aplikasi skala besar menjadi jauh lebih terstruktur dan minim bug. Dalam tulisan ini, kita akan membahas konfigurasi tsconfig, penulisan strict props, penggunaan generic components, hingga manajemen state menggunakan Zustand secara efisien.",
    Image: "",
    Upvote: ["user-1", "user-2", "user-3"],
    Comments: 14,
    CreatedAt: new Date(Date.now() - 1000 * 60 * 45),
    UpdatedAt: new Date(Date.now() - 1000 * 60 * 45)
  },
  {
    ID: "post-2",
    UserID: 102,
    Title: "Mengapa Desain Minimalis Semakin Populer di Aplikasi Mobile?",
    Description: "Desain minimalis bukan sekadar tren visual, melainkan sebuah pendekatan fungsional untuk mengurangi beban kognitif pengguna. Dengan memanfaatkan ruang putih (white space) yang optimal, tipografi kontras, dan eliminasi elemen dekoratif yang tidak penting, pengguna dapat menyelesaikan alur tugas utama secara lebih natural.",
    Image: "",
    Upvote: ["user-4"],
    Comments: 3,
    CreatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
    UpdatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4)
  }
];

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getTimelinePosts(Number(user?.id));
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(DUMMY_POSTS);
        }
      } catch (err) {
        console.error(err);
        setPosts(DUMMY_POSTS);
      }
    };
    fetchData();
  }, [user?.id]);

  return (
    <div className='w-full bg-slate-50 min-h-screen px-4 py-6 max-w-3xl mx-auto flex flex-col gap-4'>
      {posts?.map((p) => (
        <PostCard
          key={p.ID || Math.random().toString()}
          ID={p.ID || ""}
          UserID={p.UserID}
          Title={p.Title}
          Description={p.Description}
          Image={p?.Image || ""}
          Upvote={p.Upvote || []}
          Comments={p?.Comments}
          CreatedAt={p.CreatedAt || new Date()}
          UpdatedAt={p.UpdatedAt || new Date()}
        />
      ))}
    </div>
  );
};

export default Feed;