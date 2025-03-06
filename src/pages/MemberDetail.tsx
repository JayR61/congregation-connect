import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { getMembers } from '@/data/mockData';

const MemberDetail = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: member, isLoading, error } = useQuery({
    queryKey: ['member', id],
    queryFn: () => {
      const members = getMembers();
      return members.find(member => member.id === id) || null;
    }
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/members">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
            </Button>
          </Link>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link to="/members">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium">Member not found</h3>
              <p className="text-muted-foreground mt-2">
                The member you're looking for doesn't exist or has been removed.
              </p>
              <Button className="mt-4" asChild>
                <Link to="/members">View All Members</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getMemberName = (member: any) => {
    return `${member.firstName} ${member.lastName}`;
  };

  const renderMemberInfo = () => {
    if (!member) return null;

    return (
      <div className="flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-4xl text-primary-foreground">
          {member.firstName.charAt(0)}
        </div>
        <h2 className="mt-4 text-xl font-bold">{getMemberName(member)}</h2>
        <p className="text-muted-foreground">{member.roles.join(', ') || 'Member'}</p>
        
        <div className="w-full mt-6 space-y-4">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{member.email}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{member.phone}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{`${member.address}, ${member.city}, ${member.state} ${member.zip}` || 'No address provided'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Member since {new Date(member.joinDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/members">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Members
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm">
            <Trash className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            {renderMemberInfo()}
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="contributions">Contributions</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">About</h3>
                      <p className="text-muted-foreground mt-1">
                        {member?.notes || 'No bio information provided.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Family</h3>
                      <p className="text-muted-foreground mt-1">
                        {member?.familyId 
                          ? `Family ID: ${member.familyId}` 
                          : 'No family information provided.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Skills & Interests</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {member?.roles?.map((role) => (
                          <span key={role} className="bg-muted px-2 py-1 rounded text-sm">
                            {role}
                          </span>
                        )) || 'No skills or interests listed.'}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium">Notes</h3>
                      <p className="text-muted-foreground mt-1">
                        {member?.notes || 'No additional notes.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Attendance tracking feature coming soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="contributions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contribution History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      Contribution history will be displayed here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">
                      No tasks currently assigned to this member.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
