
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Programme } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ProgrammesAnalyticsProps {
  programmes: Programme[];
}

export const ProgrammesAnalytics = ({ programmes }: ProgrammesAnalyticsProps) => {
  // Calculate statistics
  const activeProgrammes = programmes.filter(p => !p.endDate || p.endDate > new Date()).length;
  const completedProgrammes = programmes.filter(p => p.endDate && p.endDate < new Date()).length;
  const totalParticipants = programmes.reduce((acc, curr) => acc + curr.currentAttendees, 0);

  // Calculate programme distribution by type
  const programmesByType = programmes.reduce((acc, programme) => {
    acc[programme.type] = (acc[programme.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeData = Object.entries(programmesByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Participant data for each programme (top 5 by attendance)
  const participantData = programmes
    .sort((a, b) => b.currentAttendees - a.currentAttendees)
    .slice(0, 5)
    .map(programme => ({
      name: programme.name.length > 15 ? programme.name.substring(0, 15) + '...' : programme.name,
      participants: programme.currentAttendees
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Programme Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Programmes by Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participantData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="participants" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
