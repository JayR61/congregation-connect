import { useState, useEffect } from 'react';
import { 
  Programme, ProgrammeAttendance, ProgrammeResource, ProgrammeFeedback,
  ProgrammeReminder, ProgrammeKPI, ProgrammeTemplate, ProgrammeCategory,
  ProgrammeTag, BulkAttendanceRecord
} from '@/types';
import { toast } from '@/lib/toast';
import { 
  saveProgrammes, saveAttendance, getResources, saveResources,
  getFeedback, saveFeedback, getReminders, saveReminders,
  getKPIs, saveKPIs, getTemplates, saveTemplates,
  getCategories, saveCategories, getTags, saveTags,
  getProgrammeTags, saveProgrammeTags,
  generateProgrammePDF, scheduleReminder, exportToICS, processReminders
} from '@/services/programmeService';

interface ProgrammeActionsProps {
  programmes: Programme[];
  setProgrammes: React.Dispatch<React.SetStateAction<Programme[]>>;
  attendance: ProgrammeAttendance[];
  setAttendance: React.Dispatch<React.SetStateAction<ProgrammeAttendance[]>>;
  currentUser: any;
}

export const useProgrammeActions = ({
  programmes,
  setProgrammes,
  attendance,
  setAttendance,
  currentUser,
}: ProgrammeActionsProps) => {
  const [resources, setResources] = useState<ProgrammeResource[]>([]);
  const [feedback, setFeedback] = useState<ProgrammeFeedback[]>([]);
  const [reminders, setReminders] = useState<ProgrammeReminder[]>([]);
  const [kpis, setKpis] = useState<ProgrammeKPI[]>([]);
  const [templates, setTemplates] = useState<ProgrammeTemplate[]>([]);
  const [categories, setCategories] = useState<ProgrammeCategory[]>([]);
  const [tags, setTags] = useState<ProgrammeTag[]>([]);
  const [programmeTags, setProgrammeTags] = useState<{programmeId: string, tagId: string}[]>([]);

  useEffect(() => {
    setResources(getResources());
    setFeedback(getFeedback());
    setReminders(getReminders());
    setKpis(getKPIs());
    setTemplates(getTemplates());
    setCategories(getCategories());
    setTags(getTags());
    setProgrammeTags(getProgrammeTags());
  }, []);
  
  useEffect(() => {
    saveProgrammes(programmes);
  }, [programmes]);

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);
  
  useEffect(() => {
    saveResources(resources);
  }, [resources]);
  
  useEffect(() => {
    saveFeedback(feedback);
  }, [feedback]);
  
  useEffect(() => {
    saveReminders(reminders);
  }, [reminders]);
  
  useEffect(() => {
    saveKPIs(kpis);
  }, [kpis]);
  
  useEffect(() => {
    saveTemplates(templates);
  }, [templates]);
  
  useEffect(() => {
    saveCategories(categories);
  }, [categories]);
  
  useEffect(() => {
    saveTags(tags);
  }, [tags]);
  
  useEffect(() => {
    saveProgrammeTags(programmeTags);
  }, [programmeTags]);

  const addProgramme = (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => {
    try {
      const newProgramme: Programme = {
        id: `prog-${Date.now()}`,
        ...programmeData,
        currentAttendees: 0,
        attendees: [],
      };

      setProgrammes(prev => [...prev, newProgramme]);
      toast.success('Programme created successfully');
      return newProgramme;
    } catch (error) {
      console.error('Error adding programme:', error);
      toast.error('Failed to create programme');
      return null;
    }
  };

  const updateProgramme = (id: string, programmeData: Partial<Programme>) => {
    try {
      setProgrammes(prev => 
        prev.map(programme => 
          programme.id === id 
            ? { ...programme, ...programmeData } 
            : programme
        )
      );
      toast.success('Programme updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating programme:', error);
      toast.error('Failed to update programme');
      return false;
    }
  };

  const deleteProgramme = (id: string) => {
    try {
      setProgrammes(prev => prev.filter(programme => programme.id !== id));
      setAttendance(prev => prev.filter(record => record.programmeId !== id));
      setResources(prev => prev.filter(resource => resource.programmeId !== id));
      setFeedback(prev => prev.filter(f => f.programmeId !== id));
      setReminders(prev => prev.filter(r => r.programmeId !== id));
      setKpis(prev => prev.filter(k => k.programmeId !== id));
      setProgrammeTags(prev => prev.filter(pt => pt.programmeId !== id));
      
      toast.success('Programme deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting programme:', error);
      toast.error('Failed to delete programme');
      return false;
    }
  };

  const recordAttendance = (
    programmeId: string, 
    memberId: string, 
    date: Date, 
    isPresent: boolean, 
    notes?: string
  ) => {
    try {
      const newAttendance: ProgrammeAttendance = {
        id: `att-${Date.now()}`,
        programmeId,
        memberId,
        date,
        isPresent,
        notes
      };

      setAttendance(prev => [...prev, newAttendance]);
      
      if (isPresent) {
        setProgrammes(prev => prev.map(prog => {
          if (prog.id === programmeId && !prog.attendees.includes(memberId)) {
            return {
              ...prog,
              currentAttendees: prog.currentAttendees + 1,
              attendees: [...prog.attendees, memberId]
            };
          }
          return prog;
        }));
      }

      toast.success('Attendance recorded successfully');
      return newAttendance;
    } catch (error) {
      console.error('Error recording attendance:', error);
      toast.error('Failed to record attendance');
      return null;
    }
  };

  const recordBulkAttendance = (bulkRecord: BulkAttendanceRecord) => {
    try {
      const { programmeId, date, memberIds } = bulkRecord;
      
      const newAttendanceRecords = memberIds.map(member => ({
        id: `att-${Date.now()}-${member.memberId}`,
        programmeId,
        memberId: member.memberId,
        date,
        isPresent: member.isPresent,
        notes: member.notes
      }));
      
      setAttendance(prev => [...prev, ...newAttendanceRecords]);
      
      const presentMemberIds = memberIds
        .filter(m => m.isPresent)
        .map(m => m.memberId);
      
      if (presentMemberIds.length > 0) {
        setProgrammes(prev => prev.map(prog => {
          if (prog.id === programmeId) {
            const newAttendees = presentMemberIds.filter(id => !prog.attendees.includes(id));
            
            if (newAttendees.length > 0) {
              return {
                ...prog,
                currentAttendees: prog.currentAttendees + newAttendees.length,
                attendees: [...prog.attendees, ...newAttendees]
              };
            }
          }
          return prog;
        }));
      }
      
      toast.success(`Recorded attendance for ${memberIds.length} members`);
      return newAttendanceRecords;
    } catch (error) {
      console.error('Error recording bulk attendance:', error);
      toast.error('Failed to record bulk attendance');
      return null;
    }
  };

  const exportProgrammesToCSV = () => {
    try {
      let csvContent = "Name,Type,Start Date,End Date,Location,Coordinator,Capacity,Attendees,Description\n";
      
      programmes.forEach(programme => {
        const startDate = new Date(programme.startDate).toISOString().split('T')[0];
        const endDate = programme.endDate ? new Date(programme.endDate).toISOString().split('T')[0] : '';
        
        csvContent += [
          `"${programme.name}"`,
          `"${programme.type}"`,
          `"${startDate}"`,
          `"${endDate}"`,
          `"${programme.location}"`,
          `"${programme.coordinator}"`,
          programme.capacity,
          programme.currentAttendees,
          `"${programme.description.replace(/"/g, '""')}"`
        ].join(',') + "\n";
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'church_programmes.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Programmes exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting programmes:', error);
      toast.error('Failed to export programmes');
      return false;
    }
  };

  const exportAttendanceToCSV = (programmeId: string) => {
    try {
      const programme = programmes.find(p => p.id === programmeId);
      if (!programme) {
        toast.error('Programme not found');
        return false;
      }
      
      const programmeAttendance = attendance.filter(a => a.programmeId === programmeId);
      if (programmeAttendance.length === 0) {
        toast.error('No attendance records found for this programme');
        return false;
      }
      
      let csvContent = "Date,Member ID,Status,Notes\n";
      
      programmeAttendance.forEach(record => {
        const date = new Date(record.date).toISOString().split('T')[0];
        const status = record.isPresent ? "Present" : "Absent";
        const notes = record.notes || "";
        
        csvContent += `"${date}","${record.memberId}","${status}","${notes}"\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${programme.name}_attendance.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Attendance records exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting attendance:', error);
      toast.error('Failed to export attendance records');
      return false;
    }
  };

  const exportProgrammeToPDF = (programmeId: string, members: any[]) => {
    try {
      const programme = programmes.find(p => p.id === programmeId);
      if (!programme) {
        toast.error('Programme not found');
        return null;
      }
      
      const programmeAttendance = attendance.filter(a => a.programmeId === programmeId);
      const dataUrl = generateProgrammePDF(programme, members, programmeAttendance);
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${programme.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('PDF exported successfully');
      return dataUrl;
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Failed to export PDF');
      return null;
    }
  };

  const createProgrammeReminder = (reminder: Omit<ProgrammeReminder, 'id' | 'sentAt' | 'status'>) => {
    try {
      const newReminder = scheduleReminder(reminder);
      setReminders(prev => [...prev, newReminder]);
      toast.success('Reminder scheduled successfully');
      return newReminder;
    } catch (error) {
      console.error('Error creating reminder:', error);
      toast.error('Failed to schedule reminder');
      return null;
    }
  };

  const checkAndSendReminders = () => {
    try {
      const sentReminders = processReminders();
      
      if (sentReminders.length > 0) {
        setReminders(getReminders());
        toast.success(`Sent ${sentReminders.length} reminders`);
      }
      
      return sentReminders;
    } catch (error) {
      console.error('Error processing reminders:', error);
      toast.error('Failed to process reminders');
      return [];
    }
  };

  const addProgrammeCategory = (category: Omit<ProgrammeCategory, 'id'>) => {
    try {
      const newCategory: ProgrammeCategory = {
        id: `cat-${Date.now()}`,
        ...category
      };
      
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category added successfully');
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
      return null;
    }
  };

  const addProgrammeTag = (tag: Omit<ProgrammeTag, 'id'>) => {
    try {
      const newTag: ProgrammeTag = {
        id: `tag-${Date.now()}`,
        ...tag
      };
      
      setTags(prev => [...prev, newTag]);
      toast.success('Tag added successfully');
      return newTag;
    } catch (error) {
      console.error('Error adding tag:', error);
      toast.error('Failed to add tag');
      return null;
    }
  };

  const assignTagToProgramme = (programmeId: string, tagId: string) => {
    try {
      const exists = programmeTags.some(pt => 
        pt.programmeId === programmeId && pt.tagId === tagId
      );
      
      if (!exists) {
        setProgrammeTags(prev => [...prev, { programmeId, tagId }]);
        toast.success('Tag assigned successfully');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error assigning tag:', error);
      toast.error('Failed to assign tag');
      return false;
    }
  };

  const removeTagFromProgramme = (programmeId: string, tagId: string) => {
    try {
      setProgrammeTags(prev => 
        prev.filter(pt => 
          !(pt.programmeId === programmeId && pt.tagId === tagId)
        )
      );
      toast.success('Tag removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Failed to remove tag');
      return false;
    }
  };

  const allocateResource = (resource: Omit<ProgrammeResource, 'id'>) => {
    try {
      const newResource: ProgrammeResource = {
        id: `res-${Date.now()}`,
        ...resource
      };
      
      setResources(prev => [...prev, newResource]);
      toast.success('Resource allocated successfully');
      return newResource;
    } catch (error) {
      console.error('Error allocating resource:', error);
      toast.error('Failed to allocate resource');
      return null;
    }
  };

  const updateResourceStatus = (resourceId: string, status: ProgrammeResource['status']) => {
    try {
      setResources(prev => 
        prev.map(resource => 
          resource.id === resourceId
            ? { ...resource, status }
            : resource
        )
      );
      toast.success('Resource status updated');
      return true;
    } catch (error) {
      console.error('Error updating resource status:', error);
      toast.error('Failed to update resource status');
      return false;
    }
  };

  const createProgrammeTemplate = (templateData: Omit<ProgrammeTemplate, 'id' | 'createdById' | 'createdAt'>) => {
    try {
      const newTemplate: ProgrammeTemplate = {
        id: `templ-${Date.now()}`,
        ...templateData,
        createdById: currentUser?.id || 'unknown',
        createdAt: new Date()
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      toast.success('Template created successfully');
      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
      return null;
    }
  };

  const createProgrammeFromTemplate = (templateId: string, overrideData: Partial<Programme> = {}) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) {
        toast.error('Template not found');
        return null;
      }
      
      const programmeData = {
        name: template.name,
        description: template.description,
        type: template.type,
        startDate: new Date(),
        capacity: template.capacity,
        location: '',
        coordinator: '',
        ...overrideData
      };
      
      const newProgramme = addProgramme(programmeData);
      
      if (newProgramme) {
        template.resources.forEach(resource => {
          allocateResource({
            programmeId: newProgramme.id,
            name: resource.name,
            type: resource.type,
            quantity: resource.quantity,
            unit: resource.unit,
            cost: resource.cost,
            notes: resource.notes,
            status: 'allocated'
          });
        });
      }
      
      return newProgramme;
    } catch (error) {
      console.error('Error creating programme from template:', error);
      toast.error('Failed to create programme from template');
      return null;
    }
  };

  const exportProgrammeToCalendar = (programmeId: string) => {
    try {
      const programme = programmes.find(p => p.id === programmeId);
      if (!programme) {
        toast.error('Programme not found');
        return null;
      }
      
      const icsFileUrl = exportToICS(programme);
      
      const link = document.createElement('a');
      link.href = icsFileUrl;
      link.download = `${programme.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Calendar event exported successfully');
      return icsFileUrl;
    } catch (error) {
      console.error('Error exporting to calendar:', error);
      toast.error('Failed to export calendar event');
      return null;
    }
  };

  const addProgrammeFeedback = (feedback: Omit<ProgrammeFeedback, 'id' | 'submittedAt'>) => {
    try {
      const newFeedback: ProgrammeFeedback = {
        id: `feedback-${Date.now()}`,
        ...feedback,
        submittedAt: new Date()
      };
      
      setFeedback(prev => [...prev, newFeedback]);
      toast.success('Feedback submitted successfully');
      return newFeedback;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
      return null;
    }
  };

  const addProgrammeKPI = (kpi: Omit<ProgrammeKPI, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = new Date();
      const newKPI: ProgrammeKPI = {
        id: `kpi-${Date.now()}`,
        ...kpi,
        createdAt: now,
        updatedAt: now
      };
      
      setKpis(prev => [...prev, newKPI]);
      toast.success('KPI added successfully');
      return newKPI;
    } catch (error) {
      console.error('Error adding KPI:', error);
      toast.error('Failed to add KPI');
      return null;
    }
  };

  const updateKPIProgress = (kpiId: string, current: number) => {
    try {
      setKpis(prev => 
        prev.map(kpi => 
          kpi.id === kpiId
            ? { ...kpi, current, updatedAt: new Date() }
            : kpi
        )
      );
      toast.success('KPI updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating KPI:', error);
      toast.error('Failed to update KPI');
      return false;
    }
  };

  return {
    addProgramme,
    updateProgramme,
    deleteProgramme,
    recordAttendance,
    exportProgrammesToCSV,
    exportAttendanceToCSV,
    resources,
    feedback,
    reminders,
    kpis,
    templates,
    categories,
    tags,
    programmeTags,
    createProgrammeReminder,
    checkAndSendReminders,
    addProgrammeCategory,
    addProgrammeTag,
    assignTagToProgramme,
    removeTagFromProgramme,
    allocateResource,
    updateResourceStatus,
    exportProgrammeToPDF,
    createProgrammeTemplate,
    createProgrammeFromTemplate,
    exportProgrammeToCalendar,
    addProgrammeFeedback,
    addProgrammeKPI,
    updateKPIProgress,
    recordBulkAttendance
  };
};
