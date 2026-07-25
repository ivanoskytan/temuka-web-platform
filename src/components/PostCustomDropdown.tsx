import React, { useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa';
import { getCommunityDetail, getUserJoinedCommunities } from '../services/communityService';
import useAuthStore from '../store/authStore';
import { CommunityData } from '../types';

interface DropdownValue {
    current_slug: string | null
    setSelectedCommunity: React.Dispatch<React.SetStateAction<number | null | undefined>>
} 

interface SelectedOption {
    Logo: string
    Name: string
    ID: number 
}

const PostCustomDropdown: React.FC<DropdownValue> = ({ current_slug = null, setSelectedCommunity }) => {
    
    const defaultOption = {
        Logo: "",
        Name: "Pilih komunitas",
        ID: 0
    };

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SelectedOption>(defaultOption);
    const [joinedCommunities, setJoinedCommunities] = useState<CommunityData[]>([]);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const fetchData = async () => {
            const payload = {
                user_id: user?.id
            };
            const { data } = await getUserJoinedCommunities(payload);
            setJoinedCommunities(data);
        };
        fetchData();
    }, [user?.id]);

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await getCommunityDetail(String(current_slug));

            const currentOption = {
                Logo: data.LogoPicture,
                Name: data.Name,
                ID: data.ID
            };

            setSelectedOption(currentOption);
            setSelectedCommunity(data.ID);
        };
        fetchData();
    }, [current_slug, setSelectedCommunity]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (option: SelectedOption) => {
        setSelectedOption(option);
        setSelectedCommunity(option.ID);
        setIsOpen(false);
    };
  
    return (
    <div className="relative inline-block w-[40%]">
        <div
            onClick={toggleDropdown}
            className="bg-gray-100 p-2 rounded-md cursor-pointer flex justify-between items-center hover:bg-gray-200"
        >
            <div className="flex items-center gap-2">
                <img
                    src={selectedOption.Logo}
                    alt={selectedOption.Name}
                    className="h-[20px] w-[20px] rounded-lg mr-2"
                />
                <h1 className="font-semibold">{selectedOption.Name}</h1>
            </div>
            <FaChevronDown />
        </div>
        {isOpen && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-md w-full z-10">
            {joinedCommunities?.map((option, idx) => (
                <div
                    key={idx}
                    onClick={() => handleSelect({
                        ID: option.ID!,
                        Name: option.Name,
                        Logo: option.LogoPicture
                    })}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                >
                    <img
                        src={option.LogoPicture}
                        alt={option.Name}
                        className="h-[20px] w-[20px] rounded-lg mr-2"
                    />
                    <h1 className="font-semibold">{option.Name}</h1>
                </div>
            ))}
            </div>
        )}
    </div>
    );
}

export default PostCustomDropdown;