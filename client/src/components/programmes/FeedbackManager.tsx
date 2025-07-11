
import React, { useState } from 'react';
import { Member, Programme, ProgrammeFeedback } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Plus, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';

export interface FeedbackManagerProps {
  programmes: Programme[];
  feedback: ProgrammeFeedback[];
  members: Member[];
  onAddFeedback: (feedback: Omit<ProgrammeFeedback, "id">) => ProgrammeFeedback;
}

export const FeedbackManager = ({
  programmes = [],
  feedback = [],
  members = [],
  onAddFeedback
}: FeedbackManagerProps) => {
  const [selectedProgrammeId, setSelectedProgrammeId] = useState('');
  const [isAddFeedbackDialogOpen, setIsAddFeedbackDialogOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    programmeId: '',
    memberId: '',
    rating: 5,
    comments: '',
    suggestions: '',
    wouldRecommend: true
  });

  const selectedProgramme = programmes.find(p => p.id === selectedProgrammeId);
  const programmeFeedback = feedback.filter(f => f.programmeId === selectedProgrammeId);

  const feedbackStats = React.useMemo(() => {
    if (programmeFeedback.length === 0) return { average: 0, total: 0, distribution: {} };

    const total = programmeFeedback.length;
    const sum = programmeFeedback.reduce((acc, f) => acc + f.rating, 0);
    const average = sum / total;

    const distribution = programmeFeedback.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return { average, total, distribution };
  }, [programmeFeedback]);

  const handleAddFeedback = () => {
    if (!feedbackData.programmeId || !feedbackData.memberId) return;

    const newFeedback = {
      programmeId: feedbackData.programmeId,
      memberId: feedbackData.memberId,
      rating: feedbackData.rating,
      comments: feedbackData.comments,
      suggestions: feedbackData.suggestions,
      wouldRecommend: feedbackData.wouldRecommend,
      submittedAt: new Date()
    };

    onAddFeedback(newFeedback);
    setIsAddFeedbackDialogOpen(false);
    setFeedbackData({
      programmeId: '',
      memberId: '',
      rating: 5,
      comments: '',
      suggestions: '',
      wouldRecommend: true
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRecommendationIcon = (wouldRecommend: boolean) => {
    return wouldRecommend ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Programme Selection */}
      <div className="space-y-2">
        <Label>Select Programme</Label>
        <Select value={selectedProgrammeId} onValueChange={setSelectedProgrammeId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a programme" />
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

      {selectedProgramme && (
        <>
          {/* Feedback Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Feedback Overview
                </div>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setFeedbackData({...feedbackData, programmeId: selectedProgrammeId});
                    setIsAddFeedbackDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feedback
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{feedbackStats.total}</div>
                  <div className="text-sm text-gray-600">Total Feedback</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getRatingColor(feedbackStats.average)}`}>
                    {feedbackStats.average.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center mb-1">
                    {renderStars(Math.round(feedbackStats.average))}
                  </div>
                  <div className="text-sm text-gray-600">Star Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {programmeFeedback.filter(f => f.wouldRecommend).length}
                  </div>
                  <div className="text-sm text-gray-600">Would Recommend</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = feedbackStats.distribution[rating] || 0;
                  const percentage = feedbackStats.total > 0 ? (count / feedbackStats.total) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="flex items-center gap-1 w-16">
                        <span className="text-sm">{rating}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Recommend</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programmeFeedback.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No feedback yet for this programme
                      </TableCell>
                    </TableRow>
                  ) : (
                    programmeFeedback.slice(0, 10).map(feedbackItem => {
                      const member = members.find(m => m.id === feedbackItem.memberId);
                      return (
                        <TableRow key={feedbackItem.id}>
                          <TableCell className="font-medium">
                            {member ? `${member.firstName} ${member.lastName}` : 'Anonymous'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {renderStars(feedbackItem.rating)}
                              <span className="ml-1 text-sm">({feedbackItem.rating})</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={feedbackItem.comments}>
                              {feedbackItem.comments || '-'}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getRecommendationIcon(feedbackItem.wouldRecommend)}
                              <span className="text-sm">
                                {feedbackItem.wouldRecommend ? 'Yes' : 'No'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(feedbackItem.submittedAt), 'MMM dd, yyyy')}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add Feedback Dialog */}
      <Dialog open={isAddFeedbackDialogOpen} onOpenChange={setIsAddFeedbackDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Member</Label>
              <Select 
                value={feedbackData.memberId} 
                onValueChange={(value) => setFeedbackData({...feedbackData, memberId: value})}
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
            
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select 
                value={feedbackData.rating.toString()} 
                onValueChange={(value) => setFeedbackData({...feedbackData, rating: parseInt(value)})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>
                      <div className="flex items-center gap-2">
                        {renderStars(rating)}
                        <span>({rating})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Comments</Label>
              <Textarea
                value={feedbackData.comments}
                onChange={(e) => setFeedbackData({...feedbackData, comments: e.target.value})}
                placeholder="Share your thoughts..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Suggestions</Label>
              <Textarea
                value={feedbackData.suggestions}
                onChange={(e) => setFeedbackData({...feedbackData, suggestions: e.target.value})}
                placeholder="Any suggestions for improvement?"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Would Recommend</Label>
              <Select 
                value={feedbackData.wouldRecommend.toString()} 
                onValueChange={(value) => setFeedbackData({...feedbackData, wouldRecommend: value === 'true'})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes, I would recommend</SelectItem>
                  <SelectItem value="false">No, I would not recommend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFeedbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFeedback}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackManager;
