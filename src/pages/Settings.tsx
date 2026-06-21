import React, { useState, useEffect } from 'react';
import Leftbar from '../components/Leftbar';
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';
import { getFileStorage } from '../services/index';
import { getUserDetail, updateUser } from '../services/userService';
import { UserDetailData } from '../types';
import { uploadFile } from '../services/fileService';
import { FaCamera, FaSpinner, FaUser, FaPen } from 'react-icons/fa6';

const Settings: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const publicFolder = getFileStorage();

  const [userdata, setUserdata] = useState<UserDetailData>();
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
        const formData = new FormData();
        formData.append('file', profilePictureFile);
        await uploadFile(formData);
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

  const getProfileImageSrc = () => {
    if (previewUrl) return previewUrl;
    if (userdata?.ProfilePicture) {
      return userdata.ProfilePicture.startsWith('http') 
        ? userdata.ProfilePicture 
        : `${publicFolder}${userdata.ProfilePicture}`;
    }
    return '/assets/DefaultUser.png';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />

        <main className="w-full py-6 flex justify-center">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm max-w-2xl w-full">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-4 mb-6">
              Pengaturan Profil
            </h2>

            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="flex flex-col items-center sm:items-start gap-4">
                <label className="text-sm font-bold tracking-wide text-slate-400 uppercase">
                  Foto Profil
                </label>
                
                <div className="relative group w-32 h-32">
                  <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-md ring-1 ring-slate-200 bg-slate-100 flex items-center justify-center">
                    {getProfileImageSrc() ? (
                      <img
                        className="w-full h-full object-cover"
                        src={getProfileImageSrc()}
                        alt="Foto Profil"
                      />
                    ) : (
                      <FaUser className="text-slate-400 text-4xl" />
                    )}
                  </div>

                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer gap-1">
                    <FaCamera className="text-xl" />
                    <span className="text-[11px] font-semibold">Ubah Foto</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange} 
                    />
                  </label>
                </div>
                {profilePictureFile && (
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100/70 rounded-md px-2.5 py-1">
                    Perubahan foto belum disimpan
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold tracking-wide text-slate-700" htmlFor="username">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      type="text"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                      value={username}
                      placeholder={userdata?.Username || "Masukkan username baru"}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold tracking-wide text-slate-700" htmlFor="description">
                    Deskripsi Diri
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm resize-none"
                    value={desc}
                    placeholder={userdata?.Desc || "Tulis deskripsi singkat profil Anda..."}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin text-base" />
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
        </main>
      </div>
    </div>
  );
};

export default Settings;