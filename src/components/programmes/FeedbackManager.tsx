
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgrammeFeedback, Programme, Member } from '@/types';
import { MessageSquare, Star, StarHalf } from 'lucide-react';
import { format } from "date-fns";

interface FeedbackManagerProps {
  programmes: Programme[];
  feedback: ProgrammeFeedback[];
  members: Member[];
  onAddFeedback: (feedback: Omit<ProgrammeFeedback, 'id' | 'submittedAt'>) => ProgrammeFeedback | null;
}

export const FeedbackManager = ({ 
  programmes, 
  feedback,
  members,
  onAddFeedback
}: FeedbackManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    programmeId: '',
    memberId: '',
    rating: 5,
    comments: ''
  });
  
  const resetForm = () => {
    setForm({
      programmeId: '',
      memberId: '',
      rating: 5,
      comments: ''
    });
  };
  
  const handleSubmit = () => {
    onAddFeedback(form);
    setIsDialogOpen(false);
    resetForm();
  };
  
  // Filter feedback by programme if selected
  const filteredFeedback = selectedProgrammeId
    ? feedback.filter(f => f.programmeId === selectedProgrammeId)
    : feedback;
  
  // Calculate average rating for each programme
  const programmeRatings = programmes.map(programme => {
    const programmeFeedback = feedback.filter(f => f.programmeId === programme.id);
    const averageRating = programmeFeedback.length > 0
      ? programmeFeedback.reduce((sum, f) => sum + f.rating, 0) / programmeFeedback.length
      : 0;
    
    return {
      programmeId: programme.id,
      programmeName: programme.name,
      averageRating,
      feedbackCount: programmeFeedback.length
    };
  });
  
  // Get member name by ID
  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : 'Unknown Member';
  };
  
  // Get programme name by ID
  const getProgrammeName = (programmeId: string) => {
    const programme = programmes.find(p => p.id === programmeId);
    return programme ? programme.name : 'Unknown Programme';
  };
  
  // Render star rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-yellow-500 text-yellow-500" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return <div className="flex">{stars}</div>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Feedback Collection</h2>
          <p className="text-muted-foreground">
            Collect and manage feedback for your programmes.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <MessageSquare className="mr-2 h-4 w-4" /> Add Feedback
        </Button>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <Select 
          value={selectedProgrammeId || ''} 
          onValueChange={(value) => setSelectedProgrammeId(value || null)}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Filter by programme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programmes</SelectItem>
            {programmes.map(programme => (
              <SelectItem key={programme.id} value={programme.id}>
                {programme.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedProgrammeId && (
          <Button variant="outline" onClick={() => setSelectedProgrammeId(null)}>
            Clear Filter
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Programme Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {programmeRatings.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No feedback collected yet.</p>
              </div>
            ) : (
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {programmeRatings
                    .filter(p => p.feedbackCount > 0)
                    .sort((a, b) => b.averageRating - a.averageRating)
                    .map(programme => (
                      <div key={programme.programmeId} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{programme.programmeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {programme.feedbackCount} {programme.feedbackCount === 1 ? 'response' : 'responses'}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(programme.averageRating)}
                          <div className="text-sm font-medium">
                            {programme.averageRating.toFixed(1)} / 5
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {programmeRatings.filter(p => p.feedbackCount > 0).length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No ratings available.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFeedback.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No feedback collected yet.</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  Add Your First Feedback
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {filteredFeedback
                    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                    .map(item => (
                      <div key={item.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{getProgrammeName(item.programmeId)}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(item.submittedAt), 'MMM d, yyyy')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          {renderStars(item.rating)}
                          <div className="text-sm">{getMemberName(item.memberId)}</div>
                        </div>
                        {item.comments && (
                          <div className="text-sm mt-2 border-t pt-2">
                            "{item.comments}"
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>
              Add feedback for a programme.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="programme">Programme</Label>
              <Select 
                value={form.programmeId} 
                onValueChange={(value) => setForm(prev => ({ ...prev, programmeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  {programmes.map(programme => (
                    <SelectItem key={programme.id} value={programme.id}>
                      {programme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="member">Member</Label>
              <Select 
                value={form.memberId} 
                onValueChange={(value) => setForm(prev => ({ ...prev, memberId: value }))}
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
              <Label htmlFor="rating" className="mb-2 block">Rating</Label>
              <RadioGroup 
                value={form.rating.toString()} 
                onValueChange={(value) => setForm(prev => ({ ...prev, rating: parseInt(value) }))}
                className="flex space-x-2"
              >
                {[1, 2, 3, 4, 5].map(rating => (
                  <div key={rating} className="flex flex-col items-center">
                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} className="sr-only" />
                    <Label 
                      htmlFor={`rating-${rating}`}
                      className={`flex flex-col items-center cursor-pointer hover:opacity-90 ${form.rating === rating ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      <Star className={`h-8 w-8 ${form.rating >= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                      <span className="text-xs mt-1">{rating}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="comments">Comments (Optional)</Label>
              <Textarea
                id="comments"
                value={form.comments}
                onChange={(e) => setForm(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Enter feedback comments"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!form.programmeId || !form.memberId}
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
