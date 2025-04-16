import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Download, FileText, LineChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from '@/lib/toast';
import { Programme, ProgrammeAttendance } from "@/types";
import { ProgrammeCard } from '@/components/programmes/ProgrammeCard';
import { ProgrammesAnalytics } from '@/components/programmes/ProgrammesAnalytics';
import { AttendanceReportDialog } from '@/components/programmes/AttendanceReportDialog';
import { CalendarView } from '@/components/programmes/CalendarView';
import { ProgrammeForm } from '@/components/programmes/ProgrammeForm';
import { Calendar } from "@/components/ui/calendar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Programmes = () => {
  const { members } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [activeView, setActiveView] = useState<'grid' | 'analytics' | 'calendar'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isProgrammeDialogOpen, setIsProgrammeDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [programmesOnSelectedDate, setProgrammesOnSelectedDate] = useState<Programme[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [programmeToEdit, setProgrammeToEdit] = useState<Programme | null>(null);
  
  const [programmes, setProgrammes] = useState<Programme[]>([
    {
      id: 'prog-1',
      name: 'School of Ministry',
      description: 'Training program for future church leaders and ministers',
      type: 'ministry',
      startDate: new Date(2023, 1, 1),
      endDate: new Date(2023, 11, 31),
      recurring: true,
      frequency: 'weekly',
      location: 'Main Campus',
      coordinator: 'Pastor John',
      capacity: 50,
      currentAttendees: 35,
      attendees: ['member-1', 'member-2', 'member-3']
    },
    {
      id: 'prog-2',
      name: 'Marriage Counseling',
      description: 'Support and guidance for married couples',
      type: 'counseling',
      startDate: new Date(2023, 0, 1),
      recurring: true,
      frequency: 'weekly',
      location: 'Counseling Room B',
      coordinator: 'Alice Smith',
      capacity: 10,
      currentAttendees: 8,
      attendees: ['member-1', 'member-2']
    },
    {
      id: 'prog-3',
      name: 'Sunday Worship Service',
      description: 'Weekly worship service for the congregation',
      type: 'service',
      startDate: new Date(2020, 0, 5),
      recurring: true,
      frequency: 'weekly',
      location: 'Main Sanctuary',
      coordinator: 'Worship Team',
      capacity: 500,
      currentAttendees: 350,
      attendees: ['member-1', 'member-2', 'member-3', 'member-4', 'member-5']
    },
    {
      id: 'prog-4',
      name: 'Youth Leadership Training',
      description: 'Training program for youth leaders',
      type: 'training',
      startDate: new Date(2023, 5, 15),
      endDate: new Date(2023, 8, 15),
      recurring: false,
      location: 'Youth Center',
      coordinator: 'Youth Pastor',
      capacity: 25,
      currentAttendees: 20,
      attendees: ['member-3', 'member-4']
    },
    {
      id: 'prog-5',
      name: 'Community Outreach',
      description: 'Serving the local community with practical support',
      type: 'outreach',
      startDate: new Date(2023, 3, 1),
      endDate: new Date(2023, 10, 30),
      recurring: true,
      frequency: 'monthly',
      location: 'Community Center',
      coordinator: 'Outreach Team',
      capacity: 100,
      currentAttendees: 45,
      attendees: ['member-1', 'member-5']
    }
  ]);

  const [attendance, setAttendance] = useState<ProgrammeAttendance[]>([
    {
      id: 'att-1',
      programmeId: 'prog-1',
      memberId: 'member-1',
      date: new Date(2023, 6, 15),
      isPresent: true
    },
    {
      id: 'att-2',
      programmeId: 'prog-1',
      memberId: 'member-2',
      date: new Date(2023, 6, 15),
      isPresent: false,
      notes: 'Called in sick'
    },
    {
      id: 'att-3',
      programmeId: 'prog-2',
      memberId: 'member-1',
      date: new Date(2023, 6, 10),
      isPresent: true
    }
  ]);

  const [attendanceForm, setAttendanceForm] = useState({
    memberId: '',
    date: new Date(),
    isPresent: true,
    notes: ''
  });

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = 
      programme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      programme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      programme.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || programme.type === typeFilter;
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'active' && (!programme.endDate || programme.endDate > new Date())) ||
      (activeTab === 'completed' && programme.endDate && programme.endDate < new Date());
    
    return matchesSearch && matchesType && matchesTab;
  });

  const handleCreateProgramme = (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => {
    const newProgramme: Programme = {
      id: `prog-${programmes.length + 1}`,
      ...programmeData,
      currentAttendees: 0,
      attendees: []
    };

    setProgrammes(prev => [...prev, newProgramme]);
    setIsProgrammeDialogOpen(false);
    toast.success('Programme created successfully');
  };

  const handleUpdateProgramme = (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => {
    if (!programmeToEdit) return;
    
    const updatedProgramme: Programme = {
      ...programmeToEdit,
      ...programmeData,
    };

    setProgrammes(prev => prev.map(p => p.id === programmeToEdit.id ? updatedProgramme : p));
    setIsProgrammeDialogOpen(false);
    setIsEditMode(false);
    setProgrammeToEdit(null);
    toast.success('Programme updated successfully');
  };

  const handleAddAttendance = () => {
    if (!selectedProgrammeId) return;

    const newAttendance: ProgrammeAttendance = {
      id: `att-${attendance.length + 1}`,
      programmeId: selectedProgrammeId,
      memberId: attendanceForm.memberId,
      date: attendanceForm.date,
      isPresent: attendanceForm.isPresent,
      notes: attendanceForm.notes || undefined
    };

    setAttendance(prev => [...prev, newAttendance]);
    
    if (attendanceForm.isPresent) {
      setProgrammes(prev => prev.map(prog => {
        if (prog.id === selectedProgrammeId && !prog.attendees.includes(attendanceForm.memberId)) {
          return {
            ...prog,
            currentAttendees: prog.currentAttendees + 1,
            attendees: [...prog.attendees, attendanceForm.memberId]
          };
        }
        return prog;
      }));
    }

    setIsAttendanceDialogOpen(false);
    resetAttendanceForm();
    toast.success('Attendance recorded successfully');
  };

  const handleDeleteProgramme = (programmeId: string) => {
    setProgrammes(prev => prev.filter(prog => prog.id !== programmeId));
    toast.success('Programme deleted successfully');
  };

  const resetAttendanceForm = () => {
    setAttendanceForm({
      memberId: '',
      date: new Date(),
      isPresent: true,
      notes: ''
    });
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case 'ministry':
        return "bg-blue-100 text-blue-800";
      case 'counseling':
        return "bg-pink-100 text-pink-800";
      case 'service':
        return "bg-purple-100 text-purple-800";
      case 'training':
        return "bg-green-100 text-green-800";
      case 'outreach':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const openAttendanceDialog = (programmeId: string) => {
    setSelectedProgrammeId(programmeId);
    setIsAttendanceDialogOpen(true);
  };

  const handleCalendarDateSelect = (date: Date, programmesOnDate: Programme[]) => {
    setSelectedDate(date);
    setProgrammesOnSelectedDate(programmesOnDate);
  };

  const handleEditProgramme = (programme: Programme) => {
    setProgrammeToEdit(programme);
    setIsEditMode(true);
    setIsProgrammeDialogOpen(true);
  };

  const exportProgrammesToCSV = () => {
    let csvContent = "Name,Type,Start Date,End Date,Location,Coordinator,Capacity,Attendees,Description\n";
    
    programmes.forEach(programme => {
      const startDate = format(programme.startDate, 'yyyy-MM-dd');
      const endDate = programme.endDate ? format(programme.endDate, 'yyyy-MM-dd') : '';
      
      csvContent += [
        `"${programme.name}"`,
        `"${programme.type}"`,
        `"${startDate}"`,
        `"${endDate}"`,
        `"${programme.location}"`,
        `"${programme.coordinator}"`,
        programme.capacity,
        programme.currentAttendees,
        `"${programme.description}"`
      ].join(',') + "\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'church_programmes.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Programmes</h1>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Actions <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsProgrammeDialogOpen(true)}>
                Add New Programme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                View Attendance Reports
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportProgrammesToCSV}>
                Export Programmes (CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => setIsProgrammeDialogOpen(true)}>Add New Programme</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Programmes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{programmes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Programmes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {programmes.filter(p => !p.endDate || p.endDate > new Date()).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {programmes.reduce((acc, curr) => acc + curr.currentAttendees, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="all">All Programmes</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant={activeView === 'grid' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('grid')}
                  className="h-8"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button 
                  variant={activeView === 'analytics' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('analytics')}
                  className="h-8"
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button 
                  variant={activeView === 'calendar' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('calendar')}
                  className="h-8"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Tabs>
          
          <div className="flex w-full md:w-auto items-center gap-2">
            <Input
              placeholder="Search programmes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="counseling">Counseling</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => setIsReportDialogOpen(true)} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Reports
            </Button>
          </div>
        </div>

        {activeView === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredProgrammes.map((programme) => (
              <div key={programme.id} onClick={() => handleEditProgramme(programme)}>
                <ProgrammeCard
                  programme={programme}
                  onDeleteConfirm={handleDeleteProgramme}
                  onAttendanceClick={(id) => {
                    event?.stopPropagation();
                    openAttendanceDialog(id);
                  }}
                  getTypeBadgeColor={getTypeBadgeColor}
                />
              </div>
            ))}
          </div>
        )}

        {activeView === 'analytics' && (
          <div className="mt-4">
            <ProgrammesAnalytics programmes={programmes} />
          </div>
        )}

        {activeView === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-1">
              <CalendarView 
                programmes={programmes}
                onDateSelect={handleCalendarDateSelect}
              />
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedDate ? (
                      <>Programmes on {format(selectedDate, 'PPPP')}</>
                    ) : (
                      <>Select a Date</>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    programmesOnSelectedDate.length > 0 ? (
                      <div className="grid gap-4">
                        {programmesOnSelectedDate.map(programme => (
                          <div key={programme.id} className="border rounded-md p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{programme.name}</h3>
                                <p className="text-sm text-muted-foreground">{programme.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={cn("px-2 py-1 rounded-full text-xs", getTypeBadgeColor(programme.type))}>
                                  {programme.type}
                                </div>
                              </div>
                            </div>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Location:</span> {programme.location}
                              </div>
                              <div>
                                <span className="font-medium">Coordinator:</span> {programme.coordinator}
                              </div>
                              <div>
                                <span className="font-medium">Time:</span> {programme.recurring ? `Recurring (${programme.frequency})` : 'One-time'}
                              </div>
                              <div>
                                <span className="font-medium">Attendance:</span> {programme.currentAttendees}/{programme.capacity}
                              </div>
                            </div>
                            <div className="mt-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAttendanceDialog(programme.id);
                                }}
                              >
                                Record Attendance
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        No programmes scheduled for this date.
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Select a date from the calendar to view programmes.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isProgrammeDialogOpen} onOpenChange={setIsProgrammeDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <ProgrammeForm
            onSave={isEditMode ? handleUpdateProgramme : handleCreateProgramme}
            onCancel={() => {
              setIsProgrammeDialogOpen(false);
              setIsEditMode(false);
              setProgrammeToEdit(null);
            }}
            initialData={programmeToEdit || {}}
            isEditing={isEditMode}
          />
        </DialogContent>
      </Dialog>

      <Sheet open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Record Attendance</SheetTitle>
            <SheetDescription>
              Record attendance for the selected programme.
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Member</label>
              <Select 
                value={attendanceForm.memberId} 
                onValueChange={(value) => setAttendanceForm(prev => ({ ...prev, memberId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !attendanceForm.date && "text-muted-foreground"
                    )}
                  >
                    {attendanceForm.date ? (
                      format(attendanceForm.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={attendanceForm.date}
                    onSelect={(date) => date && setAttendanceForm(prev => ({ ...prev, date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPresent"
                checked={attendanceForm.isPresent}
                onChange={(e) => setAttendanceForm(prev => ({ ...prev, isPresent: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="isPresent"
                className="text-sm font-medium leading-none"
              >
                Present
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
              <textarea
                value={attendanceForm.notes}
                onChange={(e) => setAttendanceForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes about attendance"
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6 space-x-2 flex justify-end">
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAttendance} disabled={!attendanceForm.memberId}>Record Attendance</Button>
          </div>
        </SheetContent>
      </Sheet>

      <AttendanceReportDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        programmes={programmes}
        attendance={attendance}
        members={members}
      />
    </div>
  );
};

export default Programmes;
