import React, { useEffect, useState, useRef } from 'react';
import { FaChevronDown, FaUsers, FaCheck } from 'react-icons/fa6';
import { getCommunityDetail, getUserJoinedCommunities } from '../services/communityService';
import useAuthStore from '../store/authStore';
import { CommunityData } from '../types';

interface DropdownProps {
  current_slug: string | null;
  setSelectedCommunity: (id: number | null) => void;
}

interface SelectedOption {
  Logo: string;
  Name: string;
  ID: number | null;
}

const PostCustomDropdown: React.FC<DropdownProps> = ({ current_slug = null, setSelectedCommunity }) => {
  const defaultOption: SelectedOption = {
    Logo: "",
    Name: "Pilih Komunitas",
    ID: null,
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectedOption>(defaultOption);
  const [joinedCommunities, setJoinedCommunities] = useState<CommunityData[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((state) => state.user);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch joined communities list once user ID is available
  useEffect(() => {
    if (!user?.id) return;

    const fetchCommunities = async () => {
      try {
        const payload = { user_id: user.id };
        const { data } = await getUserJoinedCommunities(payload);
        setJoinedCommunities(data || []);
      } catch (err) {
        console.error("Failed to load joined communities:", err);
      }
    };

    fetchCommunities();
  }, [user?.id]);

  // Handle current_slug initial selection if pre-selected via URL
  useEffect(() => {
    if (!current_slug) return;

    const fetchDetail = async () => {
      try {
        const { data } = await getCommunityDetail(current_slug);
        if (data) {
          const currentOption = {
            Logo: data.LogoPicture || "",
            Name: data.Name,
            ID: data.ID,
          };
          setSelectedOption(currentOption);
          setSelectedCommunity(data.ID);
        }
      } catch (err) {
        console.error("Failed to load preselected community detail:", err);
      }
    };

    fetchDetail();
  }, [current_slug]);

  const handleSelect = (option: SelectedOption) => {
    setSelectedOption(option);
    setSelectedCommunity(option.ID);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/80 rounded-xl transition-all shadow-2xs text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {selectedOption.Logo ? (
            <img
              src={selectedOption.Logo}
              alt={selectedOption.Name}
              className="w-6 h-6 rounded-lg object-cover shrink-0 border border-slate-200"
            />
          ) : (
            <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <FaUsers className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="font-semibold text-slate-800 text-sm truncate">
            {selectedOption.Name}
          </span>
        </div>
        <FaChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto p-1.5 flex flex-col gap-0.5">
          <div
            onClick={() => handleSelect(defaultOption)}
            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
              selectedOption.ID === null ? 'bg-indigo-50/80 text-indigo-700 font-bold' : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center">
                <FaUsers className="w-3.5 h-3.5" />
              </div>
              <span>Pilih Komunitas</span>
            </div>
            {selectedOption.ID === null && <FaCheck className="w-3.5 h-3.5 text-indigo-600" />}
          </div>

          <div className="h-px bg-slate-100 my-1" />

          {joinedCommunities.length === 0 ? (
            <div className="px-3 py-2.5 text-xs text-slate-400 text-center font-medium">
              Belum bergabung dengan komunitas manapun.
            </div>
          ) : (
            joinedCommunities.map((community) => {
              const isSelected = selectedOption.ID === community.ID;
              return (
                <div
                  key={community.ID}
                  onClick={() =>
                    handleSelect({
                      ID: community.ID!,
                      Name: community.Name,
                      Logo: community.LogoPicture || "",
                    })
                  }
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${
                    isSelected ? 'bg-indigo-50/80 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {community.LogoPicture ? (
                      <img
                        src={community.LogoPicture}
                        alt={community.Name}
                        className="w-6 h-6 rounded-lg object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                        <FaUsers className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="truncate">{community.Name}</span>
                  </div>
                  {isSelected && <FaCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default PostCustomDropdown;