export interface AttendancePair {
  inTime: string;
  outTime: string | null;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface EmployeeAttendance {
  employeeId: string;
  employeeName: string;
  firstInTime: string;
  lastOutTime: string | null;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  attendancePairs: AttendancePair[];
}

export interface AttendanceStats {
  totalEmployees: number;
  presentToday: number;
  attendanceRate: number;
}

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  qrCodePath: string;
  qrCodeBase64: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}