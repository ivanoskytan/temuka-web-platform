import React, { useState, useEffect, useRef } from 'react';
import { FaClock, FaXmark, FaTrashCan } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { 
  getSuggestions, 
  recordSearchClick, 
  getSearchHistory, 
  clearSearchHistory 
} from '../services/searchService'; 
import { 
  SuggestionItemData, 
  SearchHistoryItemData 
} from '../types';

interface SearchBarProps {
  currentUserId?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SuggestionItemData[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItemData[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const fetchHistory = async () => {
    if (!currentUserId) return;
    try {
      setIsLoadingHistory(true);
      const res = await getSearchHistory(currentUserId, 5);
      const historyList = res?.data?.History || [];
      setSearchHistory(historyList);
    } catch (err) {
      console.error('Failed to fetch search history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      if (isOpen) fetchHistory();
      return;
    }

    const fetchTypeaheadSuggestions = async () => {
      try {
        setIsLoadingSuggestions(true);
        const res = await getSuggestions(searchQuery.trim());
        const data = res?.data;
        
        if (data) {
          const combined: SuggestionItemData[] = [
            ...(data.Communities || []),
            ...(data.Majors || []),
            ...(data.Universities || []),
            ...(data.Users || []),
            ...(data.Posts || []),
          ];
          setSuggestions(combined);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchTypeaheadSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setIsOpen(true);
    if (!searchQuery.trim()) {
      fetchHistory();
    }
  };

  const handleSuggestionClick = async (item: SuggestionItemData) => {
    setIsOpen(false);
    const clickedQuery = item.Title || searchQuery;

    if (currentUserId) {
      try {
        await recordSearchClick({
          userId: currentUserId,
          query: clickedQuery,
          entityId: item.ID,
          slug: item.Slug,
        });
      } catch (err) {
        console.error('Failed to record search click:', err);
      }
    }
    setSearchQuery('');
  };

  const handleClearAllHistory = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return;

    try {
      await clearSearchHistory(currentUserId);
      setSearchHistory([]);
    } catch (err) {
      console.error('Failed to clear search history:', err);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-4" ref={searchContainerRef}>
      <div className="flex gap-2.5 bg-slate-100 rounded-xl px-4 py-2 w-full items-center focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-600 focus-within:shadow-xs transition-all border border-transparent focus-within:border-transparent">
        <FaSearch className="text-slate-400 text-sm shrink-0" />
        <input
          type="search"
          className="text-slate-800 font-medium text-sm w-full bg-transparent outline-none placeholder-slate-400"
          placeholder="Cari prodi, universitas, komunitas"
          value={searchQuery}
          onFocus={handleInputFocus}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <FaXmark className="text-sm" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-13 left-0 right-0 bg-white rounded-2xl p-2 shadow-xl border border-slate-100 flex flex-col gap-1 max-h-80 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {!searchQuery.trim() ? (
            <div className="p-2 flex flex-col gap-1">
              <div className="flex items-center justify-between px-2 py-1 mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Pencarian Terakhir
                </span>
                {searchHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllHistory}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaTrashCan className="text-[10px]" />
                    <span>Hapus Semua</span>
                  </button>
                )}
              </div>

              {isLoadingHistory ? (
                <p className="text-xs text-slate-400 font-medium p-3 text-center">
                  Memuat riwayat...
                </p>
              ) : searchHistory.length > 0 ? (
                searchHistory.map((item, idx) => (
                  <div
                    key={item.EntityID || idx}
                    onClick={() => setSearchQuery(item.Query)}
                    className="flex items-center justify-between px-3 py-2 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FaClock className="text-slate-400 text-xs shrink-0" />
                      <span className="text-slate-700 font-medium text-sm truncate">
                        {item.Query}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-xs font-medium text-slate-400">
                    Belum ada riwayat pencarian.
                  </p>
                </div>
              )}
            </div>
          ) : (
            isLoadingSuggestions ? (
              <p className="text-xs text-slate-400 font-medium p-4 text-center">
                Mencari saran...
              </p>
            ) : suggestions?.length ? (
              suggestions.map((item, idx) => (
                <div
                  key={item.ID || idx}
                  onClick={() => handleSuggestionClick(item)}
                  className="flex p-2.5 items-center gap-3 hover:bg-slate-50 cursor-pointer rounded-xl transition-colors"
                >
                  <FaSearch className="text-slate-400 text-xs shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <p className="text-slate-700 font-semibold text-sm truncate">
                      {item.Title}
                    </p>
                    {item.Type && (
                      <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-wider">
                        {item.Type}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                  <FaSearch className="text-base text-slate-400/80" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-slate-800 font-semibold text-sm tracking-tight">
                    Tidak ada saran ditemukan
                  </p>
                  <p className="text-slate-400 text-xs font-medium max-w-[240px] mx-auto leading-normal">
                    Coba periksa kembali kata kunci pencarian Anda.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;