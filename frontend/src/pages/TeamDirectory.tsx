import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Users, Mail, Phone, QrCode, ChevronLeft, ChevronRight, ArrowUpDown, Plus, UserPlus, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Employee, PaginatedResponse } from "@/types/attendance";

const API_BASE_URL = import.meta.env.VITE_AMS_API_BASE_URL

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'employeeCode', label: 'Employee Code' },
  { value: 'email', label: 'Email' }
];

// Form validation schema
const createEmployeeSchema = z.object({
  employeeCode: z.string().min(1, "Employee code is required").min(3, "Employee code must be at least 3 characters"),
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").min(10, "Phone must be at least 10 digits"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

const fetchEmployees = async (page: number, size: number, search?: string, sortBy = 'name', sortDir = 'asc'): Promise<PaginatedResponse<Employee>> => {
  let url = `${API_BASE_URL}/employees?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }
  return response.json();
};

const createEmployee = async (data: CreateEmployeeFormData): Promise<Employee> => {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create employee');
  }
  return response.json();
};

const downloadAllQRCodes = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees/qrcodes-doc`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to download QR codes document');
    }
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Employee_QR_Codes.docx';
    document.body.appendChild(link);
    link.click();
    // CleanUp
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download Failed:', error);
  }
}

export default function TeamDirectory() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    defaultValues: {
      employeeCode: "",
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(0); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: employeesData, isLoading, error } = useQuery({
    queryKey: ['employees', currentPage, ITEMS_PER_PAGE, debouncedSearch, sortBy, sortDir],
    queryFn: () => fetchEmployees(currentPage, ITEMS_PER_PAGE, debouncedSearch, sortBy, sortDir),
    refetchInterval: 30000,
  });

  const createEmployeeMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Success!",
        description: "Employee created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create employee.",
        variant: "destructive",
      });
    },
  });

  const totalPages = employeesData?.totalPages || 0;
  const employees = employeesData?.content || [];

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      // Toggle direction if same field
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to ascending
      setSortBy(newSortBy);
      setSortDir('asc');
    }
    setCurrentPage(0); // Reset to first page on sort change
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const onSubmit = (data: CreateEmployeeFormData) => {
    createEmployeeMutation.mutate(data);
  };

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">Failed to load employee data</p>
          <p className="text-sm text-muted-foreground mt-1">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 pt-8">
          <Card className="relative overflow-hidden bg-gradient-primary rounded-2xl shadow-xl border-0">
            {/* Overlay for subtle contrast */}
            <div className="absolute inset-0 bg-black/10"></div>

            <div className="relative px-8 py-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-display-lg text-white font-bold">Team Directory</h1>
                  <p className="text-xl text-white/90">
                    Manage and view your organization's workforce
                  </p>
                </div>
              </div>

              {/* Search + Sort + Add Row */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Search Bar */}
                <div className="max-w-md w-full">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <Input
                      placeholder="Search employees..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 h-12 text-base"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                  {/* Sort Dropdown */}
                  <div className="w-full sm:w-48">
                    <Select value={sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white h-12">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort by..." />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} {sortBy === option.value && (sortDir === 'asc' ? '↑' : '↓')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Add Employee Button */}
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        size="lg" 
                        className="bg-white text-primary hover:bg-white/90 h-12 px-6 font-semibold shadow-elegant gap-2 whitespace-nowrap"
                      >
                        <UserPlus className="h-5 w-5" />
                        Add Employee
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-card border-border shadow-elegant">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <UserPlus className="h-5 w-5 text-primary" />
                          </div>
                          Create New Employee
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Add a new employee to your organization's directory.
                        </DialogDescription>
                      </DialogHeader>

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="employeeCode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employee Code</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., EMP001" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., +1234567890" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., John Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="e.g., john@company.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Lock className="h-4 w-4" />
                                  Password
                                </FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <DialogFooter className="pt-4">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsCreateDialogOpen(false)}
                              disabled={createEmployeeMutation.isPending}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={createEmployeeMutation.isPending}
                              className="gap-2"
                            >
                              {createEmployeeMutation.isPending ? (
                                <>
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                  Creating...
                                </>
                              ) : (
                                <>
                                  <Plus className="h-4 w-4" />
                                  Create Employee
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </Card>
        </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Bar */}
        <div className="mb-8">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Employees</p>
                    <p className="text-2xl font-bold text-foreground">
                      {employeesData?.totalElements || 0}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground">Showing</p>
                    <p className="text-lg font-semibold text-foreground">
                      {employees.length} of {employeesData?.totalElements || 0}
                    </p>
                  </div>
                </div>
                
                {searchQuery && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAllQRCodes}
                  className="gap-2 hover:bg-primary hover:text-white hover:border-primary transition-colors">
                  {/* Lucide Download Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>Download All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-muted rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : employees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map((employee) => (
              <Card 
                key={employee.id} 
                className="group hover:shadow-elevated transition-all duration-200 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur"
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-12 w-12 ring-2 ring-border group-hover:ring-primary/30 transition-colors">
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {employee.name}
                      </h3>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {employee.employeeCode}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span>{employee.phone}</span>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            <QrCode className="h-4 w-4" />
                            View QR Code
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent 
                          className="w-80 p-6 bg-card border border-border rounded-xl shadow-elegant" 
                          align="center"
                          side="top"
                        >
                          <div className="text-center space-y-4">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg text-foreground">{employee.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {employee.employeeCode}
                              </Badge>
                            </div>
                            
                            <div className="flex justify-center">
                              <div className="p-4 bg-white rounded-lg shadow-inner">
                                <img
                                  src={`data:image/png;base64,${employee.qrCodeBase64}`}
                                  alt={`QR Code for ${employee.name}`}
                                  className="w-48 h-48 object-contain"
                                />
                              </div>
                            </div>
                            
                            <p className="text-sm text-muted-foreground">
                              Scan this QR code for employee identification
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                     {/* Download QR Code */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="px-3 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = `data:image/png;base64,${employee.qrCodeBase64}`;
                          link.download = `${employee.name}_QRCode.png`;
                          link.click();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No employees found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search criteria' : 'No employees have been added yet'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2 mx-4">
              {[...Array(totalPages)].map((_, i) => {
                if (
                  i === 0 ||
                  i === totalPages - 1 ||
                  (i >= currentPage - 2 && i <= currentPage + 2)
                ) {
                  return (
                    <Button
                      key={i}
                      variant={i === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                      className="w-10 h-10"
                    >
                      {i + 1}
                    </Button>
                  );
                } else if (
                  i === currentPage - 3 ||
                  i === currentPage + 3
                ) {
                  return <span key={i} className="px-2 text-muted-foreground">...</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}