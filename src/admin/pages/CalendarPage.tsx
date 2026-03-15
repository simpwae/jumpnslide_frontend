import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Loader2Icon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

interface Booking {
  id: string;
  booking_ref: string;
  customer_name: string;
  package_name: string;
  event_date: string;
  event_time: string;
  emirate: string;
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  'Confirmed': 'bg-emerald-500',
  'Payment Uploaded': 'bg-blue-500',
  'Pending Payment': 'bg-amber-500',
  'Cancelled': 'bg-rose-500',
  'Completed': 'bg-slate-500',
};

export function CalendarPage() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    fetchBookings();
  }, [currentDate]);

  const fetchBookings = async () => {
    setLoading(true);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const startDate = `${year}-${month}-01`;
    const lastDay = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const endDate = `${year}-${month}-${lastDay}`;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('event_date', startDate)
      .lte('event_date', endDate)
      .neq('status', 'Cancelled')
      .order('event_date', { ascending: true });

    if (!error && data) setBookings(data);
    setLoading(false);
  };

  const prevMonth = () => {
    setSelectedDay(null);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDay(null);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setSelectedDay(today.getDate());
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
  };

  // Build calendar grid
  const firstDayOfMonth = currentDate.getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const calendarDays: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getBookingsForDay = (day: number) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dateStr = `${year}-${month}-${String(day).padStart(2, '0')}`;
    return bookings.filter(b => b.event_date === dateStr);
  };

  const isToday = (day: number) => {
    return day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear();
  };

  const selectedBookings = selectedDay ? getBookingsForDay(selectedDay) : [];

  const upcomingBookings = bookings
    .filter(b => b.event_date >= today.toISOString().split('T')[0])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">Booking Calendar</h2>
          <p className="text-sm text-slate-400 mt-1">
            {loading ? 'Loading...' : `${bookings.length} bookings this month`}
          </p>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          Today
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <ChevronLeftIcon className="w-5 h-5 text-slate-400" />
              </button>
              <CardTitle className="text-xl">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </CardTitle>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <ChevronRightIcon className="w-5 h-5 text-slate-400" />
              </button>
            </CardHeader>
            <CardContent>
              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} />;
                    const dayBookings = getBookingsForDay(day);
                    const isSelected = selectedDay === day;
                    const todayDay = isToday(day);

                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedDay(isSelected ? null : day)}
                        className={`min-h-[60px] p-1.5 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? 'border-brand-blue bg-brand-blue/10'
                            : todayDay
                            ? 'border-brand-pink bg-brand-pink/10'
                            : 'border-transparent hover:border-slate-700 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className={`text-xs font-bold mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                          todayDay ? 'bg-brand-pink text-white' : 'text-slate-300'
                        }`}>
                          {day}
                        </div>
                        <div className="space-y-0.5">
                          {dayBookings.slice(0, 2).map(b => (
                            <div
                              key={b.id}
                              className={`h-1.5 rounded-full ${STATUS_COLORS[b.status] || 'bg-slate-500'}`}
                              title={`${b.customer_name} — ${b.package_name}`}
                            />
                          ))}
                          {dayBookings.length > 2 && (
                            <p className="text-xs text-slate-500">+{dayBookings.length - 2}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-slate-800">
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                    <span className="text-xs text-slate-400">{status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">

          {/* Selected Day Bookings */}
          {selectedDay && (
            <Card className="border-brand-blue/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {MONTHS[currentDate.getMonth()]} {selectedDay}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedBookings.length === 0 ? (
                  <p className="text-slate-400 text-sm">No bookings on this day.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedBookings.map(b => (
                      <div key={b.id} className="bg-slate-800/50 rounded-xl p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-slate-200 text-sm">{b.customer_name}</p>
                            <p className="text-xs text-slate-400">{b.package_name}</p>
                          </div>
                          <Badge variant={
                            b.status === 'Confirmed' ? 'success' :
                            b.status === 'Payment Uploaded' ? 'info' :
                            b.status === 'Pending Payment' ? 'warning' : 'danger'
                          }>
                            {b.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{b.event_time} · {b.emirate}</p>
                        <Link to={`/admin/bookings/${b.booking_ref}`}>
                          <button className="w-full py-1.5 bg-brand-blue/20 hover:bg-brand-blue/30 text-brand-blue text-xs font-medium rounded-lg transition-colors">
                            View Booking
                          </button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Bookings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <p className="text-slate-400 text-sm">No upcoming bookings.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map(b => (
                    <Link key={b.id} to={`/admin/bookings/${b.booking_ref}`}>
                      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <div className={`w-2 h-10 rounded-full shrink-0 ${STATUS_COLORS[b.status] || 'bg-slate-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-200 text-sm truncate">{b.customer_name}</p>
                          <p className="text-xs text-slate-400 truncate">{b.package_name}</p>
                          <p className="text-xs text-brand-blue">{b.event_date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}