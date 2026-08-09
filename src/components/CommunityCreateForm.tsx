import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaCloudArrowUp, FaUsers } from 'react-icons/fa6';
import useAuthStore from '../store/authStore';
import { createCommunity } from '../services/communityService';
import { uploadFile } from '../services/fileService';

interface RuleInput {
  title: string;
  description: string;
}

const CommunityCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoPicture, setLogoPicture] = useState('');
  const [coverPicture, setCoverPicture] = useState('');
  const [rules, setRules] = useState<RuleInput[]>([]);

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Content = reader.result as string;

      try {
        if (type === 'logo') setIsUploadingLogo(true);
        if (type === 'cover') setIsUploadingCover(true);

        const response = await uploadFile({
          file_name: file.name,
          content: base64Content,
        });

        const fileUrl = response?.url || response?.data?.url || response?.file_url;
        if (type === 'logo') setLogoPicture(fileUrl);
        if (type === 'cover') setCoverPicture(fileUrl);
      } catch (err) {
        console.error(`Failed to upload ${type}:`, err);
      } finally {
        if (type === 'logo') setIsUploadingLogo(false);
        if (type === 'cover') setIsUploadingCover(false);
      }
    };
  };

  const handleAddRule = () => {
    setRules([...rules, { title: '', description: '' }]);
  };

  const handleRuleChange = (index: number, field: keyof RuleInput, value: string) => {
    const updatedRules = [...rules];
    updatedRules[index][field] = value;
    setRules(updatedRules);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setErrorMessage('');

    const payload = {
      user_id: user?.id ? Number(user.id) : 0,
      name: name.trim(),
      description: description.trim(),
      logo_picture: logoPicture,
      cover_picture: coverPicture,
      rules: rules.filter((r) => r.title.trim() !== ''),
    };

    try {
      setIsSubmitting(true);
      const res = await createCommunity(payload);

      if (res?.error || res?.message) {
        setErrorMessage(res.error || res.message);
        return;
      }

      navigate('/');
    } catch (err: any) {
      console.error('Failed to create community:', err);
      setErrorMessage('Terjadi kesalahan saat membuat komunitas.');
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
          <span>Komunitas</span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="text-indigo-600">Buat Baru</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs w-full overflow-hidden flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Buat Komunitas Baru
            </h1>
            <p className="text-xs md:text-sm font-medium text-slate-400 mt-1">
              Bangun ruang diskusi untuk topik, minat, atau ruang kampus favorit Anda.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl shrink-0">
            <FaUsers className="text-indigo-600 text-sm" />
            <span className="text-xs font-semibold text-slate-700">Komunitas</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Nama Komunitas
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Tekno & Gadget Indonesia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
              Deskripsi Komunitas
            </label>
            <textarea
              rows={4}
              placeholder="Jelaskan mengenai tujuan, topik, atau syarat bergabung di komunitas ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs resize-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Logo Komunitas
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 relative min-h-[120px]">
                {logoPicture ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={logoPicture}
                      alt="Logo Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setLogoPicture('')}
                      className="text-xs text-red-500 hover:underline cursor-pointer font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer gap-2">
                    <FaCloudArrowUp className="text-slate-400 text-xl" />
                    <span className="text-xs font-semibold text-slate-600">
                      {isUploadingLogo ? 'Mengunggah...' : 'Unggah Logo'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'logo')}
                      disabled={isUploadingLogo}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Sampul / Banner Komunitas
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 relative min-h-[120px]">
                {coverPicture ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <img
                      src={coverPicture}
                      alt="Cover Preview"
                      className="w-full h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverPicture('')}
                      className="text-xs text-red-500 hover:underline cursor-pointer font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer gap-2">
                    <FaCloudArrowUp className="text-slate-400 text-xl" />
                    <span className="text-xs font-semibold text-slate-600">
                      {isUploadingCover ? 'Mengunggah...' : 'Unggah Banner'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'cover')}
                      disabled={isUploadingCover}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Aturan Komunitas (Opsional)
              </label>
              <button
                type="button"
                onClick={handleAddRule}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                <FaPlus className="text-[10px]" /> Tambah Aturan
              </button>
            </div>

            {rules.length === 0 ? (
              <p className="text-xs font-medium text-slate-400 bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-center">
                Belum ada aturan yang ditambahkan.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col gap-2 relative"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">
                        Aturan #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-slate-400 hover:text-red-500 text-xs cursor-pointer p-1"
                      >
                        <FaTrash />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Judul aturan (Contoh: Saling Menghormati)"
                      value={rule.title}
                      onChange={(e) => handleRuleChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 bg-white"
                    />

                    <textarea
                      rows={2}
                      placeholder="Penjelasan singkat aturan..."
                      value={rule.description}
                      onChange={(e) => handleRuleChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 bg-white resize-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs md:text-sm transition-all cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold px-6 py-2.5 rounded-xl shadow-2xs transition-all text-xs md:text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Membuat...' : 'Buat Komunitas'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityCreateForm;