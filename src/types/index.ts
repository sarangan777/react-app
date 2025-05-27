export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  profilePicture: string | null;
  joinDate: string;
  registrationNumber?: string;
  adminLevel?: 'super' | 'regular';
}

export interface DashboardStats {
  present: number;
  absent: number;
  leave: number;
  totalHours: number;
}

export interface ActivityItem {
  id: string;
  type: 'check-in' | 'check-out' | 'leave-request' | 'leave-approved' | 'leave-rejected';
  timestamp: string;
  details: string;
}

export interface LeaveRequest {
  id: string;
  type: 'sick' | 'vacation' | 'personal' | 'other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}