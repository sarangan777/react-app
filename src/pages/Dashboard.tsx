import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { UserCheck, UserX, Calendar, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import { DashboardStats, ActivityItem } from '../types';
import * as apiService from '../services/api';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    present: 0,
    absent: 0,
    leave: 0,
    totalHours: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          apiService.getDashboardStats(),
          apiService.getRecentActivity(),
        ]);

        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        }

        if (activityResponse.success && activityResponse.data) {
          setActivities(activityResponse.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data
  const chartData = {
    labels: ['Present', 'Absent', 'Leave'],
    datasets: [
      {
        data: [stats.present, stats.absent, stats.leave],
        backgroundColor: ['#4ade80', '#f87171', '#facc15'],
        borderColor: ['#22c55e', '#ef4444', '#eab308'],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false,
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
  if (error) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Present"
          value={stats.present}
          icon={<UserCheck size={24} />}
          bgColor="bg-green-500"
          textColor="text-white"
        />
        <StatCard
          title="Absent"
          value={stats.absent}
          icon={<UserX size={24} />}
          bgColor="bg-red-500"
          textColor="text-white"
        />
        <StatCard
          title="On Leave"
          value={stats.leave}
          icon={<Calendar size={24} />}
          bgColor="bg-yellow-500"
          textColor="text-white"
        />
        <StatCard
          title="Total Hours"
          value={`${stats.totalHours}h`}
          icon={<Clock size={24} />}
          bgColor="bg-blue-500"
          textColor="text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Attendance Overview</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;