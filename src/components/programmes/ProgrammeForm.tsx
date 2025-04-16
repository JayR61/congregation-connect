
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Programme } from "@/types";

interface ProgrammeFormProps {
  onSave: (programme: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => void;
  onCancel: () => void;
  initialData?: Partial<Programme>;
  isEditing?: boolean;
}

export const ProgrammeForm = ({
  onSave,
  onCancel,
  initialData = {},
  isEditing = false,
}: ProgrammeFormProps) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    description: initialData.description || '',
    type: initialData.type || 'ministry',
    startDate: initialData.startDate || new Date(),
    endDate: initialData.endDate,
    recurring: initialData.recurring || false,
    frequency: initialData.frequency,
    location: initialData.location || '',
    coordinator: initialData.coordinator || '',
    capacity: initialData.capacity || 0
  });

  const handleSubmit = () => {
    onSave({
      name: form.name,
      description: form.description,
      type: form.type as 'ministry' | 'counseling' | 'service' | 'training' | 'outreach',
      startDate: form.startDate,
      endDate: form.endDate,
      recurring: form.recurring,
      frequency: form.frequency,
      location: form.location,
      coordinator: form.coordinator,
      capacity: form.capacity
    });
  };

  const isFormValid = () => {
    return (
      form.name.trim() !== '' &&
      form.description.trim() !== '' &&
      form.location.trim() !== '' &&
      form.coordinator.trim() !== '' &&
      form.capacity > 0 &&
      (!form.recurring || form.frequency)
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Programme' : 'Add New Programme'}</DialogTitle>
        <DialogDescription>
          {isEditing 
            ? 'Update the details for this church programme.' 
            : 'Enter the details for the new church programme.'}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">Programme Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter programme name"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter programme description"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="type">Type</Label>
            <Select 
              value={form.type} 
              onValueChange={(value) => setForm(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ministry">Ministry</SelectItem>
                <SelectItem value="counseling">Counseling</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="outreach">Outreach</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter location"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="startDate">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !form.startDate && "text-muted-foreground"
                  )}
                >
                  {form.startDate ? (
                    format(form.startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.startDate}
                  onSelect={(date) => date && setForm(prev => ({ ...prev, startDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-1">
            <Label htmlFor="endDate">End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !form.endDate && "text-muted-foreground"
                  )}
                >
                  {form.endDate ? (
                    format(form.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={form.endDate}
                  onSelect={(date) => setForm(prev => ({ ...prev, endDate: date || undefined }))}
                  initialFocus
                  disabled={(date) => date < form.startDate}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="col-span-1">
            <Label htmlFor="coordinator">Coordinator</Label>
            <Input
              id="coordinator"
              value={form.coordinator}
              onChange={(e) => setForm(prev => ({ ...prev, coordinator: e.target.value }))}
              placeholder="Enter coordinator name"
            />
          </div>
          <div className="col-span-1">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={form.capacity}
              onChange={(e) => setForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
              placeholder="Enter capacity"
            />
          </div>
          <div className="col-span-2 flex items-center space-x-2">
            <Checkbox
              id="recurring"
              checked={form.recurring}
              onCheckedChange={(checked) => setForm(prev => ({ ...prev, recurring: checked === true }))}
            />
            <label
              htmlFor="recurring"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is this a recurring programme?
            </label>
          </div>
          {form.recurring && (
            <div className="col-span-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={form.frequency} 
                onValueChange={(value) => setForm(prev => ({ ...prev, frequency: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!isFormValid()}>
          {isEditing ? 'Update Programme' : 'Create Programme'}
        </Button>
      </DialogFooter>
    </>
  );
};
