import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import Leftbar from "../components/Leftbar";
import Community from "../components/Community";

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />
        
        <main className="w-full py-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-2xs group shrink-0"
              title="Kembali"
            >
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span>Eksplorasi</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-indigo-600">Komunitas</span>
            </div>
          </div>

          <Community />
        </main>
      </div>
    </div>
  );
};

export default CommunityPage;