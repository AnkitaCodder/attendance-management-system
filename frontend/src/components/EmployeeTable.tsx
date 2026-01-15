import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployeeAttendance } from "@/types/attendance";
import { Clock, Eye, UserCheck, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmployeeTableProps {
  employees: EmployeeAttendance[];
}

export const EmployeeTable = ({ employees }: EmployeeTableProps) => {
  const navigate = useNavigate();

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getStatus = (employee: EmployeeAttendance) => {
    if (!employee.lastOutTime) {
      return { label: 'Present', variant: 'success' as const, icon: UserCheck };
    }
    return { label: 'Checked Out', variant: 'secondary' as const, icon: UserX };
  };

  const formatDuration = (hours: number, minutes: number) => {
    if (hours < 0 || minutes < 0) {
      return "Active";
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="shadow-card border-0">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Today's Attendance</h2>
        <p className="text-muted-foreground">Employee check-in and check-out details</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left p-4 font-medium text-muted-foreground">Employee</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left p-4 font-medium text-muted-foreground">First In</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Last Out</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Duration</th>
              <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => {
              const status = getStatus(employee);
              const StatusIcon = status.icon;
              
              return (
                <tr key={employee.employeeId} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{employee.employeeName}</div>
                    <div className="text-sm text-muted-foreground">ID: {employee.employeeId.slice(0, 8)}...</div>
                  </td>
                  <td className="p-4">
                    <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </td>
                  <td className="p-4 text-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatTime(employee.firstInTime)}
                    </div>
                  </td>
                  <td className="p-4 text-foreground">
                    {employee.lastOutTime ? (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatTime(employee.lastOutTime)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="p-4 text-foreground">
                    {formatDuration(employee.totalHours, employee.totalMinutes)}
                  </td>
                  <td className="p-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/employee/${employee.employeeId}`)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};