import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmployeeAttendance } from "@/types/attendance";
import { ArrowLeft, Clock, User, Calendar, Timer, MapPin, Phone, Mail, Building } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_AMS_API_BASE_URL

const EnterpriseEmployee = () => {
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
      hour12: true
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
    return `${hours}h ${minutes}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading employee profile...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md text-center space-y-4 bg-gradient-surface shadow-xl">
          <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
            <User className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Employee Not Found</h1>
          <p className="text-muted-foreground">The employee profile you're looking for doesn't exist or isn't available today.</p>
          <Button onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Card className="relative overflow-hidden bg-gradient-primary rounded-2xl shadow-xl border-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative px-6 py-10 lg:px-10">
            {/* Back Button */}
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
              className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>

            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Employee Avatar */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-bold text-white">
                    {employee.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>

                {/* Employee Info */}
                <div>
                  <h1 className="text-display-md text-white font-bold">{employee.employeeName}</h1>
                  <p className="text-white/80 text-lg font-medium">
                    Employee ID: #{employee.employeeId.slice(0, 8)}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {employee.lastOutTime ? 'Checked Out' : 'Active'}
                    </Badge>
                    <span className="text-white/70 text-sm">
                      {formatDate(employee.firstInTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>


      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-surface shadow-lg border-0 interactive-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-success/10 rounded-xl">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">First Check-In</p>
                <p className="text-2xl font-bold text-foreground">{formatTime(employee.firstInTime)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-surface shadow-lg border-0 interactive-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-warning/10 rounded-xl">
                <Timer className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Check-Out</p>
                <p className="text-2xl font-bold text-foreground">
                  {employee.lastOutTime ? formatTime(employee.lastOutTime) : 'Active'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-surface shadow-lg border-0 interactive-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatDuration(employee.totalHours, employee.totalMinutes, employee.totalSeconds)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-surface shadow-lg border-0 interactive-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Timer className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold text-foreground">{employee.attendancePairs.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Employee Details & Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Employee Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-gradient-surface shadow-lg border-0">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Employee Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium text-foreground">Human Resources</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">Office Floor 3</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground">{employee.employeeName.toLowerCase().replace(' ', '.')}@company.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Extension</p>
                    <p className="font-medium text-foreground">+1 (555) 0123</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Attendance Timeline */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-gradient-surface">
              <div className="p-6 border-b border-border/50">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Activity Timeline
                </h3>
                <p className="text-muted-foreground mt-1">Detailed session tracking and break analysis</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {employee.attendancePairs.map((pair, index) => (
                    <div key={index} className="relative">
                      {/* Timeline connector */}
                      {index < employee.attendancePairs.length - 1 && (
                        <div className="absolute left-6 top-16 h-8 w-0.5 bg-border"></div>
                      )}
                      
                      <div className="flex items-start gap-4 p-4 bg-muted/10 rounded-xl hover:bg-muted/20 transition-colors">
                        <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">
                              Session {index + 1}
                            </h4>
                            <Badge variant={pair.outTime ? "secondary" : "success"} className="px-3 py-1">
                              {pair.outTime ? "Completed" : "Active Session"}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Check In</p>
                              <p className="font-medium text-foreground">{formatTime(pair.inTime)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Check Out</p>
                              <p className="font-medium text-foreground">
                                {pair.outTime ? formatTime(pair.outTime) : 'Still active'}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Duration</p>
                              <p className="font-medium text-foreground">
                                {formatDuration(pair.hours, pair.minutes, pair.seconds)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseEmployee;