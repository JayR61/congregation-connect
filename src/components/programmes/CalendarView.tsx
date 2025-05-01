
import React, { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Programme } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isSameDay, parseISO } from 'date-fns';

export interface CalendarViewProps {
  programmes: Programme[];
  onDateSelect?: (date: Date) => void;
}

export const CalendarView = ({ programmes, onDateSelect = () => {} }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Process programmes to create a map of dates with events
  const programmesByDate = useMemo(() => {
    const dateMap = new Map<string, Programme[]>();
    
    programmes.forEach(programme => {
      const startDate = format(new Date(programme.startDate), 'yyyy-MM-dd');
      
      if (!dateMap.has(startDate)) {
        dateMap.set(startDate, []);
      }
      
      dateMap.get(startDate)?.push(programme);
      
      // If the programme has an end date, mark all days in between
      if (programme.endDate) {
        const start = new Date(programme.startDate);
        const end = new Date(programme.endDate);
        
        // Skip if it's a single-day event
        if (isSameDay(start, end)) return;
        
        // Add each day in the range
        const current = new Date(start);
        current.setDate(current.getDate() + 1); // Start from the next day
        
        while (current <= end) {
          const dateKey = format(current, 'yyyy-MM-dd');
          
          if (!dateMap.has(dateKey)) {
            dateMap.set(dateKey, []);
          }
          
          dateMap.get(dateKey)?.push(programme);
          current.setDate(current.getDate() + 1);
        }
      }
    });
    
    return dateMap;
  }, [programmes]);
  
  // Get programmes for the selected date
  const selectedDateProgrammes = useMemo(() => {
    if (!selectedDate) return [];
    
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return programmesByDate.get(dateKey) || [];
  }, [selectedDate, programmesByDate]);
  
  // Custom day rendering to show dots for events
  const renderDay = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const hasEvents = programmesByDate.has(dateKey);
    const eventCount = programmesByDate.get(dateKey)?.length || 0;
    
    return (
      <div className="relative">
        <div>{date.getDate()}</div>
        {hasEvents && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {eventCount > 3 ? (
              <Badge variant="outline" className="h-1.5 w-1.5 rounded-full bg-primary" />
            ) : (
              Array.from({ length: eventCount }).map((_, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className="h-1.5 w-1.5 rounded-full bg-primary" 
                />
              ))
            )}
          </div>
        )}
      </div>
    );
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      onDateSelect(date);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Calendar 
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
          components={{
            Day: ({ date }) => renderDay(date)
          }}
        />
        
        <div>
          <h3 className="text-lg font-medium mb-3">
            {selectedDate ? format(selectedDate, 'PPPP') : 'Select a date'}
          </h3>
          
          {selectedDateProgrammes.length > 0 ? (
            <div className="space-y-2">
              {selectedDateProgrammes.map(programme => (
                <Card key={programme.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{programme.name}</h4>
                        <p className="text-sm text-muted-foreground">{programme.location}</p>
                      </div>
                      <Badge>{programme.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No programmes scheduled for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
