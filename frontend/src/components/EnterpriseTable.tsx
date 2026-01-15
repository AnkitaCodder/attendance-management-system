import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeAttendance } from "@/types/attendance";
import { Clock, Eye, UserCheck, UserX, Search, Filter, MoreHorizontal, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EnterpriseTableProps {
  employees: EmployeeAttendance[];
  loading?: boolean;
}

export const EnterpriseTable = ({ employees, loading = false }: EnterpriseTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');

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
      return "Active Session";
    }
    return `${hours}h ${minutes}m`;
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getStatus(employee);
    const matchesFilter = statusFilter === 'all' || 
      (statusFilter === 'present' && status.label === 'Present') ||
      (statusFilter === 'absent' && status.label === 'Checked Out');
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-surface">
        <div className="p-6 border-b border-border/50">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted/30 rounded w-48"></div>
            <div className="h-4 bg-muted/20 rounded w-64"></div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4">
              <div className="h-12 bg-muted/30 rounded w-12"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted/30 rounded w-32"></div>
                <div className="h-3 bg-muted/20 rounded w-24"></div>
              </div>
              <div className="h-8 bg-muted/30 rounded w-20"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-surface">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-display-xs font-bold text-foreground">Live Attendance</h2>
            <p className="text-muted-foreground mt-1">Real-time employee check-in status</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                  All Employees
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('present')}>
                  Present Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('absent')}>
                  Checked Out Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-muted/30 border-0 focus:bg-background transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/20">
            <tr>
              <th className="text-left p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                Employee
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                Status
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                Check In
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                Last Out
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                Duration
              </th>
              <th className="text-left p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => {
              const status = getStatus(employee);
              const StatusIcon = status.icon;
              
              return (
                <tr 
                  key={employee.employeeId} 
                  className={`
                    border-b border-border/30 hover:bg-muted/10 transition-all duration-200
                    ${index % 2 === 0 ? 'bg-background/50' : 'bg-transparent'}
                  `}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {employee.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{employee.employeeName}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          #{employee.employeeId.slice(0, 8)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant={status.variant} className="flex items-center gap-2 w-fit px-3 py-1">
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-foreground font-medium">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatTime(employee.firstInTime)}
                    </div>
                  </td>
                  <td className="p-4">
                    {employee.lastOutTime ? (
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatTime(employee.lastOutTime)}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Still active</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-foreground">
                      {formatDuration(employee.totalHours, employee.totalMinutes)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/employee/${employee.employeeId}`)}
                        className="gap-2 hover:shadow-sm transition-all duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        Details
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Export Data</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchTerm ? 'No employees found matching your search.' : 'No attendance data available.'}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};