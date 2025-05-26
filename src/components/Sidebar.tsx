import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, Settings, LogOut, Menu, X, Users, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as apiService from '../services/api';

interface SidebarProps {
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user, logout } = useAuth();

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const adminLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/admin/manage-users', icon: <Users size={20} />, text: 'Manage Users' },
    { to: '/admin/create-user', icon: <User size={20} />, text: 'Add User' },
    { to: '/admin/leave-review', icon: <Calendar size={20} />, text: 'Leave Requests' },
    { to: '/admin/attendance', icon: <FileText size={20} />, text: 'Attendance' },
  ];

  const userLinks = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, text: 'Dashboard' },
    { to: '/leave', icon: <Calendar size={20} />, text: 'Leave Requests' },
    { to: '/profile', icon: <User size={20} />, text: 'Profile' },
  ];

  const links = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <>
      <button 
        className={`fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md transition-transform duration-300 ${
          isOpen ? 'transform translate-x-56' : ''
        }`}
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-20 border-b px-6">
            <h1 className="text-xl font-bold text-[#7494ec] whitespace-nowrap">MLVisioTrack</h1>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {links.map((link) => (
                <NavLink 
                  key={link.to}
                  to={link.to} 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors duration-200 whitespace-nowrap ${
                      isActive 
                        ? 'bg-[#7494ec] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={handleLinkClick}
                >
                  {link.icon}
                  <span className="ml-3">{link.text}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <button
              className="flex items-center p-3 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;