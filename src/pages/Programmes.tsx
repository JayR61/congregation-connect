
import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { CalendarIcon, Users, GraduationCap, Heart, Church } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from '@/lib/toast';

interface Programme {
  id: string;
  name: string;
  description: string;
  type: 'ministry' | 'counseling' | 'service' | 'training' | 'outreach';
  startDate: Date;
  endDate?: Date;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  location: string;
  coordinator: string;
  capacity: number;
  currentAttendees: number;
  attendees: string[];
}

interface ProgrammeAttendance {
  id: string;
  programmeId: string;
  memberId: string;
  date: Date;
  isPresent: boolean;
  notes?: string;
}

const Programmes = () => {
  const { members } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isProgrammeDialogOpen, setIsProgrammeDialogOpen] = useState(false);
  const [isAttendanceDialogOpen, setIsAttendanceDialogOpen] = useState(false);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);
  
  // Temporary state for programmes - in a real app this would come from the backend
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

  // Form states
  const [programmeForm, setProgrammeForm] = useState({
    name: '',
    description: '',
    type: 'ministry',
    startDate: new Date(),
    endDate: undefined as Date | undefined,
    recurring: false,
    frequency: undefined as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | undefined,
    location: '',
    coordinator: '',
    capacity: 0
  });

  const [attendanceForm, setAttendanceForm] = useState({
    memberId: '',
    date: new Date(),
    isPresent: true,
    notes: ''
  });

  // Filter programmes based on search query and type filter
  const filteredProgrammes = programmes.filter(programme => {
    // Filter by search query
    const matchesSearch = 
      programme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      programme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      programme.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by type
    const matchesType = typeFilter === 'all' || programme.type === typeFilter;
    
    // Filter by tab
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'active' && (!programme.endDate || programme.endDate > new Date())) ||
      (activeTab === 'completed' && programme.endDate && programme.endDate < new Date());
    
    return matchesSearch && matchesType && matchesTab;
  });

  const handleCreateProgramme = () => {
    const newProgramme: Programme = {
      id: `prog-${programmes.length + 1}`,
      name: programmeForm.name,
      description: programmeForm.description,
      type: programmeForm.type as 'ministry' | 'counseling' | 'service' | 'training' | 'outreach',
      startDate: programmeForm.startDate,
      endDate: programmeForm.endDate,
      recurring: programmeForm.recurring,
      frequency: programmeForm.recurring ? programmeForm.frequency : undefined,
      location: programmeForm.location,
      coordinator: programmeForm.coordinator,
      capacity: programmeForm.capacity,
      currentAttendees: 0,
      attendees: []
    };

    setProgrammes(prev => [...prev, newProgramme]);
    setIsProgrammeDialogOpen(false);
    resetProgrammeForm();
    toast.success('Programme created successfully');
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
    
    // Update programme attendance
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

  const resetProgrammeForm = () => {
    setProgrammeForm({
      name: '',
      description: '',
      type: 'ministry',
      startDate: new Date(),
      endDate: undefined,
      recurring: false,
      frequency: undefined,
      location: '',
      coordinator: '',
      capacity: 0
    });
  };

  const resetAttendanceForm = () => {
    setAttendanceForm({
      memberId: '',
      date: new Date(),
      isPresent: true,
      notes: ''
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'ministry':
        return <Church className="h-4 w-4" />;
      case 'counseling':
        return <Heart className="h-4 w-4" />;
      case 'service':
        return <Church className="h-4 w-4" />;
      case 'training':
        return <GraduationCap className="h-4 w-4" />;
      case 'outreach':
        return <Users className="h-4 w-4" />;
      default:
        return <Church className="h-4 w-4" />;
    }
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Church Programmes</h1>
        <Button onClick={() => setIsProgrammeDialogOpen(true)}>Add New Programme</Button>
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
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="all">All Programmes</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <div className="flex space-x-2">
              <div className="w-64">
                <Input
                  placeholder="Search programmes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProgrammes.map((programme) => (
                <Card key={programme.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{programme.name}</CardTitle>
                      <Badge className={cn("ml-2", getTypeBadgeColor(programme.type))}>
                        <span className="flex items-center">
                          {getTypeIcon(programme.type)}
                          <span className="ml-1 capitalize">{programme.type}</span>
                        </span>
                      </Badge>
                    </div>
                    <CardDescription>{programme.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Start Date:</span>
                        <span className="text-sm">{format(programme.startDate, 'PPP')}</span>
                      </div>
                      {programme.endDate && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">End Date:</span>
                          <span className="text-sm">{format(programme.endDate, 'PPP')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm">{programme.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Coordinator:</span>
                        <span className="text-sm">{programme.coordinator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Attendance:</span>
                        <span className="text-sm">{programme.currentAttendees} / {programme.capacity}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openAttendanceDialog(programme.id)}
                    >
                      Record Attendance
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProgrammes.map((programme) => (
                <Card key={programme.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{programme.name}</CardTitle>
                      <Badge className={cn("ml-2", getTypeBadgeColor(programme.type))}>
                        <span className="flex items-center">
                          {getTypeIcon(programme.type)}
                          <span className="ml-1 capitalize">{programme.type}</span>
                        </span>
                      </Badge>
                    </div>
                    <CardDescription>{programme.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Start Date:</span>
                        <span className="text-sm">{format(programme.startDate, 'PPP')}</span>
                      </div>
                      {programme.endDate && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">End Date:</span>
                          <span className="text-sm">{format(programme.endDate, 'PPP')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm">{programme.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Coordinator:</span>
                        <span className="text-sm">{programme.coordinator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Attendance:</span>
                        <span className="text-sm">{programme.currentAttendees} / {programme.capacity}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openAttendanceDialog(programme.id)}
                    >
                      Record Attendance
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProgrammes.map((programme) => (
                <Card key={programme.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{programme.name}</CardTitle>
                      <Badge className={cn("ml-2", getTypeBadgeColor(programme.type))}>
                        <span className="flex items-center">
                          {getTypeIcon(programme.type)}
                          <span className="ml-1 capitalize">{programme.type}</span>
                        </span>
                      </Badge>
                    </div>
                    <CardDescription>{programme.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Start Date:</span>
                        <span className="text-sm">{format(programme.startDate, 'PPP')}</span>
                      </div>
                      {programme.endDate && (
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">End Date:</span>
                          <span className="text-sm">{format(programme.endDate, 'PPP')}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Location:</span>
                        <span className="text-sm">{programme.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Coordinator:</span>
                        <span className="text-sm">{programme.coordinator}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Attendance:</span>
                        <span className="text-sm">{programme.currentAttendees} / {programme.capacity}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openAttendanceDialog(programme.id)}
                    >
                      View Attendance
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Programme Dialog */}
      <Dialog open={isProgrammeDialogOpen} onOpenChange={setIsProgrammeDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Programme</DialogTitle>
            <DialogDescription>
              Enter the details for the new church programme.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormLabel htmlFor="name">Programme Name</FormLabel>
                <Input
                  id="name"
                  value={programmeForm.name}
                  onChange={(e) => setProgrammeForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter programme name"
                />
              </div>
              <div className="col-span-2">
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  value={programmeForm.description}
                  onChange={(e) => setProgrammeForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter programme description"
                />
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="type">Type</FormLabel>
                <Select 
                  value={programmeForm.type} 
                  onValueChange={(value) => setProgrammeForm(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ministry">Ministry</SelectItem>
                    <SelectItem value="counseling">Counseling</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="location">Location</FormLabel>
                <Input
                  id="location"
                  value={programmeForm.location}
                  onChange={(e) => setProgrammeForm(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Enter location"
                />
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="startDate">Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !programmeForm.startDate && "text-muted-foreground"
                        )}
                      >
                        {programmeForm.startDate ? (
                          format(programmeForm.startDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={programmeForm.startDate}
                      onSelect={(date) => date && setProgrammeForm(prev => ({ ...prev, startDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="endDate">End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !programmeForm.endDate && "text-muted-foreground"
                        )}
                      >
                        {programmeForm.endDate ? (
                          format(programmeForm.endDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={programmeForm.endDate}
                      onSelect={(date) => setProgrammeForm(prev => ({ ...prev, endDate: date || undefined }))}
                      initialFocus
                      disabled={(date) => date < programmeForm.startDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="coordinator">Coordinator</FormLabel>
                <Input
                  id="coordinator"
                  value={programmeForm.coordinator}
                  onChange={(e) => setProgrammeForm(prev => ({ ...prev, coordinator: e.target.value }))}
                  placeholder="Enter coordinator name"
                />
              </div>
              <div className="col-span-1">
                <FormLabel htmlFor="capacity">Capacity</FormLabel>
                <Input
                  id="capacity"
                  type="number"
                  value={programmeForm.capacity}
                  onChange={(e) => setProgrammeForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter capacity"
                />
              </div>
              <div className="col-span-2 flex items-center space-x-2">
                <Checkbox
                  id="recurring"
                  checked={programmeForm.recurring}
                  onCheckedChange={(checked) => setProgrammeForm(prev => ({ ...prev, recurring: checked === true }))}
                />
                <label
                  htmlFor="recurring"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Is this a recurring programme?
                </label>
              </div>
              {programmeForm.recurring && (
                <div className="col-span-2">
                  <FormLabel htmlFor="frequency">Frequency</FormLabel>
                  <Select 
                    value={programmeForm.frequency} 
                    onValueChange={(value) => setProgrammeForm(prev => ({ ...prev, frequency: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProgrammeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProgramme}>Create Programme</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Attendance Dialog */}
      <Dialog open={isAttendanceDialogOpen} onOpenChange={setIsAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Attendance</DialogTitle>
            <DialogDescription>
              Record attendance for the selected programme.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <FormLabel htmlFor="member">Member</FormLabel>
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
              <FormLabel htmlFor="attendanceDate">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
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
                  </FormControl>
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
              <Checkbox
                id="isPresent"
                checked={attendanceForm.isPresent}
                onCheckedChange={(checked) => setAttendanceForm(prev => ({ ...prev, isPresent: checked === true }))}
              />
              <label
                htmlFor="isPresent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Present
              </label>
            </div>
            <div>
              <FormLabel htmlFor="notes">Notes (Optional)</FormLabel>
              <Textarea
                id="notes"
                value={attendanceForm.notes}
                onChange={(e) => setAttendanceForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add notes about attendance"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAttendance}>Record Attendance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Programmes;
