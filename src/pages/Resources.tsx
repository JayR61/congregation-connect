
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ChurchResource, ResourceBooking, Member } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Download,
  Filter,
  Info,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Tag,
  User,
  XCircle,
  BarChart,
  FileText,
  Clock
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/lib/toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatCurrency } from '@/lib/mockDataHelpers';
import { format, addDays, differenceInDays } from 'date-fns';

const Resources = () => {
  const { members, updateMember } = useAppContext();
  
  // Dialog states
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
  const [isStatsDialogOpen, setIsStatsDialogOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRangeFilter, setDateRangeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  
  // Custom date range for bookings
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);
  
  // Resource maintenance dialog
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [selectedResourceForMaintenance, setSelectedResourceForMaintenance] = useState<string | null>(null);
  const [maintenanceDetails, setMaintenanceDetails] = useState({ 
    date: new Date(),
    notes: '',
    cost: 0
  });
  
  // Resources data
  const [resources, setResources] = useState<ChurchResource[]>([
    {
      id: 'res-1',
      name: 'Main Sanctuary',
      type: 'room',
      description: 'Main church sanctuary for services',
      location: 'Main Building, 1st Floor',
      status: 'available',
      category: 'Worship Space',
      acquisitionDate: new Date('2000-01-01')
    },
    {
      id: 'res-2',
      name: 'Projector',
      type: 'equipment',
      description: 'HD Projector for presentations',
      location: 'Media Room',
      status: 'in-use',
      category: 'Audio/Visual',
      currentAssigneeId: members[0]?.id,
      acquisitionDate: new Date('2021-03-15')
    },
    {
      id: 'res-3',
      name: 'Church Van',
      type: 'vehicle',
      description: '15-passenger van for church activities',
      location: 'Church Parking Lot',
      status: 'maintenance',
      category: 'Transportation',
      maintenanceSchedule: new Date('2023-07-30'),
      acquisitionDate: new Date('2018-06-10'),
      maintenanceHistory: [
        { date: new Date('2022-07-30'), notes: 'Oil change and tire rotation', cost: 800 }
      ]
    },
    {
      id: 'res-4',
      name: 'Fellowship Hall',
      type: 'room',
      description: 'Large hall for church gatherings and events',
      location: 'Main Building, Ground Floor',
      status: 'available',
      category: 'Meeting Space',
      acquisitionDate: new Date('2000-01-01')
    },
    {
      id: 'res-5',
      name: 'Sound System',
      type: 'equipment',
      description: 'Professional sound system for worship services',
      location: 'Sanctuary',
      status: 'available',
      category: 'Audio/Visual',
      acquisitionDate: new Date('2019-05-20')
    }
  ]);
  
  // Bookings data
  const [bookings, setBookings] = useState<ResourceBooking[]>([
    {
      id: 'book-1',
      resourceId: 'res-1',
      memberId: members[0]?.id || '',
      purpose: 'Youth Group Meeting',
      startDateTime: new Date('2023-07-15T18:00:00'),
      endDateTime: new Date('2023-07-15T20:00:00'),
      status: 'approved'
    },
    {
      id: 'book-2',
      resourceId: 'res-2',
      memberId: members[0]?.id || '',
      purpose: 'Board Presentation',
      startDateTime: new Date('2023-07-20T14:00:00'),
      endDateTime: new Date('2023-07-20T16:00:00'),
      status: 'pending'
    },
    {
      id: 'book-3',
      resourceId: 'res-4',
      memberId: members[1]?.id || '',
      purpose: 'Community Lunch',
      startDateTime: new Date('2023-07-22T12:00:00'),
      endDateTime: new Date('2023-07-22T14:00:00'),
      status: 'approved'
    }
  ]);
  
  // Category options for resources
  const resourceCategories = [
    'Worship Space',
    'Meeting Space',
    'Audio/Visual',
    'Transportation',
    'Kitchen',
    'Office',
    'Children',
    'Youth',
    'Other'
  ];
  
  // Form states
  const [resourceForm, setResourceForm] = useState<Partial<ChurchResource>>({
    name: '',
    type: 'room',
    description: '',
    location: '',
    status: 'available',
    category: 'Worship Space'
  });
  
  const [bookingForm, setBookingForm] = useState<Partial<ResourceBooking>>({
    resourceId: '',
    memberId: '',
    purpose: '',
    startDateTime: new Date(),
    endDateTime: new Date(new Date().setHours(new Date().getHours() + 2)),
    status: 'pending'
  });

  // Filter resources based on search and type
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesAvailability = availabilityFilter === 'all' || resource.status === availabilityFilter;
    
    return matchesSearch && matchesType && matchesCategory && matchesAvailability;
  });
  
  // Filter bookings based on search, date range, and other filters
  const filteredBookings = bookings.filter(booking => {
    const resource = resources.find(r => r.id === booking.resourceId);
    const member = members.find(m => m.id === booking.memberId);
    
    const matchesSearch = 
      (resource?.name.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (member?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (member?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      booking.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filtering
    let matchesDate = true;
    const bookingDate = new Date(booking.startDateTime);
    
    switch(dateRangeFilter) {
      case 'today':
        matchesDate = format(bookingDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
        break;
      case 'this-week':
        const today = new Date();
        const endOfWeek = addDays(today, 7);
        matchesDate = bookingDate >= today && bookingDate <= endOfWeek;
        break;
      case 'this-month':
        matchesDate = 
          bookingDate.getMonth() === new Date().getMonth() && 
          bookingDate.getFullYear() === new Date().getFullYear();
        break;
      case 'custom':
        if (startDateFilter && endDateFilter) {
          matchesDate = bookingDate >= startDateFilter && bookingDate <= endDateFilter;
        }
        break;
      default: // 'all'
        matchesDate = true;
    }
    
    return matchesSearch && matchesDate;
  });
  
  // Calculate resource utilization stats
  const getResourceStats = () => {
    const totalResources = resources.length;
    const availableResources = resources.filter(r => r.status === 'available').length;
    const inUseResources = resources.filter(r => r.status === 'in-use' || r.status === 'reserved').length;
    const maintenanceResources = resources.filter(r => r.status === 'maintenance').length;
    
    const bookingsThisMonth = bookings.filter(b => {
      const bookingDate = new Date(b.startDateTime);
      return bookingDate.getMonth() === new Date().getMonth() && 
             bookingDate.getFullYear() === new Date().getFullYear();
    }).length;
    
    const approvedBookings = bookings.filter(b => b.status === 'approved').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    
    // Calculate most booked resource
    const resourceBookingCounts: {[key: string]: number} = {};
    bookings.forEach(booking => {
      if (resourceBookingCounts[booking.resourceId]) {
        resourceBookingCounts[booking.resourceId]++;
      } else {
        resourceBookingCounts[booking.resourceId] = 1;
      }
    });
    
    let mostBookedResourceId = '';
    let mostBookingCount = 0;
    
    Object.entries(resourceBookingCounts).forEach(([resourceId, count]) => {
      if (count > mostBookingCount) {
        mostBookedResourceId = resourceId;
        mostBookingCount = count;
      }
    });
    
    const mostBookedResource = resources.find(r => r.id === mostBookedResourceId);
    
    return {
      totalResources,
      availableResources,
      inUseResources,
      maintenanceResources,
      bookingsThisMonth,
      approvedBookings,
      pendingBookings,
      mostBookedResource: mostBookedResource?.name || 'None',
      mostBookingCount
    };
  };

  // Handler to add a new resource
  const handleAddResource = () => {
    if (!resourceForm.name || !resourceForm.type || !resourceForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newResource: ChurchResource = {
      id: `res-${Date.now()}`,
      name: resourceForm.name,
      type: resourceForm.type as 'room' | 'equipment' | 'vehicle' | 'other',
      description: resourceForm.description,
      location: resourceForm.location,
      category: resourceForm.category || 'Other',
      status: resourceForm.status as 'available' | 'in-use' | 'maintenance' | 'reserved',
      acquisitionDate: resourceForm.acquisitionDate || new Date(),
      currentAssigneeId: resourceForm.currentAssigneeId,
      maintenanceSchedule: resourceForm.maintenanceSchedule,
      notes: resourceForm.notes
    };

    setResources(prev => [...prev, newResource]);
    toast.success("Resource added successfully");
    setIsResourceDialogOpen(false);
    setResourceForm({
      name: '',
      type: 'room',
      description: '',
      location: '',
      category: 'Worship Space',
      status: 'available'
    });
  };

  // Handler to add a new booking
  const handleAddBooking = () => {
    if (!bookingForm.resourceId || !bookingForm.memberId || !bookingForm.purpose || 
        !bookingForm.startDateTime || !bookingForm.endDateTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newBooking: ResourceBooking = {
      id: `book-${Date.now()}`,
      resourceId: bookingForm.resourceId,
      memberId: bookingForm.memberId,
      purpose: bookingForm.purpose,
      startDateTime: new Date(bookingForm.startDateTime),
      endDateTime: new Date(bookingForm.endDateTime),
      status: 'pending',
      notes: bookingForm.notes
    };

    setBookings(prev => [...prev, newBooking]);
    
    setResources(prev => prev.map(resource => 
      resource.id === bookingForm.resourceId 
        ? { ...resource, status: 'reserved' } 
        : resource
    ));

    toast.success("Booking request submitted successfully");
    setIsBookingDialogOpen(false);
    setBookingForm({
      resourceId: '',
      memberId: '',
      purpose: '',
      startDateTime: new Date(),
      endDateTime: new Date(new Date().setHours(new Date().getHours() + 2)),
      status: 'pending'
    });
  };

  // Handler to schedule maintenance
  const handleScheduleMaintenance = () => {
    if (!selectedResourceForMaintenance || !maintenanceDetails.date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setResources(prev => prev.map(resource => {
      if (resource.id === selectedResourceForMaintenance) {
        // Add to maintenance history if it exists, or create a new array
        const updatedHistory = resource.maintenanceHistory 
          ? [...resource.maintenanceHistory, { 
              date: maintenanceDetails.date, 
              notes: maintenanceDetails.notes, 
              cost: maintenanceDetails.cost 
            }] 
          : [{ 
              date: maintenanceDetails.date, 
              notes: maintenanceDetails.notes, 
              cost: maintenanceDetails.cost 
            }];
            
        return {
          ...resource,
          status: 'maintenance',
          maintenanceSchedule: maintenanceDetails.date,
          maintenanceHistory: updatedHistory
        };
      }
      return resource;
    }));
    
    toast.success("Maintenance scheduled successfully");
    setIsMaintenanceDialogOpen(false);
    setSelectedResourceForMaintenance(null);
    setMaintenanceDetails({ 
      date: new Date(),
      notes: '',
      cost: 0
    });
  };

  // Handlers for booking approval and rejection
  const approveBooking = (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'approved' } 
        : booking
    ));
    toast.success("Booking approved");
  };

  const rejectBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookings(prev => prev.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'rejected' } 
          : b
      ));
      
      setResources(prev => prev.map(resource => 
        resource.id === booking.resourceId 
          ? { ...resource, status: 'available' } 
          : resource
      ));
      
      toast.success("Booking rejected");
    }
  };

  // Helper function to format dates
  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to generate status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Available</Badge>;
      case 'in-use':
        return <Badge variant="warning">In Use</Badge>;
      case 'maintenance':
        return <Badge variant="destructive">Maintenance</Badge>;
      case 'reserved':
        return <Badge variant="secondary">Reserved</Badge>;
      case 'approved':
        return <Badge variant="success">Approved</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Export resource data to CSV
  const exportResourcesCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    csvContent += "Name,Type,Category,Description,Location,Status,Acquisition Date\n";
    
    // Add each resource
    resources.forEach(resource => {
      const row = [
        resource.name,
        resource.type,
        resource.category || "N/A",
        resource.description,
        resource.location || "N/A",
        resource.status,
        resource.acquisitionDate ? format(new Date(resource.acquisitionDate), 'yyyy-MM-dd') : "N/A"
      ].map(cell => `"${cell}"`).join(",");
      
      csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `church-resources-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    
    // Trigger download and cleanup
    link.click();
    document.body.removeChild(link);
    
    toast.success("Resource data exported successfully");
  };
  
  // Export bookings data to CSV
  const exportBookingsCSV = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    csvContent += "Resource,Requester,Purpose,Start Date/Time,End Date/Time,Status\n";
    
    // Add each booking
    bookings.forEach(booking => {
      const resource = resources.find(r => r.id === booking.resourceId);
      const member = members.find(m => m.id === booking.memberId);
      
      const row = [
        resource?.name || "Unknown",
        member ? `${member.firstName} ${member.lastName}` : "Unknown",
        booking.purpose,
        format(new Date(booking.startDateTime), 'yyyy-MM-dd HH:mm'),
        format(new Date(booking.endDateTime), 'yyyy-MM-dd HH:mm'),
        booking.status
      ].map(cell => `"${cell}"`).join(",");
      
      csvContent += row + "\n";
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `resource-bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    
    // Trigger download and cleanup
    link.click();
    document.body.removeChild(link);
    
    toast.success("Booking data exported successfully");
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Church Resources</h1>
          <p className="text-muted-foreground">Manage and book church resources</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
                <DialogDescription>
                  Add a new resource to the church inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={resourceForm.name}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={resourceForm.type} 
                      onValueChange={(value) => setResourceForm(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="room">Room</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={resourceForm.category} 
                      onValueChange={(value) => setResourceForm(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {resourceCategories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={resourceForm.description}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, description: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={resourceForm.location}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, location: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={resourceForm.status} 
                      onValueChange={(value) => setResourceForm(prev => ({ ...prev, status: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="in-use">In Use</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="reserved">Reserved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="acquisition" className="text-right">
                    Acquisition Date
                  </Label>
                  <Input
                    id="acquisition"
                    type="date"
                    value={resourceForm.acquisitionDate ? new Date(resourceForm.acquisitionDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, acquisitionDate: e.target.value ? new Date(e.target.value) : undefined }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={resourceForm.notes}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResourceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddResource}>
                  Add Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="mr-2 h-4 w-4" /> Book Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Book a Resource</DialogTitle>
                <DialogDescription>
                  Reserve a church resource for your event or activity
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="resource" className="text-right">
                    Resource
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={bookingForm.resourceId} 
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, resourceId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a resource" />
                      </SelectTrigger>
                      <SelectContent>
                        {resources
                          .filter(r => r.status === 'available')
                          .map(resource => (
                            <SelectItem key={resource.id} value={resource.id}>
                              {resource.name} ({resource.type})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="member" className="text-right">
                    Requester
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={bookingForm.memberId} 
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, memberId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select requester" />
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
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="purpose" className="text-right">
                    Purpose
                  </Label>
                  <Input
                    id="purpose"
                    value={bookingForm.purpose}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, purpose: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., Youth Meeting, Choir Practice"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDateTime" className="text-right">
                    Start Date/Time
                  </Label>
                  <Input
                    id="startDateTime"
                    type="datetime-local"
                    value={bookingForm.startDateTime ? new Date(bookingForm.startDateTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, startDateTime: new Date(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDateTime" className="text-right">
                    End Date/Time
                  </Label>
                  <Input
                    id="endDateTime"
                    type="datetime-local"
                    value={bookingForm.endDateTime ? new Date(bookingForm.endDateTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, endDateTime: new Date(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="col-span-3"
                    placeholder="Additional requests or information"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBooking}>
                  Submit Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="mr-2 h-4 w-4" /> Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Resource Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setIsStatsDialogOpen(true)}>
                <BarChart className="mr-2 h-4 w-4" /> View Statistics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportResourcesCSV}>
                <Download className="mr-2 h-4 w-4" /> Export Resources
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportBookingsCSV}>
                <Download className="mr-2 h-4 w-4" /> Export Bookings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCalendarViewOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" /> Calendar View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center space-x-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="room">Rooms</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="vehicle">Vehicles</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {resourceCategories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="resources" className="mb-6">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources" className="mt-4">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map(resource => (
                <Card key={resource.id} className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{resource.name}</CardTitle>
                      {getStatusBadge(resource.status)}
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="mr-1">
                          {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                        </Badge>
                        {resource.category && (
                          <Badge variant="secondary" className="mr-1">
                            {resource.category}
                          </Badge>
                        )}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm">{resource.description}</p>
                      
                      {resource.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{resource.location}</span>
                        </div>
                      )}
                      
                      {resource.currentAssigneeId && (
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Assigned to: </span>
                          <span className="ml-1 font-medium">
                            {(() => {
                              const assignee = members.find(m => m.id === resource.currentAssigneeId);
                              return assignee ? `${assignee.firstName} ${assignee.lastName}` : 'Unknown';
                            })()}
                          </span>
                        </div>
                      )}
                      
                      {resource.maintenanceSchedule && (
                        <div className="flex items-center text-sm">
                          <Settings className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Maintenance: </span>
                          <span className="ml-1">
                            {new Date(resource.maintenanceSchedule).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {resource.acquisitionDate && (
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>Acquired: </span>
                          <span className="ml-1">
                            {new Date(resource.acquisitionDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => {
                            setBookingForm(prev => ({ ...prev, resourceId: resource.id }));
                            setIsBookingDialogOpen(true);
                          }}
                          disabled={resource.status !== 'available'}
                        >
                          <Calendar className="mr-2 h-4 w-4" /> Book Resource
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedResourceForMaintenance(resource.id);
                            setIsMaintenanceDialogOpen(true);
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" /> Schedule Maintenance
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Info className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setBookingForm(prev => ({ ...prev, resourceId: resource.id }));
                        setIsBookingDialogOpen(true);
                      }}
                      disabled={resource.status !== 'available'}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">No Resources Found</h3>
              <p className="text-muted-foreground mt-2">
                No resources match your search criteria.
              </p>
              <Button onClick={() => setIsResourceDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-4">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-6 bg-background rounded-lg p-3 border">
            <div className="flex gap-2 items-center">
              <Label>Filter by date:</Label>
              <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
              {dateRangeFilter === 'custom' && (
                <div className="flex gap-2 items-center">
                  <Input
                    type="date"
                    value={startDateFilter ? format(startDateFilter, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setStartDateFilter(e.target.value ? new Date(e.target.value) : null)}
                    className="w-auto"
                  />
                  <span>to</span>
                  <Input
                    type="date"
                    value={endDateFilter ? format(endDateFilter, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setEndDateFilter(e.target.value ? new Date(e.target.value) : null)}
                    className="w-auto"
                  />
                </div>
              )}
            </div>
            
            <Button variant="outline" size="sm" onClick={exportBookingsCSV}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
          
          {filteredBookings.length > 0 ? (
            <>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resource</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBookings.map(booking => {
                      const resource = resources.find(r => r.id === booking.resourceId);
                      const member = members.find(m => m.id === booking.memberId);
                      
                      return (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {resource?.name || 'Unknown Resource'}
                            <div className="text-xs text-muted-foreground">
                              {resource?.type || ''}
                            </div>
                          </TableCell>
                          <TableCell>{booking.purpose}</TableCell>
                          <TableCell>
                            {member ? `${member.firstName} ${member.lastName}` : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <div>
                              {format(new Date(booking.startDateTime), 'MMM d, yyyy')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(booking.startDateTime), 'h:mm a')} - {format(new Date(booking.endDateTime), 'h:mm a')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Duration: {Math.round(
                                (new Date(booking.endDateTime).getTime() - new Date(booking.startDateTime).getTime()) / 
                                (1000 * 60)
                              )} min
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            {booking.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => approveBooking(booking.id)}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => rejectBooking(booking.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                            {booking.status === 'approved' && (
                              <Button variant="outline" size="sm" className="w-full">
                                <ClipboardList className="h-4 w-4 mr-1" />
                                Mark Complete
                              </Button>
                            )}
                            {(booking.status === 'rejected' || booking.status === 'completed') && (
                              <Button variant="ghost" size="sm" className="w-full">
                                <Info className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">No Bookings Found</h3>
              <p className="text-muted-foreground mt-2">
                No resource bookings match your search criteria.
              </p>
              <Button onClick={() => setIsBookingDialogOpen(true)} className="mt-4">
                <Calendar className="mr-2 h-4 w-4" /> Book Resource
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Maintenance Schedule</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources
              .filter(r => r.status === 'maintenance' || r.maintenanceSchedule)
              .map(resource => (
                <Card key={resource.id} className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{resource.name}</CardTitle>
                      {getStatusBadge(resource.status)}
                    </div>
                    <CardDescription>
                      <Badge variant="outline" className="mr-1">
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {resource.maintenanceSchedule && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>Scheduled: </span>
                        <span className="ml-1 font-medium">
                          {new Date(resource.maintenanceSchedule).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {resource.maintenanceHistory && resource.maintenanceHistory.length > 0 && (
                      <div>
                        <div className="font-medium text-sm mb-1">Maintenance History:</div>
                        <div className="space-y-2">
                          {resource.maintenanceHistory.slice(0, 2).map((record, idx) => (
                            <div key={idx} className="text-xs border-l-2 border-muted pl-2">
                              <div className="flex justify-between">
                                <span>{new Date(record.date).toLocaleDateString()}</span>
                                <span>{formatCurrency(record.cost)}</span>
                              </div>
                              <div className="text-muted-foreground">{record.notes}</div>
                            </div>
                          ))}
                          
                          {resource.maintenanceHistory.length > 2 && (
                            <Button variant="ghost" size="sm" className="w-full text-xs">
                              View all {resource.maintenanceHistory.length} records
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedResourceForMaintenance(resource.id);
                        setIsMaintenanceDialogOpen(true);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Schedule Maintenance
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
            {resources.filter(r => r.status === 'maintenance' || r.maintenanceSchedule).length === 0 && (
              <div className="col-span-full text-center py-12">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No Maintenance Scheduled</h3>
                <p className="text-muted-foreground mt-2">
                  No resources are currently scheduled for maintenance.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Maintenance Scheduling Dialog */}
      <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Maintenance</DialogTitle>
            <DialogDescription>
              Schedule maintenance for a church resource
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenance-resource" className="text-right">
                Resource
              </Label>
              <div className="col-span-3">
                <Select 
                  value={selectedResourceForMaintenance || ''} 
                  onValueChange={setSelectedResourceForMaintenance}
                  disabled={selectedResourceForMaintenance !== null}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {resources.map(resource => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.name} ({resource.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenance-date" className="text-right">
                Date
              </Label>
              <Input
                id="maintenance-date"
                type="date"
                value={maintenanceDetails.date ? format(maintenanceDetails.date, 'yyyy-MM-dd') : ''}
                onChange={(e) => setMaintenanceDetails(prev => ({ 
                  ...prev, 
                  date: e.target.value ? new Date(e.target.value) : new Date()
                }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenance-cost" className="text-right">
                Estimated Cost
              </Label>
              <Input
                id="maintenance-cost"
                type="number"
                value={maintenanceDetails.cost.toString()}
                onChange={(e) => setMaintenanceDetails(prev => ({ 
                  ...prev, 
                  cost: Number(e.target.value) || 0
                }))}
                className="col-span-3"
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maintenance-notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="maintenance-notes"
                value={maintenanceDetails.notes}
                onChange={(e) => setMaintenanceDetails(prev => ({ ...prev, notes: e.target.value }))}
                className="col-span-3"
                placeholder="Details about the maintenance"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleMaintenance}>
              Schedule Maintenance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Statistics Dialog */}
      <Dialog open={isStatsDialogOpen} onOpenChange={setIsStatsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Resource Statistics</DialogTitle>
            <DialogDescription>
              Overview of resource utilization and bookings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Resources Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Resources:</span>
                    <span className="font-bold">{getResourceStats().totalResources}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Available:</span>
                    <span className="font-bold">{getResourceStats().availableResources}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>In Use/Reserved:</span>
                    <span className="font-bold">{getResourceStats().inUseResources}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Under Maintenance:</span>
                    <span className="font-bold">{getResourceStats().maintenanceResources}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Booking Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Bookings:</span>
                    <span className="font-bold">{bookings.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>This Month:</span>
                    <span className="font-bold">{getResourceStats().bookingsThisMonth}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pending Approval:</span>
                    <span className="font-bold">{getResourceStats().pendingBookings}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Approved:</span>
                    <span className="font-bold">{getResourceStats().approvedBookings}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Most Booked Resource:</span>
                    <span className="font-bold">{getResourceStats().mostBookedResource}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Booked {getResourceStats().mostBookingCount} times
                  </div>
                </div>
                
                <div className="pt-2">
                  <div className="text-sm font-medium mb-2">Resource Type Distribution</div>
                  <div className="space-y-2">
                    {['room', 'equipment', 'vehicle', 'other'].map(type => {
                      const count = resources.filter(r => r.type === type).length;
                      const percentage = resources.length > 0 ? Math.round((count / resources.length) * 100) : 0;
                      
                      return (
                        <div key={type} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="capitalize">{type}s:</span>
                            <span>{count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-secondary/20 rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsStatsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Calendar View Dialog */}
      <Dialog open={isCalendarViewOpen} onOpenChange={setIsCalendarViewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Resource Calendar</DialogTitle>
            <DialogDescription>
              View resource bookings in calendar format
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <Button variant="outline" size="sm">
                  <ChevronRight className="rotate-180 h-4 w-4 mr-1" /> Previous Week
                </Button>
                <h3 className="text-lg font-medium">
                  {format(new Date(), 'MMMM d, yyyy')} - {format(addDays(new Date(), 7), 'MMMM d, yyyy')}
                </h3>
                <Button variant="outline" size="sm">
                  Next Week <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-8 gap-1">
                <div className="text-center font-medium p-2">Time</div>
                {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => (
                  <div key={dayOffset} className="text-center font-medium p-2">
                    {format(addDays(new Date(), dayOffset), 'EEE dd')}
                  </div>
                ))}
                
                {/* Calendar time slots */}
                {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((hour) => (
                  <React.Fragment key={hour}>
                    <div className="text-center text-sm p-2 border-t">
                      {hour === 12 ? '12:00 PM' : hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}
                    </div>
                    {[0, 1, 2, 3, 4, 5, 6].map((dayOffset) => {
                      const currentDate = addDays(new Date(), dayOffset);
                      currentDate.setHours(hour, 0, 0, 0);
                      
                      // Find bookings for this time slot
                      const matchingBookings = bookings.filter(booking => {
                        const start = new Date(booking.startDateTime);
                        const end = new Date(booking.endDateTime);
                        return start.getDate() === currentDate.getDate() && 
                               start.getMonth() === currentDate.getMonth() &&
                               ((start.getHours() <= hour && end.getHours() > hour) || 
                                (start.getHours() === hour));
                      });
                      
                      return (
                        <div 
                          key={dayOffset} 
                          className={`border-t min-h-[3rem] ${matchingBookings.length > 0 ? 'bg-primary/5' : ''}`}
                        >
                          {matchingBookings.map((booking, idx) => {
                            const resource = resources.find(r => r.id === booking.resourceId);
                            return (
                              <div 
                                key={booking.id} 
                                className="m-0.5 p-1 text-xs rounded bg-primary/20 border-l-4 border-primary cursor-pointer hover:bg-primary/30"
                                title={`${resource?.name}: ${booking.purpose}`}
                              >
                                {resource?.name}: {booking.purpose.length > 15 ? `${booking.purpose.slice(0, 15)}...` : booking.purpose}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsCalendarViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resources;
