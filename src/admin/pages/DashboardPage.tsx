import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCartIcon, CalendarIcon, ClockIcon,
  CheckCircleIcon, DollarSignIcon, TrendingUpIcon
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { supabase } from '../../lib/supabase';

export function DashboardPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2026');
  const [chartMetric, setChartMetric] = useState<'bookings' | 'revenue'>('bookings');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setBookings(data);
    setLoading(false);
  };

  // Stats calculations
  const today = new Date().toISOString().split('T')[0];
  const totalBookings = bookings.length;
  const todayBookings = bookings.filter(b => b.event_date === today).length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending Payment' || b.status === 'Payment Uploaded').length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const advanceCollected = bookings
  .filter(b => ['Confirmed', 'Completed'].includes(b.status))
  .reduce((sum, b) => sum + Number(b.advance_amount), 0);

const fullRevenue = bookings
  .filter(b => b.status === 'Completed')
  .reduce((sum, b) => sum + Number(b.total_amount), 0);

  const stats = [
    { title: 'Total Bookings', value: totalBookings, icon: ShoppingCartIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: "Today's Events", value: todayBookings, icon: CalendarIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Pending', value: pendingBookings, icon: ClockIcon, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { title: 'Confirmed', value: confirmedBookings, icon: CheckCircleIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { title: 'Advance Collected', value: `AED ${advanceCollected.toLocaleString()}`, icon: DollarSignIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Full Revenue', value: `AED ${fullRevenue.toLocaleString()}`, icon: TrendingUpIcon, color: 'text-brand-pink', bg: 'bg-brand-pink/10' },
  ];

  // Monthly chart data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = months.map((name, idx) => {
    const monthBookings = bookings.filter(b => {
      const date = new Date(b.created_at);
      return date.getFullYear() === Number(selectedYear) && date.getMonth() === idx;
    });
    return {
      name,
      bookings: monthBookings.length,
      revenue: monthBookings.reduce((sum, b) => sum + Number(b.advance_amount), 0),
    };
  }).filter(m => m.bookings > 0 || m.revenue > 0);

  // Recent bookings (last 5)
  const recentBookings = bookings.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed': return <Badge variant="success">{status}</Badge>;
      case 'Pending Payment': return <Badge variant="warning">{status}</Badge>;
      case 'Payment Uploaded': return <Badge variant="info">{status}</Badge>;
      case 'Completed': return <Badge variant="default" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{status}</Badge>;
      case 'Cancelled': return <Badge variant="danger">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">{stat.title}</p>
                <h4 className="text-2xl font-bold text-slate-100">
                  {loading ? '...' : stat.value}
                </h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Trends Chart */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Monthly Trends</CardTitle>
          <div className="flex gap-2">
            <select
              value={chartMetric}
              onChange={(e) => setChartMetric(e.target.value as 'bookings' | 'revenue')}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="bookings">Bookings</option>
              <option value="revenue">Revenue</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {monthlyData.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-slate-400">
              No data for {selectedYear} yet.
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => chartMetric === 'revenue' ? `AED ${v}` : v}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                    cursor={{ fill: '#1e293b' }}
                    formatter={(value: number) => [
                      chartMetric === 'revenue' ? `AED ${value.toLocaleString()}` : value,
                      chartMetric === 'revenue' ? 'Revenue' : 'Bookings'
                    ]}
                  />
                  <Bar
                    dataKey={chartMetric}
                    fill={chartMetric === 'revenue' ? '#818cf8' : '#ec4899'}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link to="/admin/bookings">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : recentBookings.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No bookings yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking Ref</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Event Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium text-slate-300">
                      {booking.booking_ref}
                    </TableCell>
                    <TableCell>{booking.customer_name}</TableCell>
                    <TableCell>{booking.package_name}</TableCell>
                    <TableCell>{booking.event_date}</TableCell>
                    <TableCell>AED {booking.total_amount}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link to={`/admin/bookings/${booking.booking_ref}`}>
                        <Button variant="ghost" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}