import React from 'react';
import { Link } from 'react-router-dom';

const CreateCommunity: React.FC = () => {
  return (
    <div className="w-full">
      <Link 
        to="/community/create"
        className="flex items-center justify-center font-semibold py-3 px-4 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white shadow-md shadow-indigo-100 text-sm transition-all active:scale-[0.98] w-full"
      >
        Buat Komunitas Baru +
      </Link>
    </div>
  );
};

export default CreateCommunity;