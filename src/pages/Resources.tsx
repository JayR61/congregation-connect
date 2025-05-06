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
import { ChurchResource, ResourceBooking, Member, ResourceCategory, ResourceHealthLog, ResourceInventoryAlert } from "@/types";
import { AttendanceRecord } from "@/types/attendance.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Download,
  Filter,
  Image,
  Info,
  LineChart,
  MapPin,
  Plus,
  QrCode,
  Search,
  Settings,
  Shield,
  Tag,
  Thermometer,
  User,
  Users,
  Wallet,
  XCircle
} from "lucide-react";
import { toast } from '@/lib/toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import ResourceCalendar from '@/components/resources/ResourceCalendar';
import ResourceStatistics from '@/components/resources/ResourceStatistics';
import ResourceImageGallery from '@/components/resources/ResourceImageGallery';
import ResourceAttendanceTracker from '@/components/resources/ResourceAttendanceTracker';
import ResourceHealthMonitor from '@/components/resources/ResourceHealthMonitor';
import ResourceCategoryManager from '@/components/resources/ResourceCategoryManager';
import ResourceCheckInSystem from '@/components/resources/ResourceCheckInSystem';

// Import mock data from our new file
import { 
  mockResources, 
  mockResourceBookings, 
  mockAttendance, 
  mockResourceCategories, 
  mockHealthLogs, 
  mockInventoryAlerts 
} from '@/data/resource-attendance-data';

const Resources = () => {
  const { members, updateMember } = useAppContext();
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [resourceView, setResourceView] = useState<'grid' | 'calendar' | 'stats' | 'gallery' | 'health' | 'attendance' | 'categories' | 'checkin' | 'approval' | 'reports'>('grid');
  
  const [resources, setResources] = useState<ChurchResource[]>(mockResources);
  const [bookings, setBookings] = useState<ResourceBooking[]>(mockResourceBookings);
  const [attendance, setAttendance] = useState(mockAttendance);
  const [categories, setCategories] = useState(mockResourceCategories);
  const [healthLogs, setHealthLogs] = useState(mockHealthLogs);
  const [inventoryAlerts, setInventoryAlerts] = useState(mockInventoryAlerts);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<'usage' | 'inventory' | 'maintenance' | 'financial'>('usage');
  
  const [resourceForm, setResourceForm] = useState<Partial<ChurchResource>>({
    name: '',
    type: 'room',
    description: '',
    location: '',
    status: 'available',
    imageUrl: '',
    category: '',
    healthStatus: 100,
    inventoryCount: 1,
    minimumInventory: 1,
    purchasePrice: 0,
    currentValue: 0
  });
  
  const [bookingForm, setBookingForm] = useState<Partial<ResourceBooking>>({
    resourceId: '',
    memberId: '',
    purpose: '',
    startDate: new Date(),
    endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
    status: 'pending',
    notes: ''
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
    const matchesLocation = locationFilter === 'all' || resource.location === locationFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });
  
  const filteredBookings = bookings.filter(booking => {
    const resource = resources.find(r => r.id === booking.resourceId);
    const member = members.find(m => m.id === booking.memberId);
    
    return resource && 
      (resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.purpose.toLowerCase().includes(searchQuery.toLowerCase()));
  });

  // Get unique locations for filtering
  const uniqueLocations = Array.from(new Set(resources.map(r => r.location))).filter(Boolean);

  const handleAddResource = () => {
    if (!resourceForm.name || !resourceForm.type || !resourceForm.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newResource: ChurchResource = {
      id: `res-${Date.now()}`,
      name: resourceForm.name,
      type: resourceForm.type as string,
      description: resourceForm.description,
      location: resourceForm.location,
      status: resourceForm.status as 'available' | 'in-use' | 'maintenance' | 'reserved',
      acquisitionDate: resourceForm.acquisitionDate,
      currentAssigneeId: resourceForm.currentAssigneeId,
      maintenanceSchedule: resourceForm.maintenanceSchedule,
      notes: resourceForm.notes,
      imageUrl: resourceForm.imageUrl || 'https://source.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
      category: resourceForm.category,
      healthStatus: resourceForm.healthStatus || 100,
      inventoryCount: resourceForm.inventoryCount || 1,
      minimumInventory: resourceForm.minimumInventory || 1,
      purchasePrice: resourceForm.purchasePrice,
      currentValue: resourceForm.currentValue,
      qrCode: `res-${Date.now()}-qrcode`
    };

    setResources(prev => [...prev, newResource]);
    toast.success("Resource added successfully");
    setIsResourceDialogOpen(false);
    setResourceForm({
      name: '',
      type: 'room',
      description: '',
      location: '',
      status: 'available',
      imageUrl: ''
    });
  };

  const handleAddBooking = () => {
    if (!bookingForm.resourceId || !bookingForm.memberId || !bookingForm.purpose || 
        !bookingForm.startDate || !bookingForm.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newBooking: ResourceBooking = {
      id: `book-${Date.now()}`,
      resourceId: bookingForm.resourceId as string,
      memberId: bookingForm.memberId as string,
      purpose: bookingForm.purpose as string,
      startDate: new Date(bookingForm.startDate),
      endDate: new Date(bookingForm.endDate),
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
      startDate: new Date(),
      endDate: new Date(new Date().setHours(new Date().getHours() + 2)),
      status: 'pending'
    });
  };

  const approveBooking = (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { 
            ...booking, 
            status: 'approved',
            approvedById: 'user-1', // Would be the current user's ID
            approvedDate: new Date()
          } 
        : booking
    ));
    toast.success("Booking approved");
  };

  const rejectBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setBookings(prev => prev.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'declined' as 'declined' } // Cast as 'declined' to match allowed values
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

  // Record attendance - update the function signature to use AttendanceRecord
  const handleRecordAttendance = (data: Partial<AttendanceRecord>) => {
    if (!data.id) {
      // New attendance record
      const newAttendance: AttendanceRecord = {
        id: `att-${Date.now()}`,
        resourceId: data.resourceId as string,
        memberId: data.memberId as string,
        date: data.date || new Date(),
        isPresent: data.isPresent || true,
        status: data.status || (data.isPresent ? 'present' : 'absent'),
        checkInTime: data.checkInTime,
        checkOutTime: data.checkOutTime,
        notes: data.notes,
        createdAt: new Date(),
        eventId: data.eventId
      };
      
      setAttendance(prev => [...prev, newAttendance]);
      
      // Update booking if applicable
      if (data.resourceId) {
        setBookings(prev => prev.map(b => 
          b.resourceId === data.resourceId && b.memberId === data.memberId
            ? { ...b, checkedInAt: data.checkInTime || new Date() }
            : b
        ));
      }
    } else {
      // Update existing record
      setAttendance(prev => prev.map(a => 
        a.id === data.id
          ? { ...a, ...data }
          : a
      ));
      
      // Update booking if applicable (check-out)
      if (data.checkOutTime) {
        const record = attendance.find(a => a.id === data.id);
        if (record?.resourceId) {
          setBookings(prev => prev.map(b => 
            b.resourceId === record.resourceId && b.memberId === record.memberId
              ? { ...b, checkedOutAt: data.checkOutTime }
              : b
          ));
          
          // Update resource status
          setResources(prev => prev.map(r => 
            r.id === record.resourceId
              ? { ...r, status: 'available' }
              : r
          ));
        }
      }
    }
  };

  // Check in resource
  const handleCheckIn = (bookingId: string) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId
        ? { ...b, checkedInAt: new Date() }
        : b
    ));
    
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setResources(prev => prev.map(r => 
        r.id === booking.resourceId
          ? { ...r, status: 'in-use', currentAssigneeId: booking.memberId }
          : r
      ));
      
      // Add attendance record
      handleRecordAttendance({
        resourceId: booking.resourceId,
        memberId: booking.memberId,
        date: new Date(),
        isPresent: true,
        checkInTime: new Date()
      });
    }
  };

  // Check out resource
  const handleCheckOut = (bookingId: string) => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId
        ? { ...b, checkedOutAt: new Date() }
        : b
    ));
    
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      setResources(prev => prev.map(r => 
        r.id === booking.resourceId
          ? { ...r, status: 'available', currentAssigneeId: undefined }
          : r
      ));
      
      // Update attendance record
      const attendanceRecord = attendance.find(a => 
        a.resourceId === booking.resourceId && 
        a.memberId === booking.memberId &&
        !a.checkOutTime
      );
      
      if (attendanceRecord) {
        setAttendance(prev => prev.map(a => 
          a.id === attendanceRecord.id
            ? { ...a, checkOutTime: new Date() }
            : a
        ));
      }
    }
  };

  // Log resource health
  const handleLogHealth = (data: Omit<ResourceHealthLog, 'id'>) => {
    const newHealthLog: ResourceHealthLog = {
      id: `health-${Date.now()}`,
      ...data
    };
    
    setHealthLogs(prev => [...prev, newHealthLog]);
    
    // Update resource health status
    setResources(prev => prev.map(r => 
      r.id === data.resourceId
        ? { ...r, healthStatus: data.status }
        : r
    ));
  };

  // Update maintenance date
  const handleUpdateMaintenanceDate = (resourceId: string, date: Date) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId
        ? { ...r, nextMaintenanceDate: date }
        : r
    ));
  };

  // Add category
  const handleAddCategory = (category: Omit<ResourceCategory, 'id'>) => {
    const newCategory: ResourceCategory = {
      id: `cat-${Date.now()}`,
      ...category
    };
    
    setCategories(prev => [...prev, newCategory]);
  };

  // Edit category
  const handleEditCategory = (id: string, data: Partial<ResourceCategory>) => {
    setCategories(prev => prev.map(c => 
      c.id === id
        ? { ...c, ...data }
        : c
    ));
  };

  // Delete category
  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Assign category to resource
  const handleAssignCategory = (resourceId: string, categoryId: string) => {
    setResources(prev => prev.map(r => 
      r.id === resourceId
        ? { ...r, category: categoryId }
        : r
    ));
  };

  // Generate PDF report
  const handleGeneratePDF = () => {
    toast.success("PDF report is being generated");
    setIsReportDialogOpen(false);
    // In a real application, we would generate a PDF here
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      case 'declined':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Pending resource bookings
  const pendingBookings = bookings.filter(b => b.status === 'pending');

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Church Resources</h1>
          <p className="text-muted-foreground">Manage and book church resources</p>
        </div>
        <div className="flex gap-2">
          {/* Resource Dialog */}
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
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    value={resourceForm.imageUrl}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="col-span-3"
                    placeholder="https://example.com/image.jpg (optional)"
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
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="healthStatus" className="text-right">
                    Health Status
                  </Label>
                  <Input
                    id="healthStatus"
                    type="number"
                    value={resourceForm.healthStatus}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, healthStatus: Number(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inventoryCount" className="text-right">
                    Inventory Count
                  </Label>
                  <Input
                    id="inventoryCount"
                    type="number"
                    value={resourceForm.inventoryCount}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, inventoryCount: Number(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minimumInventory" className="text-right">
                    Minimum Inventory
                  </Label>
                  <Input
                    id="minimumInventory"
                    type="number"
                    value={resourceForm.minimumInventory}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, minimumInventory: Number(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="purchasePrice" className="text-right">
                    Purchase Price
                  </Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={resourceForm.purchasePrice}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, purchasePrice: Number(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="currentValue" className="text-right">
                    Current Value
                  </Label>
                  <Input
                    id="currentValue"
                    type="number"
                    value={resourceForm.currentValue}
                    onChange={(e) => setResourceForm(prev => ({ ...prev, currentValue: Number(e.target.value) }))}
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

          {/* Booking Dialog */}
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
                  <Label htmlFor="startDate" className="text-right">
                    Start Date/Time
                  </Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={bookingForm.startDate ? new Date(bookingForm.startDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date/Time
                  </Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={bookingForm.endDate ? new Date(bookingForm.endDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
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
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode selector */}
          <div className="border rounded-md p-1 flex flex-wrap">
            <Button 
              variant={resourceView === 'grid' ? 'default' : 'ghost'} 
              size="sm" 
              className="px-2"
              onClick={() => setResourceView('grid')}
            >
              <Filter className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Grid</span>
            </Button>
            <Button 
              variant={resourceView === 'calendar' ? 'default' : 'ghost'} 
              size="sm" 
              className="px-2"
              onClick={() => setResourceView('calendar')}
            >
              <Calendar className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Calendar</span>
            </Button>
            <Button 
              variant={resourceView === 'stats' ? 'default' : 'ghost'} 
              size="sm" 
              className="px-2"
              onClick={() => setResourceView('stats')}
            >
              <BarChart className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Stats</span>
            </Button>
            <Button 
              variant={resourceView === 'gallery' ? 'default' : 'ghost'} 
              size="sm" 
              className="px-2"
              onClick={() => setResourceView('gallery')}
            >
              <Image className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Gallery</span>
            </Button>
          </div>
          
          {/* Type filter */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] sm:w-[180px]">
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
          
          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Location filter (if you have multiple locations) */}
          {uniqueLocations.length > 0 && (
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[140px] sm:w-[180px]">
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location as string}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      {/* Main content area - conditionally render based on view mode */}
      {resourceView === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredResources.map(resource => (
            <Card key={resource.id} className="overflow-hidden">
              {resource.imageUrl && (
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.name} 
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                  {getStatusBadge(resource.status)}
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Tag className="h-4 w-4" /> {resource.type}
                  {resource.location && (
                    <>
                      <span className="mx-1">•</span>
                      <MapPin className="h-4 w-4" /> {resource.location}
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
                {resource.healthStatus !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${resource.healthStatus > 70 ? 'bg-green-500' : resource.healthStatus > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                        style={{ width: `${resource.healthStatus}%` }}
                      />
                    </div>
                    <span className="text-xs">{resource.healthStatus}%</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm">
                  <Info className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button 
                  size="sm" 
                  disabled={resource.status !== 'available'}
                  onClick={() => {
                    setBookingForm(prev => ({
                      ...prev,
                      resourceId: resource.id
                    }));
                    setIsBookingDialogOpen(true);
                  }}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Book
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : resourceView === 'calendar' ? (
        <ResourceCalendar 
          resources={resources} 
          bookings={bookings} 
          members={members}
        />
      ) : resourceView === 'stats' ? (
        <ResourceStatistics 
          resources={resources} 
          bookings={bookings} 
        />
      ) : resourceView === 'gallery' ? (
        <ResourceImageGallery resources={resources} />
      ) : resourceView === 'attendance' ? (
        <ResourceAttendanceTracker 
          resources={resources}
          bookings={bookings}
          members={members}
          attendance={attendance}
          onRecordAttendance={handleRecordAttendance}
        />
      ) : resourceView === 'health' ? (
        <ResourceHealthMonitor 
          resources={resources}
          healthLogs={healthLogs}
          onLogHealth={handleLogHealth}
          onUpdateMaintenanceDate={handleUpdateMaintenanceDate}
        />
      ) : resourceView === 'categories' ? (
        <ResourceCategoryManager 
          categories={categories}
          resources={resources}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onAssignCategory={handleAssignCategory}
        />
      ) : resourceView === 'checkin' ? (
        <ResourceCheckInSystem 
          resources={resources}
          bookings={bookings}
          members={members}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOut}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Select a view from above to continue</p>
        </div>
      )}
    </div>
  );
};

export default Resources;
