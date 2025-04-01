
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
import { Member, MentorshipProgram } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar, ChevronRight, Plus, Search, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from '@/lib/toast';

const Mentorship = () => {
  const { members, updateMember } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorshipData, setMentorshipData] = useState<Partial<MentorshipProgram>>({
    name: '',
    description: '',
    startDate: new Date(),
    mentorId: '',
    goals: [],
    progress: 0
  });
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [newGoal, setNewGoal] = useState('');

  // Get all mentorship programs across all members
  const allMentorshipPrograms = members.reduce<{program: MentorshipProgram, member: Member}[]>((acc, member) => {
    if (member.mentorshipPrograms && member.mentorshipPrograms.length > 0) {
      const memberPrograms = member.mentorshipPrograms.map(program => ({
        program,
        member
      }));
      return [...acc, ...memberPrograms];
    }
    return acc;
  }, []);

  const filteredPrograms = allMentorshipPrograms.filter(item => 
    item.program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.member.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMentors = members.filter(member => 
    member.isActive && 
    member.isLeadership
  );

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setMentorshipData(prev => ({
        ...prev,
        goals: [...(prev.goals || []), newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setMentorshipData(prev => ({
      ...prev,
      goals: prev.goals?.filter((_, i) => i !== index)
    }));
  };

  const handleSelectMember = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (member) {
      setSelectedMember(member);
    }
  };

  const handleSaveMentorship = () => {
    if (!selectedMember || !mentorshipData.name || !mentorshipData.startDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newProgram: MentorshipProgram = {
      id: `mentorship-${Date.now()}`,
      name: mentorshipData.name,
      description: mentorshipData.description || '',
      startDate: new Date(mentorshipData.startDate),
      endDate: mentorshipData.endDate,
      mentorId: mentorshipData.mentorId,
      goals: mentorshipData.goals || [],
      progress: mentorshipData.progress || 0,
      notes: mentorshipData.notes
    };

    // Update the member with the new mentorship program
    const existingPrograms = selectedMember.mentorshipPrograms || [];
    updateMember(selectedMember.id, {
      mentorshipPrograms: [...existingPrograms, newProgram]
    });

    toast.success("Mentorship program added successfully");
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setMentorshipData({
      name: '',
      description: '',
      startDate: new Date(),
      mentorId: '',
      goals: [],
      progress: 0
    });
    setSelectedMember(null);
    setNewGoal('');
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
          <h1 className="text-2xl font-bold">Mentorship Programs</h1>
          <p className="text-muted-foreground">Manage mentorship programs for church members</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Program
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Mentorship Program</DialogTitle>
                <DialogDescription>
                  Create a new mentorship program for a church member
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
                  <Label htmlFor="name" className="text-right">
                    Program Name
                  </Label>
                  <Input
                    id="name"
                    value={mentorshipData.name}
                    onChange={(e) => setMentorshipData(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={mentorshipData.description}
                    onChange={(e) => setMentorshipData(prev => ({ ...prev, description: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={mentorshipData.startDate ? new Date(mentorshipData.startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setMentorshipData(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={mentorshipData.endDate ? new Date(mentorshipData.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setMentorshipData(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mentor" className="text-right">
                    Mentor
                  </Label>
                  <div className="col-span-3">
                    <Select onValueChange={(value) => setMentorshipData(prev => ({ ...prev, mentorId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a mentor" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeMentors.map(mentor => (
                          <SelectItem key={mentor.id} value={mentor.id}>
                            {mentor.firstName} {mentor.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="goals" className="text-right mt-2">
                    Goals
                  </Label>
                  <div className="col-span-3 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="newGoal"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Enter a goal"
                      />
                      <Button type="button" onClick={handleAddGoal} className="shrink-0">
                        Add
                      </Button>
                    </div>
                    <div className="space-y-2 mt-2">
                      {mentorshipData.goals?.map((goal, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span>{goal}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveGoal(index)}>
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={mentorshipData.notes}
                    onChange={(e) => setMentorshipData(prev => ({ ...prev, notes: e.target.value }))}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMentorship}>
                  Save Program
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search mentorship programs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {filteredPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map(({ program, member }) => (
                <Card key={program.id} className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <Badge variant={program.progress === 100 ? "success" : "secondary"}>
                        {program.progress === 100 ? "Completed" : "In Progress"}
                      </Badge>
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
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Progress</p>
                        <Progress value={program.progress} max={100} className="h-2" />
                        <p className="text-xs text-right mt-1">{program.progress}%</p>
                      </div>
                      
                      {program.mentorId && (
                        <div className="flex items-center text-sm">
                          <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground mr-1">Mentor:</span>
                          <span>
                            {(() => {
                              const mentor = members.find(m => m.id === program.mentorId);
                              return mentor ? `${mentor.firstName} ${mentor.lastName}` : 'Unassigned';
                            })()}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-muted-foreground mr-1">Started:</span>
                        <span>{formatDate(program.startDate)}</span>
                      </div>
                      
                      {program.goals.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Top Goals:</p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            {program.goals.slice(0, 2).map((goal, idx) => (
                              <li key={idx}>{goal}</li>
                            ))}
                            {program.goals.length > 2 && (
                              <li className="text-muted-foreground">
                                +{program.goals.length - 2} more goals
                              </li>
                            )}
                          </ul>
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
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium">No Mentorship Programs Found</h3>
              <p className="text-muted-foreground mt-2">
                No mentorship programs have been created yet or match your search.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" /> Add Program
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          {filteredPrograms.filter(({ program }) => program.progress < 100).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms
                .filter(({ program }) => program.progress < 100)
                .map(({ program, member }) => (
                  <Card key={program.id} className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <Badge variant="secondary">In Progress</Badge>
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
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Progress</p>
                          <Progress value={program.progress} max={100} className="h-2" />
                          <p className="text-xs text-right mt-1">{program.progress}%</p>
                        </div>
                        
                        {program.mentorId && (
                          <div className="flex items-center text-sm">
                            <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">Mentor:</span>
                            <span>
                              {(() => {
                                const mentor = members.find(m => m.id === program.mentorId);
                                return mentor ? `${mentor.firstName} ${mentor.lastName}` : 'Unassigned';
                              })()}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground mr-1">Started:</span>
                          <span>{formatDate(program.startDate)}</span>
                        </div>
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
              <h3 className="text-lg font-medium">No Active Programs</h3>
              <p className="text-muted-foreground mt-2">
                There are no active mentorship programs that match your search.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {filteredPrograms.filter(({ program }) => program.progress === 100).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms
                .filter(({ program }) => program.progress === 100)
                .map(({ program, member }) => (
                  <Card key={program.id} className="hover:bg-muted/50 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <Badge variant="success">Completed</Badge>
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
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Progress</p>
                          <Progress value={100} max={100} className="h-2" />
                          <p className="text-xs text-right mt-1">100%</p>
                        </div>
                        
                        {program.mentorId && (
                          <div className="flex items-center text-sm">
                            <Award className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">Mentor:</span>
                            <span>
                              {(() => {
                                const mentor = members.find(m => m.id === program.mentorId);
                                return mentor ? `${mentor.firstName} ${mentor.lastName}` : 'Unassigned';
                              })()}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span className="text-muted-foreground mr-1">Completed:</span>
                          <span>{program.endDate ? formatDate(program.endDate) : 'N/A'}</span>
                        </div>
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
              <h3 className="text-lg font-medium">No Completed Programs</h3>
              <p className="text-muted-foreground mt-2">
                There are no completed mentorship programs that match your search.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Mentorship;
