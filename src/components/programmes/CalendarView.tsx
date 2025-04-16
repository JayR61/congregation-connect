
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Programme } from "@/types";
import { format, isSameDay } from "date-fns";

interface CalendarViewProps {
  programmes: Programme[];
  onDateSelect: (date: Date, programmes: Programme[]) => void;
}

export const CalendarView = ({ programmes, onDateSelect }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Function to determine if a programme occurs on a specific date
  const getProgrammesOnDate = (date: Date): Programme[] => {
    return programmes.filter(programme => {
      // Check if the date falls within the programme duration
      const startDate = new Date(programme.startDate);
      const endDate = programme.endDate ? new Date(programme.endDate) : new Date(2099, 11, 31);
      
      if (date >= startDate && date <= endDate) {
        // For non-recurring programmes, it's already covered
        if (!programme.recurring) return true;
        
        // For recurring programmes, check based on frequency
        const dayOfWeek = date.getDay();
        const dayOfMonth = date.getDate();
        const month = date.getMonth();
        
        switch (programme.frequency) {
          case 'daily':
            return true;
          case 'weekly':
            return dayOfWeek === startDate.getDay();
          case 'monthly':
            return dayOfMonth === startDate.getDate();
          case 'quarterly':
            return dayOfMonth === startDate.getDate() && (month - startDate.getMonth()) % 3 === 0;
          case 'yearly':
            return dayOfMonth === startDate.getDate() && month === startDate.getMonth();
          default:
            return false;
        }
      }
      return false;
    });
  };

  // Function to highlight dates with programmes
  const highlightedDays = Array.from({ length: 31 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 15 + i); // Showing 15 days before and after today
    return date;
  }).filter(date => getProgrammesOnDate(date).length > 0);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const programmesOnDate = getProgrammesOnDate(date);
      onDateSelect(date, programmesOnDate);
    }
  };

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Programme Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
          modifiers={{
            highlighted: highlightedDays,
          }}
          modifiersStyles={{
            highlighted: {
              fontWeight: 'bold',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              color: '#8b5cf6',
              borderRadius: '4px',
            },
          }}
          footer={
            selectedDate && (
              <div className="py-2 text-center">
                <h3 className="font-medium">
                  Programmes on {format(selectedDate, 'PPP')}
                </h3>
                <div className="mt-2 space-y-1">
                  {getProgrammesOnDate(selectedDate).length > 0 ? (
                    getProgrammesOnDate(selectedDate).map(programme => (
                      <Badge key={programme.id} variant="outline" className="text-xs mr-1">
                        {programme.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No programmes scheduled</p>
                  )}
                </div>
              </div>
            )
          }
        />
      </CardContent>
    </Card>
  );
};
