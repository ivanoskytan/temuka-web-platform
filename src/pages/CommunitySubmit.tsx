import React from 'react';
import Navbar from '../components/Navbar';
import Leftbar from '../components/Leftbar';
import PostSubmitForm from '../components/PostSubmitForm';

const CommunitySubmit: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />

      <div className="pt-20 pb-12 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-8 items-start">
        <Leftbar />

        <main className="w-full flex justify-center md:justify-start">
          <PostSubmitForm />
        </main>
      </div>
    </div>
  );
};

export default CommunitySubmit;