import React from "react";
import { FaPenToSquare } from "react-icons/fa6";

interface CreateReviewProps {
  onClick: () => void;
}

const CreateReview: React.FC<CreateReviewProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 font-bold py-2.5 px-4 bg-indigo-600 rounded-xl hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100 text-sm transition-all active:scale-[0.98]"
    >
      <FaPenToSquare className="text-sm" />
      <span>Tulis Ulasan</span>
    </button>
  );
};

export default CreateReview;