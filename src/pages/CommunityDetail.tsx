import React from "react";
import Navbar from "../components/Navbar";
import Leftbar from "../components/Leftbar";
import Community from "../components/Community";

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] px-4 gap-6 items-start">
        <Leftbar />
        
        <main className="w-full py-6">
          <Community />
        </main>
      </div>
    </div>
  );
}

export default CommunityPage;