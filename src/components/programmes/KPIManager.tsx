
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProgrammeKPI, Programme } from '@/types';
import { PlusCircle, TrendingUp, Edit, ChevronUp, ChevronDown } from 'lucide-react';
import { format } from "date-fns";

interface KPIManagerProps {
  programmes: Programme[];
  kpis: ProgrammeKPI[];
  onAddKPI: (kpi: Omit<ProgrammeKPI, 'id' | 'createdAt' | 'updatedAt'>) => ProgrammeKPI | null;
  onUpdateKPI: (kpiId: string, current: number) => boolean;
}

export const KPIManager = ({ 
  programmes, 
  kpis,
  onAddKPI,
  onUpdateKPI
}: KPIManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<ProgrammeKPI | null>(null);
  const [selectedProgrammeId, setSelectedProgrammeId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    programmeId: '',
    name: '',
    target: 0,
    current: 0,
    unit: ''
  });
  
  const [editForm, setEditForm] = useState({
    current: 0
  });
  
  const resetForm = () => {
    setForm({
      programmeId: '',
      name: '',
      target: 0,
      current: 0,
      unit: ''
    });
  };
  
  const resetEditForm = () => {
    setEditForm({
      current: 0
    });
    setSelectedKPI(null);
  };
  
  const handleSubmit = () => {
    onAddKPI(form);
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleEditSubmit = () => {
    if (!selectedKPI) return;
    
    onUpdateKPI(selectedKPI.id, editForm.current);
    setIsEditDialogOpen(false);
    resetEditForm();
  };
  
  // Filter KPIs by programme if selected
  const filteredKPIs = selectedProgrammeId
    ? kpis.filter(kpi => kpi.programmeId === selectedProgrammeId)
    : kpis;
  
  // Get programme name by ID
  const getProgrammeName = (programmeId: string) => {
    const programme = programmes.find(p => p.id === programmeId);
    return programme ? programme.name : 'Unknown Programme';
  };
  
  // Calculate completion percentage
  const getCompletionPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  // Prepare data for chart
  const chartData = filteredKPIs.map(kpi => ({
    name: kpi.name,
    target: kpi.target,
    current: kpi.current,
    programme: getProgrammeName(kpi.programmeId),
    completionPercentage: getCompletionPercentage(kpi.current, kpi.target)
  }));
  
  const openEditDialog = (kpi: ProgrammeKPI) => {
    setSelectedKPI(kpi);
    setEditForm({ current: kpi.current });
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Programme KPIs</h2>
          <p className="text-muted-foreground">
            Track key performance indicators for your programmes.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add KPI
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
            <SelectItem value="">All Programmes</SelectItem>
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
      
      <div className="grid grid-cols-1 gap-6">
        {kpis.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground mb-4">No KPIs defined yet.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Add Your First KPI
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>KPI Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar name="Current Value" dataKey="current" fill="#8884d8" />
                      <Bar name="Target" dataKey="target" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>KPI Details</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    {filteredKPIs.map(kpi => {
                      const completionPercentage = getCompletionPercentage(kpi.current, kpi.target);
                      const isComplete = completionPercentage === 100;
                      
                      return (
                        <div key={kpi.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{kpi.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {getProgrammeName(kpi.programmeId)}
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditDialog(kpi)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Update
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm mb-1">
                              <div>
                                <span className="font-medium">Current:</span> {kpi.current} {kpi.unit}
                              </div>
                              <div>
                                <span className="font-medium">Target:</span> {kpi.target} {kpi.unit}
                              </div>
                              <div className="flex items-center">
                                <span className={`font-medium ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
                                  {completionPercentage}%
                                </span>
                                {isComplete ? (
                                  <ChevronUp className="h-4 w-4 text-green-600 ml-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-blue-600 ml-1" />
                                )}
                              </div>
                            </div>
                            
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${completionPercentage}%` }}
                              ></div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground text-right">
                              Last updated: {format(new Date(kpi.updatedAt), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Add KPI Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add KPI</DialogTitle>
            <DialogDescription>
              Create a new key performance indicator for a programme.
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
              <Label htmlFor="name">KPI Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Attendance Rate, Participant Satisfaction"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Label htmlFor="current">Current Value</Label>
                <Input
                  id="current"
                  type="number"
                  value={form.current}
                  onChange={(e) => setForm(prev => ({ ...prev, current: parseFloat(e.target.value) || 0 }))}
                  placeholder="Current value"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="target">Target Value</Label>
                <Input
                  id="target"
                  type="number"
                  value={form.target}
                  onChange={(e) => setForm(prev => ({ ...prev, target: parseFloat(e.target.value) || 0 }))}
                  placeholder="Target value"
                />
              </div>
              
              <div className="col-span-1">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={form.unit}
                  onChange={(e) => setForm(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., %, people"
                />
              </div>
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
              disabled={!form.programmeId || !form.name || form.target <= 0}
            >
              Add KPI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit KPI Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update KPI Progress</DialogTitle>
            <DialogDescription>
              Update the current value for this KPI.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedKPI && (
              <>
                <div className="border rounded-md p-3 bg-muted/30">
                  <h4 className="font-medium mb-1">{selectedKPI.name}</h4>
                  <div className="text-sm">
                    <div>{getProgrammeName(selectedKPI.programmeId)}</div>
                    <div className="flex justify-between mt-1">
                      <div>Current: {selectedKPI.current} {selectedKPI.unit}</div>
                      <div>Target: {selectedKPI.target} {selectedKPI.unit}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="current">New Current Value</Label>
                  <Input
                    id="current"
                    type="number"
                    value={editForm.current}
                    onChange={(e) => setEditForm(prev => ({ ...prev, current: parseFloat(e.target.value) || 0 }))}
                    placeholder="Enter new value"
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              resetEditForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={!selectedKPI}
            >
              Update KPI
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
