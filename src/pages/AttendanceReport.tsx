import React, { useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceRecord {
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'leave';
  duration: string;
}

const AttendanceReport: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<string>('current');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const mockAttendance: AttendanceRecord[] = [
    {
      date: '2024-03-11',
      checkIn: '08:55',
      checkOut: '16:30',
      status: 'present',
      duration: '7.5'
    },
    // Add more attendance records
  ];

  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log('Exporting PDF...');
  };

  const handleExportCSV = () => {
    // Implement CSV export logic
    console.log('Exporting CSV...');
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Attendance Report</h2>
          <div className="flex space-x-3">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="current">Current Month</option>
              <option value="previous">Previous Month</option>
              <option value="custom">Custom Range</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
            <div className="flex space-x-2">
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-[#7494ec] text-white rounded-lg hover:bg-[#5b7cde] text-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 border border-[#7494ec] text-[#7494ec] rounded-lg hover:bg-gray-50 text-sm flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-in
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check-out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAttendance.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(record.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkIn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkOut}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'present' 
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'absent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.duration} hrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;