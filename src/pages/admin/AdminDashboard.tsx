import React from 'react';
import { Calendar, Users, FileText, Clock } from 'lucide-react';
import TopHeader from '../../components/TopHeader';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import ActivityFeed from '../../components/ActivityFeed';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Employees',
      value: '156',
      icon: <Users className="w-6 h-6 text-blue-600" />,
      change: '+12%',
      timeframe: 'from last month'
    },
    {
      title: 'Leave Requests',
      value: '23',
      icon: <Calendar className="w-6 h-6 text-green-600" />,
      change: '+5',
      timeframe: 'pending approval'
    },
    {
      title: 'Attendance Rate',
      value: '97%',
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      change: '+2%',
      timeframe: 'from last week'
    },
    {
      title: 'Documents',
      value: '45',
      icon: <FileText className="w-6 h-6 text-orange-600" />,
      change: '+8',
      timeframe: 'new this month'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader title="Admin Dashboard" />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <ActivityFeed />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;