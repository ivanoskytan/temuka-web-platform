import React from 'react';

const RecentPosts: React.FC = () => {
  const recentItems = [
    {
      id: 1,
      tag: 'Matematika',
      title: 'Tips-tips mengerjakan UTBK Pengetahuan Numeris',
      upvotes: 125,
      comments: 50,
      imgSrc: ''
    },
    {
      id: 2,
      tag: 'KKN',
      title: 'Drama selama KKN',
      upvotes: 400,
      comments: 180,
      imgSrc: ''
    }
  ];

  return (
    <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-5 w-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pb-1">
          <h2 className="font-bold text-slate-800 text-base tracking-tight">Post Terkini</h2>
          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer">
            Clear
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {recentItems.map((post) => (
            <div 
              key={post.id}
              className="flex gap-3 border border-slate-100 rounded-xl p-3 hover:bg-slate-50/50 transition-colors cursor-pointer min-w-0"
            >
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <span className="self-start text-[10px] font-bold bg-slate-100 text-slate-600 rounded-md px-2 py-0.5 tracking-wide">
                  {post.tag}
                </span>
                
                <h3 className="font-semibold text-sm text-slate-800 leading-snug line-clamp-2">
                  {post.title}
                </h3>
                
                <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 mt-0.5">
                  <span>{post.upvotes} upvote</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span>{post.comments} komentar</span>
                </div>
              </div>

              {post.imgSrc && (
                <img 
                  src={post.imgSrc} 
                  alt="thumbnail" 
                  className="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0 border border-slate-100"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentPosts;