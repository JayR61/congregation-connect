
import React, { useState } from 'react';
import { Programme, ProgrammeKPI } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/lib/toast';
import { BarChart3, PlusCircle, Target } from 'lucide-react';

export interface KPIManagerProps {
  programmes: Programme[];
  kpis: ProgrammeKPI[];
  onAddKPI: (kpi: Omit<ProgrammeKPI, 'id'>) => any;
  onUpdateKPI: (id: string, progress: number) => boolean;
}

const KPIManager = ({ programmes, kpis, onAddKPI, onUpdateKPI }: KPIManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProgramme, setSelectedProgramme] = useState<string>('');
  const [newKPI, setNewKPI] = useState({
    title: '',
    description: '',
    target: 0,
    current: 0,
    unit: 'people'
  });
  const [progressUpdate, setProgressUpdate] = useState<{
    kpiId: string;
    value: number;
  }>({
    kpiId: '',
    value: 0
  });
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  const handleAddKPI = () => {
    if (!selectedProgramme || !newKPI.title || newKPI.target <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    onAddKPI({
      programmeId: selectedProgramme,
      title: newKPI.title,
      name: newKPI.title, // For compatibility
      description: newKPI.description,
      target: newKPI.target,
      current: newKPI.current,
      unit: newKPI.unit,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setIsDialogOpen(false);
    setNewKPI({
      title: '',
      description: '',
      target: 0,
      current: 0,
      unit: 'people'
    });
    setSelectedProgramme('');
    toast.success("KPI added successfully");
  };

  const handleUpdateProgress = () => {
    if (!progressUpdate.kpiId || progressUpdate.value < 0) {
      toast.error("Please select a KPI and enter a valid progress value");
      return;
    }

    onUpdateKPI(progressUpdate.kpiId, progressUpdate.value);
    setIsUpdateDialogOpen(false);
    setProgressUpdate({
      kpiId: '',
      value: 0
    });
    toast.success("KPI progress updated successfully");
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getProgessPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Programme KPIs</h2>
          <p className="text-muted-foreground">Track and manage key performance indicators for your programmes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" /> Add New KPI
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Key Performance Indicator</DialogTitle>
              <DialogDescription>
                Create a new KPI to track the progress of your programme
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="programme" className="text-right">
                  Programme
                </Label>
                <div className="col-span-3">
                  <Select value={selectedProgramme} onValueChange={setSelectedProgramme}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a programme" />
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
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newKPI.title}
                  onChange={e => setNewKPI(prev => ({ ...prev, title: e.target.value }))}
                  className="col-span-3"
                  placeholder="e.g., Attendance Target, Conversion Rate"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newKPI.description}
                  onChange={e => setNewKPI(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-3"
                  placeholder="Brief description of this KPI"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="target" className="text-right">
                  Target
                </Label>
                <Input
                  id="target"
                  type="number"
                  value={newKPI.target}
                  onChange={e => setNewKPI(prev => ({ ...prev, target: Number(e.target.value) }))}
                  className="col-span-3"
                  placeholder="Target value to achieve"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="current" className="text-right">
                  Current
                </Label>
                <Input
                  id="current"
                  type="number"
                  value={newKPI.current}
                  onChange={e => setNewKPI(prev => ({ ...prev, current: Number(e.target.value) }))}
                  className="col-span-3"
                  placeholder="Current progress value"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unit
                </Label>
                <div className="col-span-3">
                  <Select value={newKPI.unit} onValueChange={val => setNewKPI(prev => ({ ...prev, unit: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="people">People</SelectItem>
                      <SelectItem value="percent">Percent</SelectItem>
                      <SelectItem value="hours">Hours</SelectItem>
                      <SelectItem value="dollars">Dollars</SelectItem>
                      <SelectItem value="units">Units</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddKPI}>Add KPI</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update KPI Progress</DialogTitle>
              <DialogDescription>
                Update the current progress value for this KPI
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="kpi" className="text-right">
                  KPI
                </Label>
                <div className="col-span-3">
                  <Select value={progressUpdate.kpiId} onValueChange={val => setProgressUpdate(prev => ({ ...prev, kpiId: val }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a KPI" />
                    </SelectTrigger>
                    <SelectContent>
                      {kpis.map(kpi => (
                        <SelectItem key={kpi.id} value={kpi.id}>
                          {kpi.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  New Value
                </Label>
                <Input
                  id="value"
                  type="number"
                  value={progressUpdate.value}
                  onChange={e => setProgressUpdate(prev => ({ ...prev, value: Number(e.target.value) }))}
                  className="col-span-3"
                  placeholder="New progress value"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateProgress}>Update Progress</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {kpis.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map(kpi => {
            const programme = programmes.find(p => p.id === kpi.programmeId);
            const progressPercentage = getProgessPercentage(kpi.current, kpi.target);
            
            return (
              <Card key={kpi.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{kpi.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{programme?.name || 'Unknown Programme'}</p>
                    </div>
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>{kpi.current} {kpi.unit}</span>
                        <span>{kpi.target} {kpi.unit}</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-right mt-1 text-muted-foreground">{progressPercentage}% complete</p>
                    </div>
                    
                    {kpi.description && (
                      <div>
                        <p className="text-sm text-muted-foreground">{kpi.description}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full" 
                    onClick={() => {
                      setProgressUpdate({
                        kpiId: kpi.id,
                        value: kpi.current
                      });
                      setIsUpdateDialogOpen(true);
                    }}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" /> Update Progress
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No KPIs Defined</h3>
          <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
            Create key performance indicators to track and measure the success of your church programmes.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Your First KPI
          </Button>
        </div>
      )}
    </div>
  );
};

export { KPIManager };
export default KPIManager;
