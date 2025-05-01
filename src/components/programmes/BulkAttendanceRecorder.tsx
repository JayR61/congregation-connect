
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppContext } from '@/context/AppContext';
import { BulkAttendanceRecord, Member } from '@/types';
import { CalendarIcon, Check, CheckCircle, CircleX, Search, UserCheck, UserX } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const BulkAttendanceRecorder = ({ programmeId, onSaveComplete }: { programmeId: string, onSaveComplete?: () => void }) => {
  const { members, programmes, recordBulkAttendance } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<Array<{
    memberId: string;
    isPresent: boolean;
    notes: string;
  }>>([]);
  
  const programme = programmes.find(p => p.id === programmeId);
  
  // Initialize attendance records with all members
  useEffect(() => {
    const initialRecords = members.map(member => ({
      memberId: member.id,
      isPresent: false,
      notes: ''
    }));
    
    setAttendanceRecords(initialRecords);
  }, [members]);
  
  // Filter members based on search query
  const filteredMembers = members.filter(member => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });
  
  // Toggle attendance for a member
  const toggleAttendance = (memberId: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.memberId === memberId 
          ? { ...record, isPresent: !record.isPresent } 
          : record
      )
    );
  };
  
  // Update notes for a member
  const updateNotes = (memberId: string, notes: string) => {
    setAttendanceRecords(prev => 
      prev.map(record => 
        record.memberId === memberId 
          ? { ...record, notes } 
          : record
      )
    );
  };
  
  // Mark all filtered members as present
  const markAllPresent = () => {
    const filteredMemberIds = filteredMembers.map(m => m.id);
    
    setAttendanceRecords(prev => 
      prev.map(record => 
        filteredMemberIds.includes(record.memberId) 
          ? { ...record, isPresent: true } 
          : record
      )
    );
  };
  
  // Mark all filtered members as absent
  const markAllAbsent = () => {
    const filteredMemberIds = filteredMembers.map(m => m.id);
    
    setAttendanceRecords(prev => 
      prev.map(record => 
        filteredMemberIds.includes(record.memberId) 
          ? { ...record, isPresent: false } 
          : record
      )
    );
  };
  
  const saveAttendance = () => {
    if (saving) return;
    
    setSaving(true);
    
    try {
      // Convert the attendance state to the format expected by the API
      const recordsFormat = attendanceRecords.map(record => ({
        memberId: record.memberId,
        status: record.isPresent ? 'present' : 'absent', // Convert boolean to status string
        notes: record.notes || ''
      }));
      
      // Fix for the BulkAttendanceRecord.records missing error
      recordBulkAttendance({
        programmeId,
        date: selectedDate,
        records: recordsFormat,  // Add the required records field
        attendees: attendanceRecords  // Keep the attendees field as well
      });
      
      toast({
        title: "Attendance recorded",
        description: `Successfully recorded attendance for ${programmeId} on ${selectedDate.toLocaleDateString()}`,
      });
      
      if (onSaveComplete) {
        onSaveComplete();
      }
      
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast({
        title: "Error recording attendance",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Get attendance stats
  const presentCount = attendanceRecords.filter(r => r.isPresent).length;
  const absentCount = attendanceRecords.length - presentCount;
  const attendanceRate = attendanceRecords.length > 0 
    ? Math.round((presentCount / attendanceRecords.length) * 100) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Record Attendance</CardTitle>
            <CardDescription>
              {programme ? programme.name : 'Programme'} - {format(selectedDate, 'PPP')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <Label>Select Date</Label>
                <div className="mt-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="border rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-4">
                  <Label>Attendance Summary</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <Card className="p-4 text-center">
                      <UserCheck className="h-5 w-5 mx-auto text-green-500 mb-1" />
                      <p className="text-sm text-muted-foreground">Present</p>
                      <p className="text-2xl font-bold">{presentCount}</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <UserX className="h-5 w-5 mx-auto text-red-500 mb-1" />
                      <p className="text-sm text-muted-foreground">Absent</p>
                      <p className="text-2xl font-bold">{absentCount}</p>
                    </Card>
                    <Card className="p-4 text-center">
                      <CalendarIcon className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                      <p className="text-sm text-muted-foreground">Rate</p>
                      <p className="text-2xl font-bold">{attendanceRate}%</p>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <Label>Actions</Label>
                  <div className="flex flex-col gap-2 mt-2">
                    <Button onClick={markAllPresent} variant="outline" className="justify-start">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Mark All as Present
                    </Button>
                    <Button onClick={markAllAbsent} variant="outline" className="justify-start">
                      <CircleX className="h-4 w-4 mr-2 text-red-500" />
                      Mark All as Absent
                    </Button>
                    <Button onClick={saveAttendance} disabled={saving} className="mt-2">
                      {saving ? 'Saving...' : 'Save Attendance'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <div className="px-6 pt-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="present">Present</TabsTrigger>
                  <TabsTrigger value="absent">Absent</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {filteredMembers.map(member => {
                      const record = attendanceRecords.find(r => r.memberId === member.id);
                      const isPresent = record?.isPresent || false;
                      
                      return (
                        <div key={member.id} className="flex items-center p-4 hover:bg-muted/50">
                          <div className="flex items-center flex-1">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.firstName} {member.lastName}</p>
                              <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-4">
                              <Input
                                placeholder="Notes"
                                value={record?.notes || ''}
                                onChange={(e) => updateNotes(member.id, e.target.value)}
                                className="w-32 h-8 text-xs"
                              />
                            </div>
                            <Button
                              variant={isPresent ? "default" : "outline"}
                              size="sm"
                              className={cn(
                                "w-20",
                                isPresent ? "bg-green-600 hover:bg-green-700" : ""
                              )}
                              onClick={() => toggleAttendance(member.id)}
                            >
                              {isPresent ? (
                                <>
                                  <Check className="h-4 w-4 mr-1" /> Present
                                </>
                              ) : (
                                "Absent"
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    
                    {filteredMembers.length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        No members found matching your search.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="present" className="m-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {filteredMembers
                      .filter(member => {
                        const record = attendanceRecords.find(r => r.memberId === member.id);
                        return record?.isPresent;
                      })
                      .map(member => {
                        const record = attendanceRecords.find(r => r.memberId === member.id);
                        
                        return (
                          <div key={member.id} className="flex items-center p-4 hover:bg-muted/50">
                            <div className="flex items-center flex-1">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.firstName} {member.lastName}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="mr-4">
                                <Input
                                  placeholder="Notes"
                                  value={record?.notes || ''}
                                  onChange={(e) => updateNotes(member.id, e.target.value)}
                                  className="w-32 h-8 text-xs"
                                />
                              </div>
                              <Button
                                variant="default"
                                size="sm"
                                className="w-20 bg-green-600 hover:bg-green-700"
                                onClick={() => toggleAttendance(member.id)}
                              >
                                <Check className="h-4 w-4 mr-1" /> Present
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    
                    {filteredMembers.filter(member => {
                      const record = attendanceRecords.find(r => r.memberId === member.id);
                      return record?.isPresent;
                    }).length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        No present members found.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="absent" className="m-0">
                <ScrollArea className="h-[400px]">
                  <div className="divide-y">
                    {filteredMembers
                      .filter(member => {
                        const record = attendanceRecords.find(r => r.memberId === member.id);
                        return !record?.isPresent;
                      })
                      .map(member => {
                        const record = attendanceRecords.find(r => r.memberId === member.id);
                        
                        return (
                          <div key={member.id} className="flex items-center p-4 hover:bg-muted/50">
                            <div className="flex items-center flex-1">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.firstName} {member.lastName}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="mr-4">
                                <Input
                                  placeholder="Notes"
                                  value={record?.notes || ''}
                                  onChange={(e) => updateNotes(member.id, e.target.value)}
                                  className="w-32 h-8 text-xs"
                                />
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-20"
                                onClick={() => toggleAttendance(member.id)}
                              >
                                Absent
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    
                    {filteredMembers.filter(member => {
                      const record = attendanceRecords.find(r => r.memberId === member.id);
                      return !record?.isPresent;
                    }).length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        No absent members found.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMembers.length} of {members.length} members
            </p>
            <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BulkAttendanceRecorder;
