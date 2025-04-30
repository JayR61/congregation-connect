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
import { Member, Volunteer } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, Clock, Filter, Handshake, Plus, Search, User } from "lucide-react";
import { toast } from '@/lib/toast';

// Define allowed volunteer areas and availability options
const VOLUNTEER_AREAS = [
  "Worship Team",
  "Sunday School",
  "Youth Ministry",
  "Children's Ministry",
  "Hospitality",
  "Technical Support",
  "Cleaning",
  "Administration",
  "Outreach",
  "Security",
  "Elderly Care",
  "Food Pantry",
  "Transportation",
  "Events Coordination",
  "Media Team"
];

const AVAILABILITY_OPTIONS = [
  "Weekday Mornings",
  "Weekday Afternoons",
  "Weekday Evenings",
  "Saturday Mornings",
  "Saturday Afternoons",
  "Saturday Evenings",
  "Sunday Mornings",
  "Sunday Afternoons",
  "Sunday Evenings"
];

const Volunteers = () => {
  const { members, updateMember } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [areaFilter, setAreaFilter] = useState('all');
  const [volunteerData, setVolunteerData] = useState<Partial<Volunteer>>({});
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Get all volunteer roles across all members
  const allVolunteerRoles = members.reduce<{volunteer: Volunteer; member: Member}[]>((acc, member) => {
    if (member.volunteerRoles && Array.isArray(member.volunteerRoles)) {
      const memberRoles = member.volunteerRoles.map(role => ({
        volunteer: role,
        member
      }));
      return [...acc, ...memberRoles];
    }
    return acc;
  }, []);

  const filteredRoles = allVolunteerRoles.filter(item => {
    const matchesSearch = 
      item.volunteer.ministry?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.volunteer.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.member.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesArea = areaFilter === 'all' || item.volunteer.ministry === areaFilter;
    
    return matchesSearch && matchesArea;
  });

  const uniqueAreas = [...new Set(allVolunteerRoles.map(item => item.volunteer.ministry))];

  const handleSelectMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
    }
  };

  const handleToggleAvailability = (day: string) => {
    setVolunteerData(prev => {
      const currentAvailability = prev.availability || [];
      if (currentAvailability.includes(day)) {
        return {
          ...prev,
          availability: currentAvailability.filter(d => d !== day)
        };
      } else {
        return {
          ...prev,
          availability: [...currentAvailability, day]
        };
      }
    });
  };

  const handleSaveVolunteer = () => {
    if (!selectedMember || !volunteerData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newVolunteer: Volunteer = {
      id: `volunteer-${Date.now()}`,
      memberId: selectedMember.id,
      ministry: volunteerData.ministry || '',
      role: volunteerData.role || '',
      joinDate: new Date(volunteerData.joinDate || new Date()),
      status: 'active',
      hoursPerWeek: 0,
      availability: volunteerData.availability || [],
      notes: volunteerData.notes,
      area: volunteerData.area || '',
      startDate: new Date(volunteerData.joinDate || new Date())
    };

    // Update the member with the new volunteer role
    const existingRoles = selectedMember.volunteerRoles || [];
    
    updateMember(selectedMember.id, {
      volunteerRoles: [...(existingRoles as Volunteer[]), newVolunteer]
    });

    toast.success("Volunteer role added successfully");
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setVolunteerData({});
    setSelectedMember(null);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Volunteers</h1>
          <p className="text-muted-foreground">Manage volunteers and their roles</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Volunteer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Volunteer Role</DialogTitle>
                <DialogDescription>
                  Assign a volunteer role to a church member
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="member" className="text-right">
                    Member
                  </Label>
                  <div className="col-span-3">
                    <Select onValueChange={handleSelectMember}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.firstName} {member.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ministry" className="text-right">
                    Ministry Area
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={volunteerData.ministry} 
                      onValueChange={(value) => setVolunteerData(prev => ({ ...prev, ministry: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a ministry area" />
                      </SelectTrigger>
                      <SelectContent>
                        {VOLUNTEER_AREAS.map(area => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={volunteerData.role || ''}
                    onChange={(e) => setVolunteerData(prev => ({ ...prev, role: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., Team Leader, Helper, Coordinator"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="joinDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={volunteerData.joinDate ? new Date(volunteerData.joinDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setVolunteerData(prev => ({ ...prev, joinDate: new Date(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="availability" className="text-right mt-2">
                    Availability
                  </Label>
                  <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {AVAILABILITY_OPTIONS.map(day => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`day-${day}`} 
                          checked={(volunteerData.availability || []).includes(day)}
                          onCheckedChange={() => handleToggleAvailability(day)}
                        />
                        <label htmlFor={`day-${day}`} className="text-sm">
                          {day}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={volunteerData.notes || ''}
                    onChange={(e) => setVolunteerData(prev => ({ ...prev, notes: e.target.value }))}
                    className="col-span-3"
                    placeholder="Special skills, preferences, etc."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveVolunteer}>
                  Save Role
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
            placeholder="Search volunteers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {uniqueAreas.map(area => area && (
                <SelectItem key={area} value={area}>{area}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Volunteers</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="by-area">By Area</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {filteredRoles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles.map(({ volunteer, member }) => (
                <Card key={volunteer.id} className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{volunteer.role}</CardTitle>
                      <Badge>{volunteer.ministry}</Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <User className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{member.firstName} {member.lastName}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground mr-1">Started:</span>
                        <span>{formatDate(volunteer.joinDate)}</span>
                      </div>
                      
                      {volunteer.availability && volunteer.availability.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Available:</p>
                          <div className="flex flex-wrap gap-1">
                            {volunteer.availability.slice(0, 3).map((day, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {day}
                              </Badge>
                            ))}
                            {volunteer.availability.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{volunteer.availability.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {volunteer.notes && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                          <p className="text-sm line-clamp-2">{volunteer.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" size="sm">
                      <span>View Details</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Handshake className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">No Volunteers Found</h3>
              <p className="text-muted-foreground mt-2">
                No volunteer roles have been assigned yet or match your search.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Volunteer
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          {filteredRoles.filter(({ volunteer }) => volunteer.status === 'active').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoles
                .filter(({ volunteer }) => volunteer.status === 'active')
                .map(({ volunteer, member }) => (
                  <Card key={volunteer.id} className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{volunteer.role}</CardTitle>
                        <Badge>{volunteer.ministry}</Badge>
                      </div>
                      <CardDescription>
                        <div className="flex items-center mt-1">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{member.firstName} {member.lastName}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground mr-1">Started:</span>
                          <span>{formatDate(volunteer.joinDate)}</span>
                        </div>
                        
                        {volunteer.availability && volunteer.availability.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Available:</p>
                            <div className="flex flex-wrap gap-1">
                              {volunteer.availability.slice(0, 3).map((day, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {day}
                                </Badge>
                              ))}
                              {volunteer.availability.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{volunteer.availability.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" size="sm">
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No Active Volunteers</h3>
              <p className="text-muted-foreground mt-2">
                There are no active volunteer roles that match your search.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="by-area" className="mt-4">
          <div className="space-y-6">
            {uniqueAreas.filter(Boolean).length > 0 ? (
              uniqueAreas.filter(Boolean).map(area => {
                const areaVolunteers = filteredRoles.filter(({ volunteer }) => volunteer.ministry === area);
                
                if (areaVolunteers.length === 0) return null;
                
                return (
                  <div key={area}>
                    <h3 className="text-lg font-semibold mb-4">{area}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {areaVolunteers.map(({ volunteer, member }) => (
                        <Card key={volunteer.id} className="hover:bg-muted/50 transition-colors">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{volunteer.role}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span>{member.firstName} {member.lastName}</span>
                              </div>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-2">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Since: </span>
                              <span>{formatDate(volunteer.joinDate)}</span>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" className="w-full" size="sm">
                              <span>View Details</span>
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No Areas Found</h3>
                <p className="text-muted-foreground mt-2">
                  There are no volunteer areas defined yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Volunteers;
