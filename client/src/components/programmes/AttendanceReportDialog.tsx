
import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format } from 'date-fns';

export interface AttendanceReportDialogProps {
  programmeId?: string;
  programmes?: any[];
  onClose: () => void;
}

export const AttendanceReportDialog = ({ 
  programmeId,
  programmes = [],
  onClose
}: AttendanceReportDialogProps) => {
  const { members, attendance, programmes: contextProgrammes } = useAppContext();
  const [selectedProgrammeId, setSelectedProgrammeId] = useState(programmeId || '');
  
  const allProgrammes = programmes.length > 0 ? programmes : contextProgrammes;
  const selectedProgramme = allProgrammes.find(p => p.id === selectedProgrammeId);
  
  const attendanceData = useMemo(() => {
    if (!selectedProgrammeId) return [];
    
    return attendance.filter(record => record.programmeId === selectedProgrammeId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [attendance, selectedProgrammeId]);

  const attendanceStats = useMemo(() => {
    if (!attendanceData.length) return { total: 0, present: 0, absent: 0, rate: 0 };
    
    const total = attendanceData.length;
    const present = attendanceData.filter(record => record.isPresent).length;
    const absent = total - present;
    const rate = total > 0 ? (present / total) * 100 : 0;
    
    return { total, present, absent, rate };
  }, [attendanceData]);

  const memberAttendanceMap = useMemo(() => {
    const memberMap = new Map();
    
    attendanceData.forEach(record => {
      const memberId = record.memberId;
      if (!memberMap.has(memberId)) {
        memberMap.set(memberId, { total: 0, present: 0 });
      }
      
      const memberStats = memberMap.get(memberId);
      memberStats.total++;
      if (record.isPresent) {
        memberStats.present++;
      }
    });
    
    return memberMap;
  }, [attendanceData]);

  const memberAttendanceStats = useMemo(() => {
    return Array.from(memberAttendanceMap.entries()).map(([memberId, stats]) => {
      const member = members.find(m => m.id === memberId);
      const rate = stats.total > 0 ? (stats.present / stats.total) * 100 : 0;
      
      return {
        memberId,
        memberName: member ? `${member.firstName} ${member.lastName}` : 'Unknown Member',
        ...stats,
        rate
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [memberAttendanceMap, members]);

  const getAttendanceIcon = (rate: number) => {
    if (rate >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (rate >= 60) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="max-h-[70vh] overflow-y-auto space-y-6">
      {/* Programme Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Programme</label>
        <Select value={selectedProgrammeId} onValueChange={setSelectedProgrammeId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a programme" />
          </SelectTrigger>
          <SelectContent>
            {allProgrammes.map(programme => (
              <SelectItem key={programme.id} value={programme.id}>
                {programme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProgramme && (
        <>
          {/* Programme Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedProgramme.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{attendanceStats.total}</div>
                  <div className="text-sm text-gray-600">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                  <div className="text-sm text-gray-600">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{attendanceStats.rate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Attendance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Member Attendance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Total Sessions</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberAttendanceStats.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No attendance records found for this programme
                      </TableCell>
                    </TableRow>
                  ) : (
                    memberAttendanceStats.map(member => (
                      <TableRow key={member.memberId}>
                        <TableCell className="font-medium">{member.memberName}</TableCell>
                        <TableCell>{member.total}</TableCell>
                        <TableCell>{member.present}</TableCell>
                        <TableCell>{member.total - member.present}</TableCell>
                        <TableCell>{member.rate.toFixed(1)}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getAttendanceIcon(member.rate)}
                            <Badge variant={
                              member.rate >= 80 ? 'default' : 
                              member.rate >= 60 ? 'secondary' : 'destructive'
                            }>
                              {member.rate >= 80 ? 'Excellent' : 
                               member.rate >= 60 ? 'Good' : 'Needs Improvement'}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Attendance Records */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.slice(0, 10).map(record => {
                    const member = members.find(m => m.id === record.memberId);
                    return (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          {member ? `${member.firstName} ${member.lastName}` : 'Unknown Member'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={record.isPresent ? 'default' : 'secondary'}>
                            {record.isPresent ? 'Present' : 'Absent'}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.notes || '-'}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default AttendanceReportDialog;
