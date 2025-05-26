import axios from 'axios';
import { User, DashboardStats, ActivityItem, LeaveRequest, ApiResponse } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  try {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/login', { email, password });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<{ user: User; token: string }>;
    }
    throw error;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await api.post('/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove local storage items even if API call fails
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Dashboard
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  const response = await api.get<ApiResponse<DashboardStats>>('/dashboard');
  return response.data;
};

// Activity
export const getRecentActivity = async (): Promise<ApiResponse<ActivityItem[]>> => {
  const response = await api.get<ApiResponse<ActivityItem[]>>('/activity');
  return response.data;
};

// Leave Requests
export const getLeaveRequests = async (): Promise<ApiResponse<LeaveRequest[]>> => {
  const response = await api.get<ApiResponse<LeaveRequest[]>>('/leaves');
  return response.data;
};

export const submitLeaveRequest = async (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>): Promise<ApiResponse<LeaveRequest>> => {
  const response = await api.post<ApiResponse<LeaveRequest>>('/leave', leaveData);
  return response.data;
};

// Profile
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  const response = await api.get<ApiResponse<User>>('/profile');
  return response.data;
};

export const updateUserProfile = async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>('/profile', profileData);
  return response.data;
};

// Upload profile picture
export const uploadProfilePicture = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const response = await api.post<ApiResponse<{ url: string }>>('/profile/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export default api;