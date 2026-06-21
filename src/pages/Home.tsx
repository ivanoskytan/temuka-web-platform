import React from 'react';
import Feed from '../components/Feed';
import Leftbar from '../components/Leftbar';
import Navbar from '../components/Navbar';
import Rightbar from '../components/Rightbar';
import Chat from '../components/Chat';
import useChatStore from '../store/chatStore';

const Home: React.FC = () => {
  const { isChatVisible } = useChatStore();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar />
      
      <div className="pt-16 max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-[240px_1fr] lg:grid-cols-[240px_1fr_320px] px-4 gap-6 items-start">
        <Leftbar />
        
        <main className="w-full py-6">
          <Feed />
        </main>
        
        <Rightbar />
      </div>

      {isChatVisible && <Chat />}
    </div>
  );
}

export default Home;