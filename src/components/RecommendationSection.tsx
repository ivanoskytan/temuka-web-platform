import React from 'react';
import { Link } from 'react-router-dom';
import { SuggestionItemData } from '../types';

export interface RecommendationSectionProps {
  title: string;
  icon: React.ReactNode;
  items: SuggestionItemData[];
  loading: boolean;
  emptyText: string;
  getItemLink: (item: SuggestionItemData) => string;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title,
  icon,
  items,
  loading,
  emptyText,
  getItemLink
}) => {
  return (
    <div className="bg-white border border-slate-200/80 shadow-sm p-4 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
        <div className="text-indigo-600 text-base">{icon}</div>
        <h3 className="font-bold text-sm text-slate-800">{title}</h3>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 py-1">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-9 bg-slate-100 animate-pulse rounded-xl w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-xs text-slate-400 py-1">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <Link
              key={item.ID}
              to={getItemLink(item)}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="flex flex-col min-w-0 pr-2">
                <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                  {item.Title}
                </span>
                {item.ContextID && (
                  <span className="text-[10px] text-slate-400 truncate">
                    {item.ContextID}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;