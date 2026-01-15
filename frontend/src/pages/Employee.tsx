import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmployeeAttendance } from "@/types/attendance";
import { ArrowLeft, Clock, User, Calendar, Timer } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_AMS_API_BASE_URL
const Employee = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async (): Promise<EmployeeAttendance[]> => {
      const response = await fetch(`${API_BASE_URL}/attendances/summary/today`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      return response.json();
    },
  });

  const employee = attendanceData?.find(emp => emp.employeeId === employeeId);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (hours: number, minutes: number, seconds: number) => {
    if (hours < 0 || minutes < 0) {
      return "Currently Active";
    }
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Employee Not Found</h1>
          <p className="text-muted-foreground">The employee you're looking for doesn't exist or isn't present today.</p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-primary-foreground">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <User className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{employee.employeeName}</h1>
              <p className="text-primary-foreground/80">Employee ID: {employee.employeeId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-card shadow-card border-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Clock className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">First Check-in</p>
                <p className="text-xl font-bold text-foreground">{formatTime(employee.firstInTime)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Timer className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Check-out</p>
                <p className="text-xl font-bold text-foreground">
                  {employee.lastOutTime ? formatTime(employee.lastOutTime) : 'Still Active'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                <p className="text-xl font-bold text-foreground">
                  {formatDuration(employee.totalHours, employee.totalMinutes, employee.totalSeconds)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Today's Date */}
        <Card className="p-6 bg-gradient-card shadow-card border-0">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Today's Activity</h2>
            <Badge variant="outline">{formatDate(employee.firstInTime)}</Badge>
          </div>
        </Card>

        {/* Attendance Timeline */}
        <Card className="shadow-card border-0">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Attendance Timeline</h2>
            <p className="text-muted-foreground">Detailed check-in and check-out records</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {employee.attendancePairs.map((pair, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Session {index + 1}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(pair.inTime)} - {pair.outTime ? formatTime(pair.outTime) : 'Active'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {formatDuration(pair.hours, pair.minutes, pair.seconds)}
                    </p>
                    <Badge variant={pair.outTime ? "secondary" : "success"}>
                      {pair.outTime ? "Completed" : "Active"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Employee;