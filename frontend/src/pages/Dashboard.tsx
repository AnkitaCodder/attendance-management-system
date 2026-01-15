import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/StatsCard";
import { EmployeeTable } from "@/components/EmployeeTable";
import { EmployeeAttendance, AttendanceStats } from "@/types/attendance";
import { Users, UserCheck, TrendingUp, Clock } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_AMS_API_BASE_URL

const Dashboard = () => {
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
    refetchInterval: 60000, // Refresh every minute
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

  const statsCards = [
    {
      title: "Total Employees",
      value: totalEmployees || 0,
      icon: Users,
      description: "Registered employees"
    },
    {
      title: "Present Today",
      value: presentToday,
      icon: UserCheck,
      description: "Currently checked in"
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: TrendingUp,
      trend: {
        value: 2.5,
        isPositive: true
      }
    },
    {
      title: "Avg. Work Hours",
      value: "8.2h",
      icon: Clock,
      description: "Daily average"
    }
  ];

  if (attendanceLoading || countLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary p-6 text-primary-foreground">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Attendance Management</h1>
          <p className="text-primary-foreground/80">
            Monitor and manage employee attendance in real-time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <StatsCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              trend={card.trend}
              description={card.description}
            />
          ))}
        </div>

        {/* Employee Table */}
        {attendanceData && (
          <EmployeeTable employees={attendanceData} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;