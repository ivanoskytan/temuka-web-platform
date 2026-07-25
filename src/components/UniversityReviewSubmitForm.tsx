import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import useAuthStore from "../store/authStore";
import { addReview } from "../services/universityService";

interface UniversityReviewSubmitForm {
    universityId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const UniversityReviewSubmitForm: React.FC<UniversityReviewSubmitForm> = ({
    universityId, onClose, onSuccess
}) => {
    const user = useAuthStore((state) => state.user);
    const [stars, setStars] = useState<number>(0);
    const [hoverStars, setHoverStars] = useState<number>(0);
    const [text, setText] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setError(null);
            
            await addReview({
                university_id: universityId,
                user_id: user?.id,
                text: text.trim(),
                stars: stars,
            });

            onClose();
            onSuccess();
        } catch (err) {
            console.error("Failed to submit review: ", err);
            setError("Gagal mengirimkan ulasan. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden transition-all transform scale-100 flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Tulis Ulasan Kampus
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <IoClose className="text-2xl" />
              </button>
            </div>
    
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-3.5 py-2.5 rounded-xl">
                  {error}
                </div>
              )}
    
              <div className="flex flex-col items-center justify-center gap-2 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Beri Rating
                </span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() => setStars(starVal)}
                      onMouseEnter={() => setHoverStars(starVal)}
                      onMouseLeave={() => setHoverStars(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar
                        className={`text-2xl md:text-3xl transition-colors ${
                          starVal <= (hoverStars || stars)
                            ? "text-amber-500"
                            : "text-slate-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {stars > 0 && (
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                    {stars} dari 5 Bintang
                  </span>
                )}
              </div>
    
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 tracking-wide uppercase">
                  Ulasan Anda
                </label>
                <textarea
                  rows={4}
                  name="text"
                  placeholder="Bagikan pengalaman atau pendapat Anda tentang fasilitas, pengajar, dan kehidupan di kampus ini..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm resize-none text-sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
    
              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 text-sm transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || stars === 0 || !text.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-bold px-6 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all text-sm"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
}

export default UniversityReviewSubmitForm;