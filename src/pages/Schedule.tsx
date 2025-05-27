import React, { useState } from 'react';
import { Calendar, Download } from 'lucide-react';

interface ClassSchedule {
  id: string;
  subject: string;
  instructor: string;
  startTime: string;
  endTime: string;
  day: string;
  room: string;
}

const Schedule: React.FC = () => {
  const [currentDate] = useState(new Date());
  const [view] = useState<'week' | 'month'>('week');

  // Mock data - replace with actual API calls
  const mockSchedule: ClassSchedule[] = [
    {
      id: '1',
      subject: 'Mathematics',
      instructor: 'Dr. Smith',
      startTime: '09:00',
      endTime: '10:30',
      day: 'Monday',
      room: 'Lab 01'
    },
    {
      id: '2',
      subject: 'Physics',
      instructor: 'Prof. Johnson',
      startTime: '11:00',
      endTime: '12:30',
      day: 'Monday',
      room: 'Lab 02'
    },
  ];

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getClassesForDayAndTime = (day: string, time: string) => {
    return mockSchedule.filter(cls => 
      cls.day === day && 
      cls.startTime <= time && 
      cls.endTime > time
    );
  };

  const isCurrentTimeSlot = (day: string, time: string) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5);
    return day === currentDay && time === currentTime.slice(0, 2) + ':00';
  };

  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log('Exporting PDF...');
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-[#7494ec]" />
            Class Schedule
          </h2>
          <div className="flex space-x-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 text-sm bg-[#7494ec] text-white rounded-lg hover:bg-[#5b7cde] flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Schedule
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="w-20 p-3 border bg-gray-50"></th>
                {weekDays.map(day => (
                  <th key={day} className="p-3 border bg-gray-50 font-medium text-gray-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <td className="p-3 border text-sm text-gray-500 font-medium">
                    {time}
                  </td>
                  {weekDays.map(day => {
                    const classes = getClassesForDayAndTime(day, time);
                    const isCurrentSlot = isCurrentTimeSlot(day, time);
                    
                    return (
                      <td 
                        key={`${day}-${time}`} 
                        className={`p-3 border ${
                          isCurrentSlot ? 'bg-blue-50' : ''
                        }`}
                      >
                        {classes.map(cls => (
                          <div 
                            key={cls.id}
                            className="bg-[#7494ec] text-white p-2 rounded-lg text-sm"
                          >
                            <div className="font-medium">{cls.subject}</div>
                            <div className="text-xs opacity-90">{cls.instructor}</div>
                            <div className="text-xs opacity-90">Room: {cls.room}</div>
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedule;