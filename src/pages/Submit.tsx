import React from 'react';
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import PostSubmitForm from '../components/PostSubmitForm';

const Submit: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />
        
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"></div>
        
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <PostSubmitForm />
        </div>
      </div>
    </div>
  );
};

export default Submit;