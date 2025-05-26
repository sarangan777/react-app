import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

interface TopHeaderProps {
  sidebarOpen: boolean;
}

const TopHeader: React.FC<TopHeaderProps> = ({ sidebarOpen }) => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'User';

  // Get current day and time
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <header className={`fixed top-0 right-0 z-30 h-20 bg-white shadow-sm transition-all duration-300 ease-in-out ${
      sidebarOpen ? 'md:left-64' : 'md:left-20'
    } left-0 flex items-center px-6`}>
      <div className="flex-1">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome, {firstName}</h2>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 relative">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#7494ec] flex items-center justify-center text-white font-semibold">
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              user?.name?.charAt(0) || 'U'
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;