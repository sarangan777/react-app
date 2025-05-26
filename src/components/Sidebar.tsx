import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as apiService from '../services/api';

interface SidebarProps {
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile }) => {
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await apiService.logout();
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
      logout(); // Still log out locally even if API call fails
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && (
        <button 
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
          onClick={toggleSidebar}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <div 
        className={`fixed top-0 left-0 h-full bg-white shadow-lg transition-all duration-300 ease-in-out z-40 ${
          isOpen ? 'w-64' : isMobile ? 'w-0' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className={`flex items-center justify-center h-20 border-b ${isOpen ? 'px-6' : 'px-2'}`}>
            {isOpen ? (
              <h1 className="text-xl font-bold text-[#7494ec]">MLVisioTrack</h1>
            ) : (
              !isMobile && <span className="text-2xl font-bold text-[#7494ec]">ML</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-[#7494ec] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                <LayoutDashboard size={20} />
                {isOpen && <span className="ml-3">Dashboard</span>}
              </NavLink>

              <NavLink 
                to="/leave" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-[#7494ec] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                <Calendar size={20} />
                {isOpen && <span className="ml-3">Leave Requests</span>}
              </NavLink>

              <NavLink 
                to="/profile" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActive 
                      ? 'bg-[#7494ec] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                onClick={() => isMobile && setIsOpen(false)}
              >
                <User size={20} />
                {isOpen && <span className="ml-3">Profile</span>}
              </NavLink>

              {user?.role === 'admin' && (
                <NavLink 
                  to="/settings" 
                  className={({ isActive }) => 
                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-[#7494ec] text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <Settings size={20} />
                  {isOpen && <span className="ml-3">Settings</span>}
                </NavLink>
              )}
            </nav>
          </div>

          <div className="p-4 border-t">
            <button
              className="flex items-center p-3 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              {isOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;