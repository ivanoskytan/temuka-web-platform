import React, { useState, useEffect } from 'react';
import Leftbar from '../components/Leftbar';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import { getFileStorage } from '../services/index';
import { getUserDetail, updateUser } from '../services/userService';
import { UserDetailData } from '../types';
import { uploadFile } from '../services/fileService';
import { FaCamera, FaSpinner, FaUser, FaPen, FaCalendarDays, FaClock, FaStar } from 'react-icons/fa6';

const Settings: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const publicFolder = getFileStorage();

  const [userdata, setUserdata] = useState<UserDetailData | any>();
  const [username, setUsername] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const { data } = await getUserDetail(Number(user.id));
        setUserdata(data);
        setUsername(data?.Username || '');
        setDesc(data?.Desc || '');
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [user?.id]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;

    setIsSubmitting(true);
    const updatedPayload: UserDetailData = {
      Username: username,
      Desc: desc,
    };

    try {
      if (profilePictureFile) {
        await uploadFile(profilePictureFile);
        updatedPayload.ProfilePicture = profilePictureFile.name;
      }

      const res = await updateUser(Number(user.id), updatedPayload);
      if (res) {
        const { data } = await getUserDetail(Number(user.id));
        setUserdata(data);
        setProfilePictureFile(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProfileImageSrc = (): string | null => {
    if (previewUrl) return previewUrl;
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

  const createdAt = userdata?.CreatedAt || userdata?.created_at;
  const profileSrc = getProfileImageSrc();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="pt-20 pb-12 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-8 items-start">
        <Leftbar />

        <main className="w-full flex justify-center md:justify-start">
          <div className="flex flex-col gap-6 w-full max-w-3xl">
            
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative group w-28 h-28 shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 shadow-xs ring-1 ring-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
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

                <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1">
                  <FaCamera className="text-lg" />
                  <span className="text-[10px] font-semibold">Ubah</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handlePhotoChange} 
                  />
                </label>
              </div>

              <div className="flex flex-col text-center sm:text-left gap-2 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                      {userdata?.Username || 'Pengguna'}
                    </h1>
                    <p className="text-xs font-medium text-slate-400">
                      {userdata?.Email || user?.email || 'Email tidak tersedia'}
                    </p>
                  </div>

                  {userdata?.SocialPoint !== undefined && (
                    <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-amber-700 text-xs font-bold w-fit self-center sm:self-auto">
                      <FaStar className="text-amber-500 text-xs" />
                      <span>{userdata.SocialPoint} Poin</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-500">
                    <FaCalendarDays className="text-indigo-500 text-sm shrink-0" />
                    <span>Bergabung: <strong className="text-slate-800 font-semibold">{formatDate(createdAt)}</strong></span>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-medium text-slate-500">
                    <FaClock className="text-indigo-500 text-sm shrink-0" />
                    <span>Lama Bergabung: <strong className="text-slate-800 font-semibold">{getTenure(createdAt)}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs w-full">
              <h2 className="text-lg font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-4 mb-6">
                Pengaturan Profil
              </h2>

              <form onSubmit={handleUpdate} className="space-y-6">
                {profilePictureFile && (
                  <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <span>Foto profil baru dipilih tetapi belum disimpan.</span>
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePictureFile(null);
                        setPreviewUrl('');
                      }}
                      className="text-amber-800 underline hover:no-underline font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider" htmlFor="username">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-sm"
                      value={username}
                      placeholder={userdata?.Username || "Masukkan username baru"}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase text-slate-400 tracking-wider" htmlFor="description">
                      Deskripsi Diri
                    </label>
                    <textarea
                      id="description"
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs resize-none text-sm"
                      value={desc}
                      placeholder={userdata?.Desc || "Tulis deskripsi singkat profil Anda..."}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-2xs transition-all flex items-center gap-2 text-xs md:text-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin text-sm" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <FaPen className="text-xs" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;