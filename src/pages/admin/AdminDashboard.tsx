import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import TopHeader from '../../components/TopHeader';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import ActivityFeed from '../../components/ActivityFeed';
import * as apiService from '../../services/api';
import { ActivityItem, LeaveRequest } from '../../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    leaveRequests: 0,
    attendanceRate: 0,
    documents: 0
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, activityResponse, leaveResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentActivity(),
        apiService.getLeaveRequests()
      ]);

      if (statsResponse.success) {
        setStats({
          totalEmployees: 156,
          leaveRequests: leaveResponse.data?.length || 0,
          attendanceRate: 97,
          documents: 45
        });
      }

      if (activityResponse.success) {
        setActivities(activityResponse.data);
      }

      if (leaveResponse.success) {
        setLeaveRequests(leaveResponse.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Attendance data for line chart
  const attendanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Attendance Rate',
        data: [95, 97, 94, 98, 96, 95, 97],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  // Leave distribution data for pie chart
  const leaveData = {
    labels: ['Vacation', 'Sick Leave', 'Personal', 'Other'],
    datasets: [
      {
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ]
      }
    ]
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isMobile={false} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader sidebarOpen={true} />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees}
              icon={<Users className="w-6 h-6 text-blue-600" />}
              bgColor="bg-white"
              textColor="text-gray-800"
            />
            <StatCard
              title="Leave Requests"
              value={stats.leaveRequests}
              icon={<Calendar className="w-6 h-6 text-green-600" />}
              bgColor="bg-white"
              textColor="text-gray-800"
            />
            <StatCard
              title="Attendance Rate"
              value={`${stats.attendanceRate}%`}
              icon={<Clock className="w-6 h-6 text-purple-600" />}
              bgColor="bg-white"
              textColor="text-gray-800"
            />
            <StatCard
              title="Documents"
              value={stats.documents}
              icon={<FileText className="w-6 h-6 text-orange-600" />}
              bgColor="bg-white"
              textColor="text-gray-800"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Attendance</h2>
              <div className="h-[300px]">
                <Line data={attendanceData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Leave Distribution</h2>
              <div className="h-[300px]">
                <Pie data={leaveData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <ActivityFeed activities={activities} />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Pending Leave Requests</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">John Doe</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{request.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-green-600 hover:text-green-900 mr-3">
                            Approve
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;