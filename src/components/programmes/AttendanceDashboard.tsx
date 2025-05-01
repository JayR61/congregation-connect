
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Programme, ProgrammeAttendance, Member } from '@/types';
import { format, parseISO, differenceInDays } from 'date-fns';
import { calculateProgrammeStatistics } from '@/services/programmeService';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AttendanceDashboardProps {
  programmes: Programme[];
  attendance: ProgrammeAttendance[];
  members: Member[];
}

export const AttendanceDashboard = ({ programmes, attendance, members }: AttendanceDashboardProps) => {
  // Calculate statistics
  const statistics = calculateProgrammeStatistics(programmes, attendance);
  
  // Prepare data for charts
  const programmeTypeData = Object.entries(statistics.programmesByType || {}).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const attendanceRateColor = 
    (statistics.attendanceRate || 0) >= 80 ? 'bg-green-500' : 
    (statistics.attendanceRate || 0) >= 60 ? 'bg-yellow-500' : 
    'bg-red-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Programmes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statistics.totalProgrammes || 0}</div>
            <p className="text-sm text-muted-foreground">
              {statistics.activeProgrammes || 0} active, {statistics.completedProgrammes || 0} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statistics.totalParticipants || 0}</div>
            <p className="text-sm text-muted-foreground">
              {Math.round((statistics.totalParticipants || 0) / programmes.length || 0)} per programme
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(statistics.attendanceRate || 0)}%</div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className={`h-full rounded-full ${attendanceRateColor}`}
                style={{ width: `${statistics.attendanceRate || 0}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{attendance.length}</div>
            <p className="text-sm text-muted-foreground">
              {attendance.filter(a => a.isPresent).length} present, {attendance.filter(a => !a.isPresent).length} absent
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Programmes by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={programmeTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Participants Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={statistics.participantsTrend || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Participants" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Date</th>
                    <th className="text-left pb-2">Programme</th>
                    <th className="text-left pb-2">Member</th>
                    <th className="text-left pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .slice(0, 20)
                    .map(record => {
                      const programme = programmes.find(p => p.id === record.programmeId);
                      const member = members.find(m => m.id === record.memberId);
                      
                      return (
                        <tr key={record.id} className="border-b hover:bg-gray-50">
                          <td className="py-2">{format(new Date(record.date), 'MMM d, yyyy')}</td>
                          <td className="py-2">{programme?.name || 'Unknown Programme'}</td>
                          <td className="py-2">{member ? `${member.firstName} ${member.lastName}` : 'Unknown Member'}</td>
                          <td className="py-2">
                            <span 
                              className={`inline-block px-2 py-1 rounded-full text-xs ${
                                record.isPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {record.isPresent ? 'Present' : 'Absent'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  }
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-muted-foreground">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
