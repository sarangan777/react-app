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

// Mock user data for testing
const mockUsers = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@mlvisiotrack.com',
    password: 'admin123',
    role: 'admin',
    department: 'Administration',
    profilePicture: null,
    bio: 'System Administrator',
    joinDate: '2024-01-01'
  },
  user: {
    id: '2',
    name: 'Regular User',
    email: 'user@mlvisiotrack.com',
    password: 'user123',
    role: 'user',
    department: 'Engineering',
    profilePicture: null,
    bio: 'Software Engineer',
    joinDate: '2024-02-01'
  }
};

// Mock leave requests
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    type: 'vacation',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    reason: 'Annual family vacation',
    status: 'pending',
    createdAt: '2024-03-10T10:00:00Z'
  },
  {
    id: '2',
    type: 'sick',
    startDate: '2024-03-12',
    endDate: '2024-03-13',
    reason: 'Not feeling well',
    status: 'pending',
    createdAt: '2024-03-11T09:00:00Z'
  }
];

// Login
export const login = async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
  // Mock authentication
  const adminUser = mockUsers.admin;
  const regularUser = mockUsers.user;

  let authenticatedUser = null;

  if (email === adminUser.email && password === adminUser.password) {
    authenticatedUser = { ...adminUser };
    delete authenticatedUser.password;
  } else if (email === regularUser.email && password === regularUser.password) {
    authenticatedUser = { ...regularUser };
    delete authenticatedUser.password;
  }

  if (authenticatedUser) {
    const mockToken = 'mock-jwt-token';
    localStorage.setItem('role', authenticatedUser.role);
    return {
      success: true,
      data: {
        user: authenticatedUser,
        token: mockToken
      }
    };
  }

  return {
    success: false,
    data: null,
    message: 'Invalid email or password'
  };
};

// Logout
export const logout = async (): Promise<void> => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
};

// Mock data for dashboard
const mockDashboardStats: DashboardStats = {
  present: 45,
  absent: 5,
  leave: 3,
  totalHours: 360
};

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'check-in',
    timestamp: new Date().toISOString(),
    details: 'John Doe checked in for the day'
  },
  {
    id: '2',
    type: 'leave-request',
    timestamp: new Date().toISOString(),
    details: 'Jane Smith requested vacation leave'
  },
  {
    id: '3',
    type: 'leave-approved',
    timestamp: new Date().toISOString(),
    details: 'Mike Johnson\'s leave request was approved'
  }
];

// Dashboard
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return {
    success: true,
    data: mockDashboardStats
  };
};

// Activity
export const getRecentActivity = async (): Promise<ApiResponse<ActivityItem[]>> => {
  return {
    success: true,
    data: mockActivities
  };
};

// Leave Requests
export const getLeaveRequests = async (): Promise<ApiResponse<LeaveRequest[]>> => {
  return {
    success: true,
    data: mockLeaveRequests
  };
};

export const submitLeaveRequest = async (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'createdAt'>): Promise<ApiResponse<LeaveRequest>> => {
  const mockLeaveRequest: LeaveRequest = {
    id: Math.random().toString(),
    ...leaveData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  mockLeaveRequests.push(mockLeaveRequest);

  return {
    success: true,
    data: mockLeaveRequest
  };
};

// Profile
export const getUserProfile = async (): Promise<ApiResponse<User>> => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  return {
    success: true,
    data: currentUser
  };
};

export const updateUserProfile = async (profileData: Partial<User>): Promise<ApiResponse<User>> => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...currentUser, ...profileData };
  
  return {
    success: true,
    data: updatedUser
  };
};

export const uploadProfilePicture = async (file: File): Promise<ApiResponse<{ url: string }>> => {
  return {
    success: true,
    data: { url: URL.createObjectURL(file) }
  };
};

export default api;