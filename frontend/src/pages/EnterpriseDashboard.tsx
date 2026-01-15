import { useQuery } from "@tanstack/react-query";
import { EnterpriseStatsCard } from "@/components/EnterpriseStatsCard";
import { EnterpriseTable } from "@/components/EnterpriseTable";
import { EmployeeAttendance } from "@/types/attendance";
import { Users, UserCheck, TrendingUp, Clock, Calendar, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = import.meta.env.VITE_AMS_API_BASE_URL

const EnterpriseDashboard = () => {
  // Fetch today's attendance data
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async (): Promise<EmployeeAttendance[]> => {
      const response = await fetch(`${API_BASE_URL}/attendances/summary/today`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendance data');
      }
      return response.json();
    },
    refetchInterval: 30000, // Refresh every 30 seconds for enterprise real-time feel
  });

  // Fetch total employee count
  const { data: totalEmployees, isLoading: countLoading } = useQuery({
    queryKey: ['employees', 'count'],
    queryFn: async (): Promise<number> => {
      const response = await fetch(`${API_BASE_URL}/employees/count`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee count');
      }
      return response.json();
    },
  });

  const presentToday = attendanceData?.length || 0;
  const attendanceRate = totalEmployees ? Math.round((presentToday / totalEmployees) * 100) : 0;
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // Calculate average work hours (mock calculation for demo)
  const avgWorkHours = attendanceData 
    ? attendanceData.reduce((acc, emp) => {
        const hours = emp.totalHours > 0 ? emp.totalHours : 8; // Use 8 as default for active sessions
        return acc + hours;
      }, 0) / presentToday || 0
    : 8.2;

  const statsCards = [
    {
      title: "Total Workforce",
      value: totalEmployees || 0,
      icon: Users,
      description: "Registered employees",
      variant: 'default' as const,
      trend: { value: 3.2, isPositive: true, period: 'vs last month' }
    },
    {
      title: "Present Today",
      value: presentToday,
      icon: UserCheck,
      description: "Currently active",
      variant: 'primary' as const,
      trend: { value: 5.4, isPositive: true, period: 'vs yesterday' }
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: TrendingUp,
      description: "Today's performance",
      variant: (attendanceRate >= 85 ? 'success' : attendanceRate >= 70 ? 'warning' : 'default') as 'success' | 'warning' | 'default',
      trend: {
        value: 2.1,
        isPositive: attendanceRate >= 85,
        period: 'vs last week'
      }
    },
    {
      title: "Avg. Work Hours",
      value: `${avgWorkHours.toFixed(1)}h`,
      icon: Clock,
      description: "Daily average",
      variant: 'default' as const,
      trend: { value: 1.8, isPositive: true, period: 'vs target' }
    }
  ];

  const isLoading = attendanceLoading || countLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Card className="relative overflow-hidden bg-gradient-primary rounded-2xl shadow-xl border-0">
          {/* Overlay for subtle effect */}
          <div className="absolute inset-0 bg-black/10"></div>

          <div className="relative px-6 py-12 lg:px-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <div className="h-2 w-2 bg-success rounded-full mr-2 animate-pulse"></div>
                    Live Data
                  </Badge>
                  <span className="text-white/80 text-sm font-medium">Last updated: {currentTime}</span>
                </div>
                <h1 className="text-display-lg text-white font-bold">
                  Your Enterprise Workforce
                </h1>
                <p className="text-xl text-white/90 max-w-2xl">
                  Advanced workforce management with real-time analytics and intelligent insights
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2">
                  <Calendar className="h-4 w-4" />
                  View Calendar
                </Button>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Analytics Hub
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <EnterpriseStatsCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                trend={card.trend}
                description={card.description}
                variant={card.variant}
                loading={isLoading}
              />
            </div>
          ))}
        </div>

        {/* Quick Actions Bar */}
        <Card className="p-6 bg-gradient-surface shadow-lg border-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">System Status</h3>
                <p className="text-sm text-muted-foreground">All systems operational • Next sync in 30 seconds</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Manual Sync</Button>
              <Button variant="outline" size="sm">Export Report</Button>
            </div>
          </div>
        </Card>

        {/* Employee Table */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <EnterpriseTable 
            employees={attendanceData || []} 
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;