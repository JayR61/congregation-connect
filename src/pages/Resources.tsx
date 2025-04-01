
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
  Briefcase,
  Calendar,
  CheckCircle,
  ChevronRight,
  ClipboardList,
  Filter,
  Info,
  MapPin,
  Plus,
  Search,
  Settings,
  Tag,
  User,
  XCircle
} from "lucide-react";
import { toast } from '@/lib/toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Resources = () => {
  const { members, updateMember } = useAppContext();
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // State for resources (in a real app, this would come from a backend)
  const [resources, setResources] = useState<ChurchResource[]>([
    {
      id: 'res-1',
      name: 'Main Sanctuary',
      type: 'room',
      description: 'Main church sanctuary for services',
      location: 'Main Building, 1st Floor',
      status: 'available',
      acquisitionDate: new Date('2000-01-01')
    },
    {
      id: 'res-2',
      name: 'Projector',
      type: 'equipment',
      description: 'HD Projector for presentations',
      location: 'Media Room',
      status: 'in-use',
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
      maintenanceSchedule: new Date('2023-07-30'),
      acquisitionDate: new Date('2018-06-10')
    }
  ]);
  
  // State for bookings
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
    }
  ]);
  
  const [resourceForm, setResourceForm] = useState<Partial<ChurchResource>>({
    name: '',
    type: 'room',
    description: '',
    location: '',
    status: 'available'
  });
  
  const [bookingForm, setBookingForm] = useState<Partial<ResourceBooking>>({
    resourceId: '',
    memberId: '',
    purpose: '',
    startDateTime: new Date(),
    endDateTime: new Date(new Date().setHours(new Date().getHours() + 2)),
    status: 'pending'
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === '' || resource.type === typeFilter;
    
    return matchesSearch && matchesType;
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
      status: resourceForm.status as 'available' | 'in-use' | 'maintenance' | 'reserved',
      acquisitionDate: resourceForm.acquisitionDate,
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
      status: 'available'
    });
  };

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
    
    // Update the resource status to reserved
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
      
      // Update the resource status back to available
      setResources(prev => prev.map(resource => 
        resource.id === booking.resourceId 
          ? { ...resource, status: 'available' } 
          : resource
      ));
      
      toast.success("Booking rejected");
    }
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
        return <Badge variant="destructive">Rejected</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Church Resources</h1>
          <p className="text-muted-foreground">Manage and book church resources</p>
        </div>
        <div className="flex gap-2">
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
        <div className="flex items-center space-x-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="room">Rooms</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
              <SelectItem value="vehicle">Vehicles</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="resources" className="mb-6">
        <TabsList>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
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
                      <Badge variant="outline" className="mr-1">
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </Badge>
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
                    <Button 
                      variant="outline" 
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
                    <Button variant="ghost" size="sm">
                      <Info className="h-4 w-4 mr-1" />
                      Details
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
                No resources have been added yet or match your search.
              </p>
              <Button onClick={() => setIsResourceDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Resource
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="bookings" className="mt-4">
          {filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map(booking => {
                const resource = resources.find(r => r.id === booking.resourceId);
                const member = members.find(m => m.id === booking.memberId);
                
                return (
                  <Card key={booking.id} className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{booking.purpose}</CardTitle>
                        {getStatusBadge(booking.status)}
                      </div>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{resource?.name}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{member?.firstName} {member?.lastName}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>From: </span>
                          <span className="ml-1 font-medium">
                            {formatDateTime(booking.startDateTime)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>To: </span>
                          <span className="ml-1 font-medium">
                            {formatDateTime(booking.endDateTime)}
                          </span>
                        </div>
                        
                        {booking.notes && (
                          <div className="pt-2">
                            <p className="text-muted-foreground mb-1">Notes:</p>
                            <p>{booking.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {booking.status === 'pending' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 mr-1"
                            onClick={() => approveBooking(booking.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 ml-1"
                            onClick={() => rejectBooking(booking.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
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
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">No Bookings Found</h3>
              <p className="text-muted-foreground mt-2">
                No resource bookings have been made yet or match your search.
              </p>
              <Button onClick={() => setIsBookingDialogOpen(true)} className="mt-4">
                <Calendar className="mr-2 h-4 w-4" /> Book Resource
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
