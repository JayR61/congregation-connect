import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, Users, Calendar, Target, BookOpen, 
  Clock, User, CheckCircle, XCircle, 
  MoreHorizontal, MessageSquare, Award
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { getMentorshipPrograms, getMentorshipSessions, addMentorshipProgram, updateMentorshipProgram, deleteMentorshipProgram } from '@/data/mentorship-data';
import { useAppContext } from '@/context/AppContext';
import { MentorshipProgram, MentorshipSession } from '@/types/mentorship.types';
import { formatDistance, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import MentorshipProgramDialog from '@/components/mentorship/MentorshipProgramDialog';

const Mentorship = () => {
  const { members } = useAppContext();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [showProgramDialog, setShowProgramDialog] = useState(false);
  const [editingProgram, setEditingProgram] = useState<MentorshipProgram | null>(null);
  const [programs, setPrograms] = useState(() => getMentorshipPrograms());
  const [allSessions, setAllSessions] = useState(() => getMentorshipSessions());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'scheduled':
        return 'text-blue-600 bg-blue-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
  };

  const handleCreateProgram = (programData: Omit<MentorshipProgram, 'id'>) => {
    const newProgram = addMentorshipProgram(programData);
    setPrograms(getMentorshipPrograms());
    toast({
      title: "Success",
      description: "Mentorship program created successfully"
    });
  };

  const handleUpdateProgram = (programData: Omit<MentorshipProgram, 'id'>) => {
    if (editingProgram) {
      const updatedProgram = updateMentorshipProgram(editingProgram.id, programData);
      if (updatedProgram) {
        setPrograms(getMentorshipPrograms());
        setEditingProgram(null);
        toast({
          title: "Success",
          description: "Mentorship program updated successfully"
        });
      }
    }
  };

  const handleDeleteProgram = (programId: string) => {
    if (window.confirm('Are you sure you want to delete this mentorship program? This action cannot be undone.')) {
      const success = deleteMentorshipProgram(programId);
      if (success) {
        // Immediately update the state to refresh the UI
        setPrograms(prev => prev.filter(p => p.id !== programId));
        toast({
          title: "Success",
          description: "Mentorship program deleted successfully"
        });
      }
    }
  };

  const handleViewDetails = (program: MentorshipProgram) => {
    setSelectedProgram(program.id);
    toast({
      title: "Program Details",
      description: `Viewing details for "${program.name}"`
    });
  };

  const handleScheduleSession = (program: MentorshipProgram) => {
    toast({
      title: "Schedule Session",
      description: `Scheduling session for "${program.name}"`
    });
    // This would typically open a scheduling dialog
  };

  const handleEditProgram = (program: MentorshipProgram) => {
    setEditingProgram(program);
    setShowProgramDialog(true);
  };

  const handleNewProgram = () => {
    setEditingProgram(null);
    setShowProgramDialog(true);
  };

  const ProgramCard = ({ program }: { program: MentorshipProgram }) => (
    <Card className="card-hover group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{program.name}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={cn('text-white', getStatusColor(program.status))}>
                {program.status}
              </Badge>
              {program.progress !== undefined && (
                <span className="text-sm text-muted-foreground">
                  {program.progress}% complete
                </span>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(program)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScheduleSession(program)}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Session
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditProgram(program)}>
                Edit Program
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleDeleteProgram(program.id)}
              >
                Delete Program
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {program.description}
        </p>
        
        {program.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className="font-medium">{program.progress}%</span>
            </div>
            <Progress value={program.progress} className="h-2" />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <Users className="h-4 w-4 mr-1" />
              Mentors
            </div>
            <div className="font-medium">
              {program.mentors.length} assigned
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <Target className="h-4 w-4 mr-1" />
              Mentees
            </div>
            <div className="font-medium">
              {program.mentees.length} enrolled
            </div>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {format(program.startDate, 'MMM dd, yyyy')} - {program.endDate ? format(program.endDate, 'MMM dd, yyyy') : 'Ongoing'}
          </div>
        </div>
        
        {program.goals && program.goals.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Goals</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {program.goals.slice(0, 2).map((goal, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-3 w-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                  {goal}
                </li>
              ))}
              {program.goals.length > 2 && (
                <li className="text-xs italic">
                  +{program.goals.length - 2} more goals
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const SessionCard = ({ session }: { session: MentorshipSession }) => {
    const program = programs.find(p => p.id === session.programId);
    
    return (
      <Card className="card-hover">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1">{session.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {program?.name}
              </p>
              <Badge className={cn('text-xs', getSessionStatusColor(session.status))}>
                {session.status}
              </Badge>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>{format(session.date, 'MMM dd')}</div>
              <div>{format(session.date, 'HH:mm')}</div>
            </div>
          </div>
          
          {session.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              {session.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {session.duration} min
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-3 w-3 mr-1" />
              {session.attendees.length} attendees
            </div>
          </div>
          
          {session.notes && session.status === 'completed' && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-muted-foreground italic">
                "{session.notes}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const upcomingSessions = allSessions
    .filter(session => session.status === 'scheduled' && session.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const recentSessions = allSessions
    .filter(session => session.status === 'completed')
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const activePrograms = programs.filter(p => p.status === 'active');
  const completedPrograms = programs.filter(p => p.status === 'completed');

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-gradient text-3xl font-bold">Mentorship</h1>
          <p className="text-elegant mt-2">
            Guide and support members through structured mentorship programs
          </p>
        </div>
        <Button className="btn-primary" onClick={handleNewProgram}>
          <Plus className="h-4 w-4 mr-2" />
          New Program
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Programs</p>
                <p className="text-2xl font-bold">{activePrograms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">
                  {programs.reduce((acc, p) => acc + p.mentors.length + p.mentees.length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions This Month</p>
                <p className="text-2xl font-bold">{allSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Programs</p>
                <p className="text-2xl font-bold">{completedPrograms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="programs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-6">
          {/* Active Programs */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Active Programs</h2>
            {activePrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activePrograms.map(program => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Programs</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first mentorship program to get started
                  </p>
                  <Button onClick={handleNewProgram}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Program
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Completed Programs */}
          {completedPrograms.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Completed Programs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedPrograms.map(program => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Sessions */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
              <div className="space-y-3">
                {upcomingSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
                {upcomingSessions.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No upcoming sessions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Recent Sessions */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
              <div className="space-y-3">
                {recentSessions.map(session => (
                  <SessionCard key={session.id} session={session} />
                ))}
                {recentSessions.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No recent sessions</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mentors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Active Mentors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(activePrograms.flatMap(p => p.mentors))).length > 0 ? (
                    Array.from(new Set(activePrograms.flatMap(p => p.mentors))).map(mentorId => (
                      <div key={mentorId} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{getMemberName(mentorId)}</p>
                          <p className="text-sm text-muted-foreground">
                            {activePrograms.filter(p => p.mentors.includes(mentorId)).length} programs
                          </p>
                        </div>
                        <Badge variant="outline">Mentor</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <User className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No active mentors</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Mentees */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Active Mentees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(activePrograms.flatMap(p => p.mentees))).length > 0 ? (
                    Array.from(new Set(activePrograms.flatMap(p => p.mentees))).map(menteeId => (
                      <div key={menteeId} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{getMemberName(menteeId)}</p>
                          <p className="text-sm text-muted-foreground">
                            {activePrograms.filter(p => p.mentees.includes(menteeId)).length} programs
                          </p>
                        </div>
                        <Badge variant="secondary">Mentee</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No active mentees</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Program Dialog */}
      <MentorshipProgramDialog
        open={showProgramDialog}
        onOpenChange={setShowProgramDialog}
        program={editingProgram}
        onSave={editingProgram ? handleUpdateProgram : handleCreateProgram}
      />
    </div>
  );
};

export default Mentorship;