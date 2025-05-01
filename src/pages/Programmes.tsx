import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown, Download, FileText, LineChart, BarChart3, Calendar, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from '@/lib/toast';
import { Programme, Member } from "@/types";
import { ProgrammeCard } from '@/components/programmes/ProgrammeCard';
import { ProgrammesAnalytics } from '@/components/programmes/ProgrammesAnalytics';
import { AttendanceReportDialog } from '@/components/programmes/AttendanceReportDialog';
import { CalendarView } from '@/components/programmes/CalendarView';
import { ProgrammeForm } from '@/components/programmes/ProgrammeForm';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { AttendanceDashboard } from '@/components/programmes/AttendanceDashboard';
import { ResourceManagement } from '@/components/programmes/ResourceManagement';
import { CategoryTagManager } from '@/components/programmes/CategoryTagManager';
import { TemplateManager } from '@/components/programmes/TemplateManager';
import { FeedbackManager } from '@/components/programmes/FeedbackManager';
import KPIManager from '@/components/programmes/KPIManager';
import { ReminderManager } from '@/components/programmes/ReminderManager';
import BulkAttendanceRecorder from '@/components/programmes/BulkAttendanceRecorder';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Programmes = () => {
  const { 
    programmes, attendance, members, addProgramme, updateProgramme, deleteProgramme, 
    recordAttendance, exportProgrammesToCSV, exportAttendanceToCSV, 
    resources: programmeResources, 
    categories: programmeCategories, 
    tags: programmeTags, 
    programmeTags: programmeProgrammeTags,
    feedback: programmeFeedback, 
    kpis: programmeKpis, 
    reminders: programmeReminders, 
    templates: programmeTemplates,
    addProgrammeCategory, addProgrammeTag, assignTagToProgramme, removeTagFromProgramme,
    allocateResource, updateResourceStatus, exportProgrammeToPDF, createProgrammeTemplate,
    createProgrammeFromTemplate, exportProgrammeToCalendar, addProgrammeFeedback,
    addProgrammeKPI, updateKPIProgress, createProgrammeReminder, checkAndSendReminders,
    recordBulkAttendance
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState("all");
  const [activeView, setActiveView] = useState<
    'grid' | 'analytics' | 'calendar' | 'dashboard' | 'resources' | 
    'categories' | 'templates' | 'feedback' | 'kpis' | 'reminders'
  >('grid');
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
      (activeTab === 'active' && (!programme.endDate || new Date(programme.endDate) > new Date())) ||
      (activeTab === 'completed' && programme.endDate && new Date(programme.endDate) < new Date());
    
    return matchesSearch && matchesType && matchesTab;
  });

  const handleCreateProgramme = (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => {
    addProgramme(programmeData);
    setIsProgrammeDialogOpen(false);
  };

  const handleUpdateProgramme = (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => {
    if (!programmeToEdit) return;
    
    updateProgramme(programmeToEdit.id, programmeData);
    setIsProgrammeDialogOpen(false);
    setIsEditMode(false);
    setProgrammeToEdit(null);
  };

  const handleAddAttendance = () => {
    if (!selectedProgrammeId) return;

    recordAttendance(
      selectedProgrammeId,
      attendanceForm.memberId,
      attendanceForm.date,
      attendanceForm.isPresent,
      attendanceForm.notes || ''
    );
    
    setIsAttendanceDialogOpen(false);
    resetAttendanceForm();
  };

  const handleDeleteProgramme = (programmeId: string) => {
    deleteProgramme(programmeId);
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

  const handleCalendarDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Filter programmes on the selected date
    const programmesList = programmes.filter(programme => {
      const startDate = new Date(programme.startDate);
      const endDate = programme.endDate ? new Date(programme.endDate) : null;
      
      // Check if the selected date falls within the programme dates
      return (
        date.getFullYear() === startDate.getFullYear() &&
        date.getMonth() === startDate.getMonth() &&
        date.getDate() === startDate.getDate()
      ) || (
        endDate &&
        date >= startDate &&
        date <= endDate
      );
    });
    
    setProgrammesOnSelectedDate(programmesList);
  };

  const handleEditProgramme = (programme: Programme) => {
    setProgrammeToEdit(programme);
    setIsEditMode(true);
    setIsProgrammeDialogOpen(true);
  };

  const handleExportPDF = (programmeId: string) => {
    exportProgrammeToPDF(programmeId);
  };

  const handleExportCalendar = (programmeId: string) => {
    exportProgrammeToCalendar(programmeId);
  };

  const renderFeatureSection = () => {
    switch (activeView) {
      case 'dashboard':
        return <AttendanceDashboard programmes={programmes} attendance={attendance} members={members} />;
      case 'resources':
        return (
          <div className="mt-4">
            <ResourceManagement 
              programmes={programmes} 
              resources={programmeResources}
              onAllocateResource={allocateResource}
              onUpdateStatus={updateResourceStatus}
            />
          </div>
        );
      case 'categories':
        return (
          <div className="mt-4">
            <CategoryTagManager 
              programmes={programmes}
              categories={programmeCategories}
              tags={programmeTags}
              programmeTags={programmeProgrammeTags}
              onAddCategory={addProgrammeCategory}
              onAddTag={addProgrammeTag}
              onAssignTag={assignTagToProgramme}
              onRemoveTag={removeTagFromProgramme}
            />
          </div>
        );
      case 'templates':
        return (
          <div className="mt-4">
            <TemplateManager 
              templates={programmeTemplates}
              onCreateTemplate={createProgrammeTemplate}
              onCreateFromTemplate={createProgrammeFromTemplate}
            />
          </div>
        );
      case 'feedback':
        return (
          <div className="mt-4">
            <FeedbackManager 
              programmes={programmes}
              feedback={programmeFeedback}
              members={members}
              onAddFeedback={addProgrammeFeedback}
            />
          </div>
        );
      case 'kpis':
        return (
          <div className="mt-4">
            <KPIManager 
              programmes={programmes}
              kpis={programmeKpis}
              onAddKPI={addProgrammeKPI}
              onUpdateKPI={updateKPIProgress}
            />
          </div>
        );
      case 'reminders':
        return (
          <div className="mt-4">
            <ReminderManager 
              programmes={programmes}
              reminders={programmeReminders}
              members={members}
              onAddReminder={createProgrammeReminder}
              onSendReminder={(id) => {
                toast.success("Reminder sent successfully");
                return true;
              }}
              onCancelReminder={(id) => {
                toast.success("Reminder cancelled");
                return true;
              }}
            />
          </div>
        );
      default:
        return null;
    }
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
              <DropdownMenuItem onClick={() => {
                setIsEditMode(false);
                setProgrammeToEdit(null);
                setIsProgrammeDialogOpen(true);
              }}>
                Add New Programme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                View Attendance Reports
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportProgrammesToCSV}>
                Export Programmes (CSV)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveView('dashboard')}>
                Attendance Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView('resources')}>
                Manage Resources
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView('categories')}>
                Categories & Tags
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView('templates')}>
                Programme Templates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView('feedback')}>
                Feedback Collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView('kpis')}>
                KPIs & Metrics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView('reminders')}>
                Reminders & Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={() => {
            setIsEditMode(false);
            setProgrammeToEdit(null);
            setIsProgrammeDialogOpen(true);
          }}>
            Add New Programme
          </Button>
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
              {programmes.filter(p => !p.endDate || new Date(p.endDate) > new Date()).length}
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
                  title="Card View"
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button 
                  variant={activeView === 'analytics' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('analytics')}
                  className="h-8"
                  title="Analytics"
                >
                  <LineChart className="h-4 w-4" />
                </Button>
                <Button 
                  variant={activeView === 'calendar' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('calendar')}
                  className="h-8"
                  title="Calendar"
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant={activeView === 'dashboard' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('dashboard')}
                  className="h-8"
                  title="Dashboard"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button 
                  variant={activeView === 'kpis' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveView('kpis')}
                  className="h-8"
                  title="KPIs"
                >
                  <Gauge className="h-4 w-4" />
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
                {programmes
                  .map(p => p.type)
                  .filter(type => !['ministry', 'counseling', 'service', 'training', 'outreach'].includes(type))
                  .filter((type, index, self) => self.indexOf(type) === index)
                  .map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Reports
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsReportDialogOpen(true)}>
                  Attendance Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportProgrammesToCSV}>
                  Export All Programmes (CSV)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveView('dashboard')}>
                  View Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <BulkAttendanceRecorder 
              programmes={programmes}
              members={members}
              onRecordBulkAttendance={recordBulkAttendance}
            />
          </div>
        </div>

        {['dashboard', 'resources', 'categories', 'templates', 'feedback', 'kpis', 'reminders'].includes(activeView) ? (
          renderFeatureSection()
        ) : activeView === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredProgrammes.length > 0 ? (
              filteredProgrammes.map((programme) => (
                <ProgrammeCard
                  key={programme.id}
                  programme={programme}
                  onDeleteConfirm={handleDeleteProgramme}
                  onAttendanceClick={openAttendanceDialog}
                  getTypeBadgeColor={getTypeBadgeColor}
                  onCardClick={handleEditProgramme}
                  onExportPDF={handleExportPDF}
                  onExportCalendar={handleExportCalendar}
                />
              ))
            ) : (
              <div className="col-span-3 p-8 text-center">
                <p className="text-muted-foreground mb-4">No programmes found.</p>
                <Button onClick={() => {
                  setIsEditMode(false);
                  setProgrammeToEdit(null);
                  setIsProgrammeDialogOpen(true);
                }}>
                  Add Your First Programme
                </Button>
              </div>
            )}
          </div>
        ) : activeView === 'analytics' ? (
          <div className="mt-4">
            <ProgrammesAnalytics programmes={programmes} />
          </div>
        ) : activeView === 'calendar' && (
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
                                onClick={() => openAttendanceDialog(programme.id)}
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

      <Dialog open={isProgrammeDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditMode(false);
          setProgrammeToEdit(null);
        }
        setIsProgrammeDialogOpen(open);
      }}>
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
                  <CalendarComponent
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
