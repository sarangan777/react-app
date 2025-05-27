import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Trophy, Target, Clock, Calendar } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityFeed from '../components/ActivityFeed';
import { DashboardStats, ActivityItem } from '../types';
import * as apiService from '../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  // Calculate attendance percentage
  const attendancePercentage = Math.round(
    (stats.present / (stats.present + stats.absent + stats.leave)) * 100
  );

  // Weekly attendance data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Attendance',
        data: [1, 1, 1, 0, 1, 1, 1], // 1 for present, 0 for absent
        borderColor: '#7494ec',
        backgroundColor: 'rgba(116, 148, 236, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Weekly Attendance Pattern',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: (value: number) => value === 1 ? 'Present' : 'Absent',
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7494ec]"></div>
      </div>
    );
  }

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
          title="Attendance Streak"
          value="5 Days"
          icon={<Trophy size={24} />}
          bgColor="bg-green-500"
          textColor="text-white"
        />
        <StatCard
          title="Attendance Goal"
          value={`${attendancePercentage}%`}
          icon={<Target size={24} />}
          bgColor={attendancePercentage >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}
          textColor="text-white"
        />
        <StatCard
          title="Next Class"
          value="In 2 Hours"
          icon={<Clock size={24} />}
          bgColor="bg-purple-500"
          textColor="text-white"
        />
        <StatCard
          title="Next Holiday"
          value="May 30"
          icon={<Calendar size={24} />}
          bgColor="bg-orange-500"
          textColor="text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="h-[300px]">
            <Line data={chartData} options={chartOptions} />
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Required Attendance: <span className="font-semibold text-gray-700">80%</span>
            </div>
            <button className="text-[#7494ec] hover:text-[#5b7cde] font-medium">
              View Full Report →
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full py-2 px-4 bg-[#7494ec] text-white rounded-lg hover:bg-[#5b7cde] transition-colors">
                Request Leave
              </button>
              <button className="w-full py-2 px-4 border border-[#7494ec] text-[#7494ec] rounded-lg hover:bg-gray-50 transition-colors">
                View Schedule
              </button>
            </div>
          </div>
          
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;