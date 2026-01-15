import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Download, 
  Calendar, 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  Filter,
  Search,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Mail
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_AMS_API_BASE_URL

const Reports = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [downloading, setDownloading] = useState('');
  const [selectedReport, setSelectedReport] = useState('attendance');

  const handleDownload = async (reportType: string) => {
    if (!fromDate || !toDate) return;
    setDownloading(reportType);
    try {
      const response = await fetch(
        `${API_BASE_URL}/attendance-report/download?fromDate=${fromDate}&toDate=${toDate}`,
        { method: 'GET' }
      );
      if (!response.ok) throw new Error('Failed to download');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${fromDate}-to-${toDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert('Failed to download report.');
    } finally {
      setDownloading('');
    }
  };

  const reportTypes = [
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'Complete employee attendance records with check-in/out times',
      icon: Users,
      color: 'primary',
      format: 'Excel (.xlsx)'
    },
    {
      id: 'summary',
      title: 'Daily Summary',
      description: 'Consolidated daily attendance statistics and insights',
      icon: BarChart3,
      color: 'success',
      format: 'Excel (.xlsx)'
    },
    {
      id: 'hours',
      title: 'Work Hours Analysis',
      description: 'Detailed working hours breakdown and overtime calculations',
      icon: Clock,
      color: 'warning',
      format: 'Excel (.xlsx)'
    },
    {
      id: 'trends',
      title: 'Trend Analysis',
      description: 'Attendance patterns and workforce analytics over time',
      icon: TrendingUp,
      color: 'default',
      format: 'PDF Report'
    }
  ];

  const quickFilters = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'This Month', days: 'month' },
    { label: 'Last Month', days: 'lastMonth' }
  ];

  const setQuickFilter = (filter: any) => {
  const today = new Date();
  let startDate = new Date();
  let endDate = new Date(); // define an endDate instead of reusing today

  if (typeof filter.days === 'number') {
    if (filter.days === 0) {
      // Today
      startDate = new Date(today);
      endDate = new Date(today);
    } else if (filter.days === 1) {
      // Yesterday
      startDate.setDate(today.getDate() - 1);
      endDate.setDate(today.getDate() - 1);
    } else {
      // Last N days → end date should be yesterday
      startDate.setDate(today.getDate() - filter.days);
      endDate.setDate(today.getDate() - 1);
    }
  } else if (filter.days === 'month') {
    // This Month → from 1st of current month to today
    startDate = new Date(today.getFullYear(), today.getMonth(), 2);
    endDate = new Date(today); 
  } else if (filter.days === 'lastMonth') {
    // Last Month → from 1st to last day of previous month
    startDate = new Date(today.getFullYear(), today.getMonth() - 1, 2);
    endDate = new Date(today.getFullYear(), today.getMonth(), 0); // 0 → last day of prev month
  }

  setFromDate(startDate.toISOString().split('T')[0]);
  setToDate(endDate.toISOString().split('T')[0]);
};


  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Card className="relative overflow-hidden bg-gradient-primary rounded-2xl shadow-xl border-0">
          <div className="absolute inset-0 bg-black/10"></div>
          
          <div className="relative px-6 py-12 lg:px-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
                    <div className="h-2 w-2 bg-success rounded-full mr-2 animate-pulse"></div>
                    Reports Center
                  </Badge>
                  <span className="text-white/80 text-sm font-medium">Generated at: {currentTime}</span>
                </div>
                <h1 className="text-display-lg text-white font-bold">
                  Enterprise Reports
                </h1>
                <p className="text-xl text-white/90 max-w-2xl">
                  Generate comprehensive workforce reports with advanced analytics and insights
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="secondary" className="bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2">
                  <Mail className="h-4 w-4" />
                  Email Reports
                </Button>
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Reports
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Date Range Selection */}
        <Card className="p-6 bg-gradient-surface shadow-lg border-0">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Filter className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Date Range & Filters</h3>
                <p className="text-sm text-muted-foreground">Select the date range for your reports</p>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickFilter(filter)}
                    className="hover:bg-primary/10"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">From Date</label>
                <Input 
                  type="date" 
                  value={fromDate} 
                  onChange={e => setFromDate(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">To Date</label>
                <Input 
                  type="date" 
                  value={toDate} 
                  onChange={e => setToDate(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Report Types Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Available Reports</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report, index) => {
              const isDisabled = report.id !== 'attendance';
              
              return (
                <div key={report.id} className="relative group">
                  <Card 
                    className={`p-6 transition-all duration-300 border-0 ${
                      isDisabled 
                        ? 'cursor-not-allowed opacity-60 bg-gray-50' 
                        : `cursor-pointer hover:shadow-lg ${
                            selectedReport === report.id ? 'ring-2 ring-primary bg-primary/5' : 'bg-white hover:bg-gray-50'
                          }`
                    }`}
                    onClick={() => !isDisabled && setSelectedReport(report.id)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${
                            isDisabled ? 'bg-gray-200' :
                            report.color === 'primary' ? 'bg-primary/10' :
                            report.color === 'success' ? 'bg-green-100' :
                            report.color === 'warning' ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            <report.icon className={`h-6 w-6 ${
                              isDisabled ? 'text-gray-400' :
                              report.color === 'primary' ? 'text-primary' :
                              report.color === 'success' ? 'text-green-600' :
                              report.color === 'warning' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <h3 className={`font-semibold ${isDisabled ? 'text-gray-400' : 'text-foreground'}`}>
                              {report.title}
                            </h3>
                            <Badge variant="outline" className={`mt-1 ${isDisabled ? 'text-gray-400 border-gray-300' : ''}`}>
                              {report.format}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <p className={`text-sm leading-relaxed ${isDisabled ? 'text-gray-400' : 'text-muted-foreground'}`}>
                        {report.description}
                      </p>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDisabled) {
                              handleDownload(report.id);
                            }
                          }}
                          disabled={isDisabled || !fromDate || !toDate || downloading === report.id}
                          className="flex-1"
                          variant={!isDisabled && selectedReport === report.id ? "default" : "outline"}
                        >
                          {!isDisabled && downloading === report.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="icon" disabled={isDisabled}>
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Coming Soon Tooltip */}
                  {isDisabled && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
                        Coming Soon
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Reports - Disabled */}
        <div className="relative group">
          <Card className="p-6 bg-gradient-surface shadow-lg border-0 opacity-60 cursor-not-allowed">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400">Recent Reports</h3>
                    <p className="text-sm text-gray-400">Your recently generated reports</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" disabled className="text-gray-400 border-gray-300">
                  View All
                </Button>
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-200 rounded">
                        <FileText className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-400">Attendance Report - Week {item}</p>
                        <p className="text-xs text-gray-400">Generated 2 hours ago • 1.2 MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" disabled>
                      <Download className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Coming Soon Tooltip for Recent Reports */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
              Coming Soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;