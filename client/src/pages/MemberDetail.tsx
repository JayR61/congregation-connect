import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Member, AttendanceRecord } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, Phone, Mail, MapPin, User, Users, ClipboardList, Star, 
  CalendarDays, Clock, Briefcase, ArrowLeft, CheckCircle, Crown, Edit,
  Trash, Award 
} from 'lucide-react';
import { MemberDialog } from '@/components/members/MemberDialog';
import MemberNotes from '@/components/members/MemberNotes';
import AttendanceTracker from '@/components/members/AttendanceTracker';
import { toast } from '@/lib/toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { members, deleteMember, updateMember } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const member = members.find(m => m.id === id);
  
  useEffect(() => {
    if (member && member.category === 'new' && member.newMemberDate) {
      const newMemberDate = new Date(member.newMemberDate);
      const currentDate = new Date();
      const daysSinceNewMember = Math.floor((currentDate.getTime() - newMemberDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysSinceNewMember >= 60) {
        updateMember(member.id, { 
          category: 'regular',
          newMemberDate: undefined
        });
        toast.success(`${member.firstName} ${member.lastName} is now a regular member`);
      }
      
      const joinDate = new Date(member.joinDate);
      const yearsSinceJoining = (currentDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      if (yearsSinceJoining >= 2 && !member.isFullMember) {
        toast.info(`${member.firstName} ${member.lastName} is eligible to become a full member`);
      }
    }
    
    if (member && member.structures && !member.isLeadership) {
      const isInLeadership = member.structures.some(s => 
        s === 'senior_leadership' || s === 'youth_leadership'
      );
      
      if (isInLeadership) {
        updateMember(member.id, { isLeadership: true });
      }
    }
  }, [member, updateMember]);
  
  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-bold mb-4">Member Not Found</h2>
        <p className="text-muted-foreground mb-6">The member you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/members')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
        </Button>
      </div>
    );
  }
  
  const getStatusBadge = (status: string | undefined) => {
    if (!status) {
      return member.isActive ? 
        <Badge variant="success">Active</Badge> : 
        <Badge variant="secondary">Inactive</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'prospect':
        return <Badge variant="info">Prospect</Badge>;
      case 'visitor':
        return <Badge variant="warning">Visitor</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getCategoryBadge = () => {
    if (!member.category) return null;
    
    const getVariant = (category: string) => {
      switch (category) {
        case 'elder':
        case 'pastor':
          return 'secondary';
        case 'youth':
          return 'info';
        case 'child':
          return 'warning';
        case 'visitor':
          return 'destructive';
        case 'new':
          return 'success';
        case 'full':
          return 'default';
        default:
          return 'outline';
      }
    };
    
    return (
      <Badge variant={getVariant(member.category)} className="ml-2">
        {member.category}
      </Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      deleteMember(member.id);
      navigate('/members');
    }
  };
  
  const handleToggleFullMember = () => {
    updateMember(member.id, { isFullMember: !member.isFullMember });
    toast.success(`${member.firstName} ${member.lastName} is ${!member.isFullMember ? 'now' : 'no longer'} a full member`);
  };
  
  const familyMembers = members.filter(m => 
    (member.familyIds && member.familyIds.includes(m.id)) || 
    (member.familyId && m.id === member.familyId)
  );
  
  const isLeadership = member.isLeadership || 
    (member.structures && member.structures.some(s => 
      s === 'senior_leadership' || s === 'youth_leadership'
    ));
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/members')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{member.firstName} {member.lastName}</h1>
          {getStatusBadge(member.status)}
          {getCategoryBadge()}
          {member.isFullMember && (
            <Badge variant="outline" className="ml-2 flex items-center">
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Full Member
            </Badge>
          )}
          {isLeadership && (
            <Badge variant="secondary" className="ml-2 flex items-center">
              <Crown className="h-3.5 w-3.5 mr-1" /> Leadership
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Member Information</CardTitle>
              <CardDescription>Basic details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                  <ul className="space-y-3">
                    {member.email && (
                      <li className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                          {member.email}
                        </a>
                      </li>
                    )}
                    {member.phone && (
                      <li className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                          {member.phone}
                        </a>
                      </li>
                    )}
                    {member.address && (
                      <li className="flex items-start">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <div>
                          {member.address}
                          {member.city && `, ${member.city}`}
                          {member.state && `, ${member.state}`}
                          {member.zip && ` ${member.zip}`}
                        </div>
                      </li>
                    )}
                    {member.occupation && (
                      <li className="flex items-center">
                        <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Role: {member.occupation}</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Membership Details</h3>
                  <ul className="space-y-3">
                    {member.joinDate && (
                      <li className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>Joined: {formatDate(member.joinDate)}</span>
                      </li>
                    )}
                    {member.category === 'new' && member.newMemberDate && (
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>New Member Since: {formatDate(member.newMemberDate)}</span>
                      </li>
                    )}
                    <li className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Family Members: {familyMembers.length}</span>
                    </li>
                    {member.structures && member.structures.length > 0 && (
                      <li className="flex items-start">
                        <Award className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <div>
                          <span>Structures: </span>
                          {member.structures.map((structure, index) => (
                            <Badge key={structure} variant="outline" className="mr-1 mt-1">
                              {structure.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </li>
                    )}
                    {member.positions && member.positions.length > 0 && (
                      <li className="flex items-start">
                        <Crown className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                        <div>
                          <span>Positions: </span>
                          {member.positions.map((position, index) => (
                            <div key={index} className="mt-1">
                              <Badge variant="outline">
                                {position.title} ({position.structure.replace('_', ' ')})
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              {member.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                    <div className="p-3 bg-muted rounded-md">
                      <p className="whitespace-pre-line">{member.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Tabs defaultValue="family" className="mt-6">
            <TabsList>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="notes">Notes & Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="family" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Family Members</CardTitle>
                  <CardDescription>People related to this member</CardDescription>
                </CardHeader>
                <CardContent>
                  {familyMembers.length > 0 ? (
                    <div className="space-y-4">
                      {familyMembers.map(familyMember => (
                        <div 
                          key={familyMember.id} 
                          className="flex items-center p-3 rounded-md border hover:bg-muted cursor-pointer"
                          onClick={() => navigate(`/members/${familyMember.id}`)}
                        >
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground mr-3">
                            {familyMember.firstName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{familyMember.firstName} {familyMember.lastName}</div>
                            <div className="text-sm text-muted-foreground">{familyMember.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <h3 className="font-medium">No Family Members</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        This member has no linked family members.
                      </p>
                      <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
                        Add Family Member
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-4">
              <AttendanceTracker member={member} />
            </TabsContent>
            
            <TabsContent value="notes" className="mt-4">
              <MemberNotes member={member} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Member Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-6">
                <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-bold mb-3">
                  {member.firstName.charAt(0)}
                  {member.lastName.charAt(0)}
                </div>
                <h2 className="text-xl font-bold">{member.firstName} {member.lastName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(member.status)}
                  {getCategoryBadge()}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium">
                    {member.joinDate ? formatDate(member.joinDate) : 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{member.status || (member.isActive ? 'Active' : 'Inactive')}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium capitalize">{member.category || 'Regular'}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Full Member</span>
                  <span className="font-medium">{member.isFullMember ? 'Yes' : 'No'}</span>
                </div>
                {member.category === 'new' && member.newMemberDate && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">New Member Since</span>
                    <span className="font-medium">
                      {formatDate(member.newMemberDate)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Family Members</span>
                  <span className="font-medium">{familyMembers.length}</span>
                </div>
                {member.structures && member.structures.length > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Structures</span>
                    <span className="font-medium">{member.structures.length}</span>
                  </div>
                )}
                {member.positions && member.positions.length > 0 && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Positions</span>
                    <span className="font-medium">{member.positions.length}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {member.updatedAt ? formatDate(member.updatedAt) : 'Not available'}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                variant={member.isFullMember ? "outline" : "default"} 
                className="w-full"
                onClick={handleToggleFullMember}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {member.isFullMember ? 'Remove Full Member Status' : 'Mark as Full Member'}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => window.print()}>
                Print Profile
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        member={member}
        onSave={(updatedMember) => {
          // Handle updated member
        }}
      />
    </div>
  );
};

export default MemberDetail;
