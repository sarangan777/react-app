import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as apiService from '../services/api';
import { User } from '../types';
import { Camera, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user: authUser, login } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    bio: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserProfile();
      
      if (response.success && response.data) {
        setUser(response.data);
        setProfileForm({
          name: response.data.name || '',
          bio: response.data.bio || '',
        });
      } else {
        setError(response.message || 'Failed to fetch user profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsUploading(true);
    
    try {
      // Upload image if selected
      let profilePictureUrl = user?.profilePicture || null;
      
      if (imageFile) {
        const uploadResponse = await apiService.uploadProfilePicture(imageFile);
        if (uploadResponse.success && uploadResponse.data) {
          profilePictureUrl = uploadResponse.data.url;
        } else {
          setError('Failed to upload profile picture');
          setIsUploading(false);
          return;
        }
      }
      
      // Update profile data
      const response = await apiService.updateUserProfile({
        ...profileForm,
        profilePicture: profilePictureUrl,
      });
      
      if (response.success && response.data) {
        setUser(response.data);
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        
        // Update auth context
        if (authUser) {
          const updatedUser = {
            ...authUser,
            ...response.data,
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          login(updatedUser, localStorage.getItem('authToken') || '');
        }
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again later.');
    } finally {
      setIsUploading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
    
    // Reset form to current user data
    if (user) {
      setProfileForm({
        name: user.name || '',
        bio: user.bio || '',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7494ec]"></div>
      </div>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-[#7494ec] text-white rounded-lg"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="h-48 bg-gradient-to-r from-[#7494ec] to-[#5b7cde]"></div>
          
          <div className="relative px-6 sm:px-8 pb-8">
            {/* Profile Picture */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-[#7494ec] flex items-center justify-center text-white text-5xl font-semibold overflow-hidden">
                {(imagePreview || user?.profilePicture) ? (
                  <img 
                    src={imagePreview || user?.profilePicture || ''} 
                    alt={user?.name || 'Profile'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}
                
                {isEditing && (
                  <label htmlFor="profile-picture" className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                    <Camera size={24} className="text-white" />
                    <input 
                      type="file" 
                      id="profile-picture" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            
            {/* Edit/Save Buttons */}
            <div className="absolute top-4 right-6 sm:right-8">
              {isEditing ? (
                <div className="flex space-x-2">
                  <button
                    onClick={cancelEdit}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X size={20} className="text-gray-700" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isUploading}
                    className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Save size={20} className="text-[#7494ec]" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-[#7494ec] rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {/* Profile Content */}
            {isEditing ? (
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileForm.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#7494ec] focus:border-[#7494ec]"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#7494ec] focus:border-[#7494ec]"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </form>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-gray-600 mt-1">{user?.email}</p>
                
                {user?.bio && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">About</h2>
                    <p className="text-gray-600">{user.bio}</p>
                  </div>
                )}
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Department</h2>
                    <p className="text-gray-600">{user?.department || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Joined</h2>
                    <p className="text-gray-600">{user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not specified'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;