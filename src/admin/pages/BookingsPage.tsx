import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, FilterIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface Booking {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_phone: string;
  package_name: string;
  event_date: string;
  emirate: string;
  total_amount: number;
  advance_amount: number;
  status: string;
  created_at: string;
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.booking_ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer_phone?.includes(searchQuery);
    const matchesStatus =
      statusFilter === 'All Statuses' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Booking Ref', 'Customer', 'Phone', 'Package', 'Date', 'Emirate', 'Total', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(
        (b) => `"${b.booking_ref}","${b.customer_name}","${b.customer_phone}","${b.package_name}","${b.event_date}","${b.emirate}",${b.total_amount},"${b.status}"`
      )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed': return <Badge variant="success">{status}</Badge>;
      case 'Pending': return <Badge variant="warning">{status}</Badge>;
      case 'Pending Payment': return <Badge variant="warning">{status}</Badge>;
      case 'Payment Uploaded': return <Badge variant="info">{status}</Badge>;
      case 'Completed': return <Badge variant="default" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{status}</Badge>;
      case 'Cancelled': return <Badge variant="danger">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            Bookings Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? 'Loading...' : `${bookings.length} total bookings`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBookings}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportCSV}>
            <DownloadIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
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
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-400 whitespace-nowrap">
                Showing {filteredBookings.length} of {bookings.length}
              </span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option>All Statuses</option>
                <option>Pending Payment</option>
                <option>Payment Uploaded</option>
                <option>Confirmed</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
              <Button
                variant="outline"
                className="px-3"
                title="Clear filters"
                onClick={() => { setSearchQuery(''); setStatusFilter('All Statuses'); }}
              >
                <FilterIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              Loading bookings...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Emirate</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-400">
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium text-brand-blue">
                        {booking.booking_ref}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-slate-200">{booking.customer_name}</span>
                          <span className="text-xs text-slate-500">{booking.customer_phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>{booking.package_name}</TableCell>
                      <TableCell>{booking.event_date}</TableCell>
                      <TableCell>{booking.emirate}</TableCell>
                      <TableCell>AED {booking.total_amount}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/admin/bookings/${booking.booking_ref}`}>
                          <Button variant="ghost" size="sm">Manage</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}