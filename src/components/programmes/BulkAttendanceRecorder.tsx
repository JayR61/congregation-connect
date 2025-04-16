import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, Search, UserRound, Users } from 'lucide-react';
import { BulkAttendanceRecord, Member, Programme } from '@/types';

interface BulkAttendanceRecorderProps {
  programmes: Programme[];
  members: Member[];
  onRecordBulkAttendance: (record: BulkAttendanceRecord) => void;
}

export const BulkAttendanceRecorder = ({ 
  programmes, 
  members,
  onRecordBulkAttendance
}: BulkAttendanceRecorderProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<{[key: string]: boolean}>({});
  const [memberNotes, setMemberNotes] = useState<{[key: string]: string}>({});
  const [selectedProgramme, setSelectedProgramme] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectAll, setSelectAll] = useState(false);
  
  const filteredMembers = members.filter(member => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           member.email.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    
    if (checked) {
      const allSelected = filteredMembers.reduce((acc, member) => {
        acc[member.id] = true;
        return acc;
      }, {} as {[key: string]: boolean});
      
      setSelectedMembers(allSelected);
    } else {
      setSelectedMembers({});
    }
  };
  
  const handleSelectMember = (memberId: string, checked: boolean) => {
    setSelectedMembers(prev => ({
      ...prev,
      [memberId]: checked
    }));
    
    const updatedSelectedMembers = {
      ...selectedMembers,
      [memberId]: checked
    };
    
    const allSelected = filteredMembers.every(member => 
      updatedSelectedMembers[member.id] === true
    );
    
    setSelectAll(allSelected);
  };
  
  const handleAddNotes = (memberId: string, notes: string) => {
    setMemberNotes(prev => ({
      ...prev,
      [memberId]: notes
    }));
  };
  
  const handleSubmit = () => {
    if (!selectedProgramme) return;
    
    const selectedMemberIds = Object.entries(selectedMembers)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => id);
    
    if (selectedMemberIds.length === 0) return;
    
    const bulkRecord: BulkAttendanceRecord = {
      programmeId: selectedProgramme,
      date: selectedDate,
      memberIds: selectedMemberIds.map(id => ({
        memberId: id,
        isPresent: true,
        notes: memberNotes[id] || undefined
      }))
    };
    
    onRecordBulkAttendance(bulkRecord);
    setIsDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setSelectedMembers({});
    setMemberNotes({});
    setSelectedProgramme(null);
    setSelectedDate(new Date());
    setSearchQuery('');
    setSelectAll(false);
  };
  
  const selectedCount = Object.values(selectedMembers).filter(Boolean).length;
  
  return (
    <div>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Users className="mr-2 h-4 w-4" /> Record Bulk Attendance
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Record Bulk Attendance</DialogTitle>
            <DialogDescription>
              Record attendance for multiple members at once.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="programme">Programme</Label>
                <Select 
                  value={selectedProgramme || ''} 
                  onValueChange={setSelectedProgramme}
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
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div>
              <Label htmlFor="search">Search Members</Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="search"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="border rounded-md">
              <div className="p-2 border-b bg-muted/50 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="selectAll" 
                    checked={selectAll}
                    onCheckedChange={(checked) => handleSelectAll(checked === true)}
                  />
                  <label 
                    htmlFor="selectAll" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Select All
                  </label>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedCount} of {filteredMembers.length} selected
                </div>
              </div>
              
              <ScrollArea className="h-[300px]">
                <div className="p-2 space-y-2">
                  {filteredMembers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No members found.
                    </div>
                  ) : (
                    filteredMembers.map(member => {
                      const isSelected = selectedMembers[member.id] === true;
                      
                      return (
                        <div 
                          key={member.id} 
                          className={cn(
                            "flex items-center justify-between p-2 rounded-md",
                            isSelected ? "bg-muted/70" : "hover:bg-muted/20"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id={`member-${member.id}`}
                              checked={isSelected}
                              onCheckedChange={(checked) => handleSelectMember(member.id, checked === true)}
                            />
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                {member.avatar ? (
                                  <img 
                                    src={member.avatar} 
                                    alt={`${member.firstName} ${member.lastName}`}
                                    className="h-8 w-8 rounded-full"
                                  />
                                ) : (
                                  <UserRound className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {member.firstName} {member.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <div className="ml-2 flex-1 max-w-[200px]">
                              <Input 
                                placeholder="Notes (optional)"
                                value={memberNotes[member.id] || ''}
                                onChange={(e) => handleAddNotes(member.id, e.target.value)}
                                className="h-8 text-xs"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
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
              disabled={!selectedProgramme || selectedCount === 0}
            >
              Record Attendance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
