
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const KPIManager = ({ programmeId }: { programmeId: string }) => {
  const { addProgrammeKPI } = useAppContext();
  const [newKPI, setNewKPI] = useState({
    name: "",
    title: "",
    description: "",
    target: 0,
    actual: 0,
    current: 0,
    unit: "count",
    notes: ""
  });

  const handleAddKPI = () => {
    if (!newKPI.name || !newKPI.target) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Fix for the createdAt field error
    const kpiData = {
      programmeId,
      name: newKPI.name,
      title: newKPI.title,
      description: newKPI.description,
      target: parseFloat(String(newKPI.target)),
      actual: newKPI.actual ? parseFloat(String(newKPI.actual)) : 0,
      current: newKPI.current ? parseFloat(String(newKPI.current)) : 0,
      unit: newKPI.unit || "count",
      notes: newKPI.notes
      // Remove the createdAt field, it will be handled by the backend
    };
    
    addProgrammeKPI(kpiData);
    
    setNewKPI({
      name: "",
      title: "",
      description: "",
      target: 0,
      actual: 0,
      current: 0,
      unit: "count",
      notes: ""
    });
    toast({
      title: "KPI added",
      description: "Successfully added KPI to the programme."
    });
  };
  
  return (
    <div>
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="kpi-name">KPI Name</Label>
            <Input
              id="kpi-name"
              value={newKPI.name}
              onChange={(e) => setNewKPI({ ...newKPI, name: e.target.value })}
              placeholder="e.g., Attendance Rate"
            />
          </div>
          <div>
            <Label htmlFor="kpi-target">Target Value</Label>
            <Input
              id="kpi-target"
              type="number"
              value={newKPI.target}
              onChange={(e) => setNewKPI({ ...newKPI, target: Number(e.target.value) })}
              placeholder="e.g., 80"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="kpi-title">KPI Title</Label>
            <Input
              id="kpi-title"
              value={newKPI.title}
              onChange={(e) => setNewKPI({ ...newKPI, title: e.target.value })}
              placeholder="e.g., Improve Attendance"
            />
          </div>
          <div>
            <Label htmlFor="kpi-unit">Unit</Label>
            <Input
              id="kpi-unit"
              value={newKPI.unit}
              onChange={(e) => setNewKPI({ ...newKPI, unit: e.target.value })}
              placeholder="e.g., %"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="kpi-description">Description</Label>
          <Textarea
            id="kpi-description"
            value={newKPI.description}
            onChange={(e) => setNewKPI({ ...newKPI, description: e.target.value })}
            placeholder="e.g., Increase attendance rate by 20%."
          />
        </div>
        <div>
          <Label htmlFor="kpi-notes">Notes</Label>
          <Textarea
            id="kpi-notes"
            value={newKPI.notes}
            onChange={(e) => setNewKPI({ ...newKPI, notes: e.target.value })}
            placeholder="Additional notes about the KPI."
          />
        </div>
        <Button onClick={handleAddKPI}>Add KPI</Button>
      </div>
    </div>
  );
};

export default KPIManager;
