import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCartIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  DollarSignIcon,
  TrendingUpIcon } from
'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line } from
'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { Button } from '../components/ui/Button';
const revenueData = [
{
  name: 'Mon',
  revenue: 4000
},
{
  name: 'Tue',
  revenue: 3000
},
{
  name: 'Wed',
  revenue: 2000
},
{
  name: 'Thu',
  revenue: 2780
},
{
  name: 'Fri',
  revenue: 1890
},
{
  name: 'Sat',
  revenue: 2390
},
{
  name: 'Sun',
  revenue: 3490
}];

const bookingsData = [
{
  name: 'Mon',
  bookings: 4
},
{
  name: 'Tue',
  bookings: 3
},
{
  name: 'Wed',
  bookings: 2
},
{
  name: 'Thu',
  bookings: 5
},
{
  name: 'Fri',
  bookings: 8
},
{
  name: 'Sat',
  bookings: 12
},
{
  name: 'Sun',
  bookings: 10
}];

const monthlyData2025 = [
{
  name: 'Jan',
  bookings: 45,
  revenue: 65000
},
{
  name: 'Feb',
  bookings: 52,
  revenue: 78000
},
{
  name: 'Mar',
  bookings: 68,
  revenue: 92000
},
{
  name: 'Apr',
  bookings: 74,
  revenue: 105000
},
{
  name: 'May',
  bookings: 82,
  revenue: 118000
},
{
  name: 'Jun',
  bookings: 95,
  revenue: 142000
},
{
  name: 'Jul',
  bookings: 110,
  revenue: 165000
},
{
  name: 'Aug',
  bookings: 105,
  revenue: 158000
},
{
  name: 'Sep',
  bookings: 88,
  revenue: 125000
},
{
  name: 'Oct',
  bookings: 115,
  revenue: 175000
},
{
  name: 'Nov',
  bookings: 130,
  revenue: 198000
},
{
  name: 'Dec',
  bookings: 145,
  revenue: 225000
}];

const monthlyData2026 = [
{
  name: 'Jan',
  bookings: 120,
  revenue: 185000
},
{
  name: 'Feb',
  bookings: 135,
  revenue: 210000
},
{
  name: 'Mar',
  bookings: 150,
  revenue: 245000
},
{
  name: 'Apr',
  bookings: 0,
  revenue: 0
},
{
  name: 'May',
  bookings: 0,
  revenue: 0
},
{
  name: 'Jun',
  bookings: 0,
  revenue: 0
},
{
  name: 'Jul',
  bookings: 0,
  revenue: 0
},
{
  name: 'Aug',
  bookings: 0,
  revenue: 0
},
{
  name: 'Sep',
  bookings: 0,
  revenue: 0
},
{
  name: 'Oct',
  bookings: 0,
  revenue: 0
},
{
  name: 'Nov',
  bookings: 0,
  revenue: 0
},
{
  name: 'Dec',
  bookings: 0,
  revenue: 0
}];

const recentBookings = [
{
  id: '#JNS-20260310-001',
  customer: 'Sarah Ahmed',
  package: 'Ultimate Party',
  date: '2026-03-15',
  status: 'Confirmed',
  total: 2499
},
{
  id: '#JNS-20260310-002',
  customer: 'Mohammed R.',
  package: 'Splash Zone',
  date: '2026-03-16',
  status: 'Pending',
  total: 1600
},
{
  id: '#JNS-20260309-003',
  customer: 'Fatima Al Suwaidi',
  package: 'Party Starter',
  date: '2026-03-14',
  status: 'Completed',
  total: 1799
},
{
  id: '#JNS-20260308-004',
  customer: 'David C.',
  package: 'Snack Fiesta',
  date: '2026-03-20',
  status: 'Payment Uploaded',
  total: 950
}];

export function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [chartMetric, setChartMetric] = useState<'bookings' | 'revenue'>(
    'bookings'
  );
 const currentMonthlyData = (
  selectedYear === '2026' ? monthlyData2026 : monthlyData2025
).filter(month => month.bookings > 0 || month.revenue > 0);
  const stats = [
  {
    title: 'Total Bookings',
    value: '1,248',
    icon: ShoppingCartIcon,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    title: "Today's Bookings",
    value: '12',
    icon: CalendarIcon,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  },
  {
    title: 'Pending',
    value: '5',
    icon: ClockIcon,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10'
  },
  {
    title: 'Confirmed',
    value: '42',
    icon: CheckCircleIcon,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  },
  {
    title: 'Total Revenue',
    value: 'AED 142k',
    icon: DollarSignIcon,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    title: 'Total Profit',
    value: 'AED 84k',
    icon: TrendingUpIcon,
    color: 'text-brand-pink',
    bg: 'bg-brand-pink/10'
  }];

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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) =>
        <Card key={i}>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  {stat.title}
                </p>
                <h4 className="text-2xl font-bold text-slate-100">
                  {stat.value}
                </h4>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false} />
                  
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{
                      fill: '#64748b'
                    }}
                    axisLine={false}
                    tickLine={false} />
                  
                  <YAxis
                    stroke="#64748b"
                    tick={{
                      fill: '#64748b'
                    }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `AED ${value}`} />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      color: '#f8fafc'
                    }}
                    itemStyle={{
                      color: '#818cf8'
                    }} />
                  
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#818cf8"
                    strokeWidth={3}
                    dot={{
                      fill: '#818cf8',
                      strokeWidth: 2
                    }}
                    activeDot={{
                      r: 8
                    }} />
                  
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bookings This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false} />
                  
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    tick={{
                      fill: '#64748b'
                    }}
                    axisLine={false}
                    tickLine={false} />
                  
                  <YAxis
                    stroke="#64748b"
                    tick={{
                      fill: '#64748b'
                    }}
                    axisLine={false}
                    tickLine={false} />
                  
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      color: '#f8fafc'
                    }}
                    cursor={{
                      fill: '#1e293b'
                    }} />
                  
                  <Bar
                    dataKey="bookings"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]} />
                  
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends Chart */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Monthly Trends</CardTitle>
          <div className="flex gap-2">
            <select
              value={chartMetric}
              onChange={(e) =>
              setChartMetric(e.target.value as 'bookings' | 'revenue')
              }
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
              
              <option value="bookings">Bookings</option>
              <option value="revenue">Revenue</option>
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
              
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentMonthlyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false} />
                
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  tick={{
                    fill: '#64748b'
                  }}
                  axisLine={false}
                  tickLine={false} />
                
                <YAxis
                  stroke="#64748b"
                  tick={{
                    fill: '#64748b'
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) =>
                  chartMetric === 'revenue' ? `AED ${value / 1000}k` : value
                  } />
                
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    color: '#f8fafc'
                  }}
                  cursor={{
                    fill: '#1e293b'
                  }}
                  formatter={(value: number) => [
                  chartMetric === 'revenue' ?
                  `AED ${value.toLocaleString()}` :
                  value,
                  chartMetric === 'revenue' ? 'Revenue' : 'Bookings']
                  } />
                
                <Bar
                  dataKey={chartMetric}
                  fill={chartMetric === 'revenue' ? '#818cf8' : '#ec4899'}
                  radius={[4, 4, 0, 0]} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link to="/admin/bookings">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking Ref</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) =>
              <TableRow key={booking.id}>
                  <TableCell className="font-medium text-slate-300">
                    {booking.id}
                  </TableCell>
                  <TableCell>{booking.customer}</TableCell>
                  <TableCell>{booking.package}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>AED {booking.total}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/admin/bookings/${booking.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>);

}