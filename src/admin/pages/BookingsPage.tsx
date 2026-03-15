import React, { useState, createElement } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilterIcon, DownloadIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
const allBookings = [
{
  id: '#JNS-20260310-001',
  customer: 'Sarah Ahmed',
  phone: '+971 50 123 4567',
  package: 'Ultimate Party',
  date: '2026-03-15',
  emirate: 'Dubai',
  total: 2499,
  status: 'Confirmed'
},
{
  id: '#JNS-20260310-002',
  customer: 'Mohammed R.',
  phone: '+971 55 987 6543',
  package: 'Splash Zone',
  date: '2026-03-16',
  emirate: 'Sharjah',
  total: 1600,
  status: 'Pending'
},
{
  id: '#JNS-20260309-003',
  customer: 'Fatima Al Suwaidi',
  phone: '+971 52 345 6789',
  package: 'Party Starter',
  date: '2026-03-14',
  emirate: 'Abu Dhabi',
  total: 1799,
  status: 'Completed'
},
{
  id: '#JNS-20260308-004',
  customer: 'David C.',
  phone: '+971 50 111 2222',
  package: 'Snack Fiesta',
  date: '2026-03-20',
  emirate: 'Ras Al Khaimah',
  total: 950,
  status: 'Payment Uploaded'
},
{
  id: '#JNS-20260307-005',
  customer: 'Aisha K.',
  phone: '+971 56 777 8888',
  package: 'Birthday Bash',
  date: '2026-03-22',
  emirate: 'Ajman',
  total: 1999,
  status: 'Confirmed'
},
{
  id: '#JNS-20260306-006',
  customer: 'Omar Tariq',
  phone: '+971 54 444 5555',
  package: 'Game Day',
  date: '2026-03-25',
  emirate: 'Dubai',
  total: 1299,
  status: 'Pending'
}];

export function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const filteredBookings = allBookings.filter((booking) => {
    const matchesSearch =
    booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.phone.includes(searchQuery);
    const matchesStatus =
    statusFilter === 'All Statuses' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const exportCSV = () => {
    const headers = [
    'Booking Ref',
    'Customer',
    'Phone',
    'Package',
    'Date',
    'Emirate',
    'Total',
    'Status'];

    const csvContent = [
    headers.join(','),
    ...filteredBookings.map(
      (b) =>
      `"${b.id}","${b.customer}","${b.phone}","${b.package}","${b.date}","${b.emirate}",${b.total},"${b.status}"`
    )].
    join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `bookings_export_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <Badge variant="success">{status}</Badge>;
      case 'Pending':
        return <Badge variant="warning">{status}</Badge>;
      case 'Payment Uploaded':
        return <Badge variant="info">{status}</Badge>;
      case 'Completed':
        return (
          <Badge
            variant="default"
            className="bg-blue-500/10 text-blue-400 border-blue-500/20">
            
            {status}
          </Badge>);

      default:
        return <Badge>{status}</Badge>;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-heading font-bold text-slate-100">
          Bookings Management
        </h2>
        <Button variant="outline" className="shrink-0" onClick={exportCSV}>
          <DownloadIcon className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, ref, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent" />
              
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-400 whitespace-nowrap mr-2">
                Showing {filteredBookings.length} of {allBookings.length}
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                
                <option>All Statuses</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Payment Uploaded</option>
              </select>
              <Button 
                  variant="outline" 
                  className="px-3"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('All Statuses');
                  }}
                  title="Clear filters"
                >
                  <FilterIcon className="w-4 h-4" />
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Ref</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Emirate</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ?
              <TableRow>
                  <TableCell
                  colSpan={8}
                  className="text-center py-8 text-slate-400">
                  
                    No bookings found matching your criteria.
                  </TableCell>
                </TableRow> :

              filteredBookings.map((booking) =>
              <TableRow key={booking.id}>
                    <TableCell className="font-medium text-brand-blue">
                      {booking.id}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-slate-200">
                          {booking.customer}
                        </span>
                        <span className="text-xs text-slate-500">
                          {booking.phone}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{booking.package}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.emirate}</TableCell>
                    <TableCell>AED {booking.total}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/bookings/${booking.id}`}>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
              )
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>);

}