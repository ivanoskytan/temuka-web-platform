import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaLayerGroup, FaUniversity } from "react-icons/fa";
import { IoSettings, IoSchool } from "react-icons/io5";
import { SiLibreofficemath } from "react-icons/si";
import { FaComputer } from "react-icons/fa6";
import { PiBooksFill } from "react-icons/pi";

const Leftbar: React.FC = () => {
  const location = useLocation();

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-4 px-4 py-3 rounded-xl font-semibold text-sm transition-all group ${
      isActive 
        ? 'bg-indigo-50 text-indigo-600' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  };

  const mainNavigation = [
    { name: 'Beranda', path: '/', icon: FaHome },
    { name: 'Komunitas', path: '/communities', icon: FaLayerGroup },
    { name: 'Universitas', path: '/universities', icon: FaUniversity },
    { name: 'Prodi', path: '/majors', icon: IoSchool },
    { name: 'Pengaturan', path: '/settings', icon: IoSettings },
  ];

  const communityNavigation = [
    { name: 'Matematika', path: '/community/matematika', icon: SiLibreofficemath },
    { name: 'Fisika', path: '/community/fisika', icon: PiBooksFill },
    { name: 'Informatika', path: '/community/informatika', icon: FaComputer },
  ];

  return (
    <div className="hidden md:flex flex-col gap-8 w-full sticky top-22 py-6">
      <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
        {mainNavigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
              <Icon className="text-xl shrink-0 transition-transform group-hover:scale-105" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <hr className="border-slate-200/80 mx-2" />

      <div className="flex flex-col gap-3">
        <h2 className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
          Komunitas Kamu
        </h2>
        
        <nav className="flex flex-col gap-1.5" aria-label="Communities Navigation">
          {communityNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} className={getLinkClass(item.path)}>
                <Icon className="text-lg shrink-0 transition-transform group-hover:scale-105" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default Leftbar;