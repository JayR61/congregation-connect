
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Programme } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, ListFilter, Calendar as CalendarIcon, BarChart2, Settings, UserPlus, ClipboardList } from 'lucide-react';
import { ProgrammeCard } from '@/components/programmes/ProgrammeCard';
import ProgrammeForm from '@/components/programmes/ProgrammeForm';
import { CalendarView } from '@/components/programmes/CalendarView';
import { ProgrammesAnalytics } from '@/components/programmes/ProgrammesAnalytics';
import { CategoryTagManager } from '@/components/programmes/CategoryTagManager';
import ResourceManagement from '@/components/programmes/ResourceManagement';
import AttendanceDashboard from '@/components/programmes/AttendanceDashboard';
import { AttendanceReportDialog } from '@/components/programmes/AttendanceReportDialog';
import { FeedbackManager } from '@/components/programmes/FeedbackManager';
import ReminderManager from '@/components/programmes/ReminderManager';
import TemplateManager from '@/components/programmes/TemplateManager';
import KPIManager from '@/components/programmes/KPIManager';
import { toast } from '@/lib/toast';
import BulkAttendanceRecorder from '@/components/programmes/BulkAttendanceRecorder';

const Programmes = () => {
  const { 
    programmes, 
    addProgramme, 
    updateProgramme, 
    deleteProgramme, 
    members,
    addProgrammeKPI,
    updateKPIProgress,
    recordBulkAttendance,
    addProgrammeFeedback,
    createProgrammeTemplate,
    createProgrammeFromTemplate,
    exportProgrammeToPDF,
    exportProgrammeToCalendar,
    createProgrammeReminder,
    addProgrammeCategory,
    addProgrammeTag,
    assignTagToProgramme,
    removeTagFromProgramme
  } = useAppContext();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isKpiDialogOpen, setIsKpiDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [isBulkAttendanceDialogOpen, setIsBulkAttendanceDialogOpen] = useState(false);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);
  
  const filteredProgrammes = programmes.filter(programme => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(programme.name) || searchRegex.test(programme.description);
    
    if (statusFilter === 'all') {
      return matchesSearch;
    } else {
      return matchesSearch && programme.status === statusFilter;
    }
  });
  
  const handleAddProgramme = () => {
    setSelectedProgramme(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };
  
  const handleEditProgramme = (programme: Programme) => {
    setSelectedProgramme(programme);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };
  
  const handleFormSubmit = (programmeData: Omit<Programme, 'id'>) => {
    if (isEditMode && selectedProgramme) {
      updateProgramme(selectedProgramme.id, programmeData);
      toast.success('Programme updated successfully!');
    } else {
      addProgramme(programmeData);
      toast.success('Programme added successfully!');
    }
    setIsDialogOpen(false);
  };
  
  const handleDeleteProgramme = (id: string) => {
    if (window.confirm('Are you sure you want to delete this programme?')) {
      deleteProgramme(id);
      toast.success('Programme deleted successfully!');
    }
  };
  
  const exportToCSV = () => {
    // Implement CSV export logic here
    console.log('Exporting programmes to CSV');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programmes</h1>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <ListFilter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programmes</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            placeholder="Search programmes..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={handleAddProgramme}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Programme
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Programmes</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Programme Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredProgrammes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProgrammes.map(programme => (
                <ProgrammeCard
                  key={programme.id}
                  programme={programme}
                  onEdit={() => handleEditProgramme(programme)}
                  onDelete={() => handleDeleteProgramme(programme.id)}
                  onAttendance={() => {
                    setSelectedProgrammeId(programme.id);
                    setIsAttendanceDialogOpen(true);
                  }}
                  onExportToPDF={() => exportProgrammeToPDF(programme.id)}
                  onExportToCalendar={() => exportProgrammeToCalendar(programme.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <h3 className="text-lg font-medium">No Programmes Found</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm || statusFilter !== 'all' 
                  ? "No programmes match your search criteria." 
                  : "There are no programmes yet. Add your first programme to get started."}
              </p>
              <Button onClick={handleAddProgramme} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Programme
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Programme Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarView programmes={filteredProgrammes} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Attendance Dashboard</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsBulkAttendanceDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Record Attendance
                </Button>
                <Button variant="outline" onClick={() => toast.success("Attendance data exported to CSV")}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <AttendanceDashboard programmes={filteredProgrammes} members={members} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Programme Analytics</CardTitle>
              <Button variant="outline" onClick={() => setIsKpiDialogOpen(true)}>
                <BarChart2 className="mr-2 h-4 w-4" />
                Manage KPIs
              </Button>
            </CardHeader>
            <CardContent>
              <ProgrammesAnalytics programmes={filteredProgrammes} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories & Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryTagManager 
                  onAddCategory={addProgrammeCategory}
                  onAddTag={addProgrammeTag}
                  onAssignTag={assignTagToProgramme}
                  onRemoveTag={removeTagFromProgramme}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Programme Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateManager
                  onCreateTemplate={createProgrammeTemplate}
                  onCreateFromTemplate={createProgrammeFromTemplate}
                />
                <Button onClick={() => setIsTemplateDialogOpen(true)} className="mt-4">
                  Manage Templates
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Feedback Management</CardTitle>
              </CardHeader>
              <CardContent>
                <FeedbackManager 
                  programmes={filteredProgrammes}
                  onAddFeedback={addProgrammeFeedback}
                />
                <Button onClick={() => setIsFeedbackDialogOpen(true)} className="mt-4">
                  Collect Feedback
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reminders & Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ReminderManager
                  onCreateReminder={createProgrammeReminder}
                  programmes={filteredProgrammes}
                  members={members}
                />
                <Button onClick={() => setIsReminderDialogOpen(true)} className="mt-4">
                  Manage Reminders
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resource Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ResourceManagement programmes={filteredProgrammes} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Programme' : 'Add Programme'}</DialogTitle>
          </DialogHeader>
          <ProgrammeForm
            programme={selectedProgramme}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {selectedProgrammeId && (
        <>
          <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Attendance Report</DialogTitle>
              </DialogHeader>
              <AttendanceReportDialog 
                programmeId={selectedProgrammeId} 
                onClose={() => setIsAttendanceDialogOpen(false)} 
              />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isKpiDialogOpen} onOpenChange={setIsKpiDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>KPI Management</DialogTitle>
              </DialogHeader>
              <KPIManager 
                programmeId={selectedProgrammeId} 
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsKpiDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isBulkAttendanceDialogOpen} onOpenChange={setIsBulkAttendanceDialogOpen}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Record Attendance</DialogTitle>
              </DialogHeader>
              <BulkAttendanceRecorder 
                programmeId={selectedProgrammeId}
                onSaveComplete={() => setIsBulkAttendanceDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default Programmes;
