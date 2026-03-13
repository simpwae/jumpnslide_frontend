import React, { useState } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LockIcon,
  XIcon,
  CalendarDaysIcon } from
'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
// Mock bookings for calendar
const mockBookings = [
{
  id: '#JNS-001',
  customer: 'Sarah Ahmed',
  package: 'Ultimate Party',
  status: 'Confirmed',
  date: '2026-03-15',
  time: '4:00 PM'
},
{
  id: '#JNS-002',
  customer: 'Mohammed R.',
  package: 'Splash Zone',
  status: 'Pending',
  date: '2026-03-15',
  time: '10:00 AM'
},
{
  id: '#JNS-003',
  customer: 'Fatima Al Suwaidi',
  package: 'Party Starter',
  status: 'Completed',
  date: '2026-03-14',
  time: '2:00 PM'
},
{
  id: '#JNS-004',
  customer: 'David C.',
  package: 'Snack Fiesta',
  status: 'Payment Uploaded',
  date: '2026-03-20',
  time: '5:00 PM'
},
{
  id: '#JNS-005',
  customer: 'Aisha K.',
  package: 'Birthday Bash',
  status: 'Confirmed',
  date: '2026-03-22',
  time: '3:00 PM'
},
{
  id: '#JNS-006',
  customer: 'Omar Tariq',
  package: 'Game Day',
  status: 'Pending',
  date: '2026-03-25',
  time: '11:00 AM'
}];

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [lockedDates, setLockedDates] = useState<string[]>([
  '2026-03-18',
  '2026-03-19']
  );
  // Mock time slots state for the selected date
  const [timeSlots, setTimeSlots] = useState<
    Record<string, Record<string, boolean>>>(
    {
      '2026-03-15': {
        morning: false,
        afternoon: true,
        evening: true
      },
      '2026-03-16': {
        morning: true,
        afternoon: true,
        evening: false
      }
    });
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };
  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setIsPanelOpen(true);
  };
  const getBookingsForDate = (dateStr: string) => {
    return mockBookings.filter((b) => b.date === dateStr);
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
  // Generate calendar grid
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(
      <div
        key={`empty-${i}`}
        className="h-24 sm:h-32 bg-slate-900/30 border border-slate-800/50 rounded-lg">
      </div>
    );
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const dayBookings = getBookingsForDate(dateStr);
    const isLocked = lockedDates.includes(dateStr);
    const isToday = i === 10 && currentDate.getMonth() === 2; // Mock today as March 10
    let borderColor = 'border-slate-800';
    if (isToday) borderColor = 'border-brand-blue ring-1 ring-brand-blue';else
    if (isLocked) borderColor = 'border-rose-500/50';else
    if (dayBookings.length > 0) borderColor = 'border-amber-500/50';
    days.push(
      <div
        key={i}
        onClick={() => handleDateClick(dateStr)}
        className={`h-24 sm:h-32 bg-slate-900 border ${borderColor} rounded-lg p-2 cursor-pointer hover:bg-slate-800 transition-colors flex flex-col`}>
        
        <div className="flex justify-between items-start">
          <span
            className={`text-sm font-medium ${isToday ? 'text-brand-blue font-bold' : 'text-slate-300'}`}>
            
            {i}
          </span>
          {isLocked && <LockIcon className="w-4 h-4 text-rose-400" />}
        </div>

        <div className="mt-auto space-y-1 overflow-hidden">
          {dayBookings.slice(0, 2).map((b, idx) =>
          <div
            key={idx}
            className="text-[10px] sm:text-xs truncate bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
            
              {b.time} - {b.customer.split(' ')[0]}
            </div>
          )}
          {dayBookings.length > 2 &&
          <div className="text-[10px] text-slate-500 font-medium">
              +{dayBookings.length - 2} more
            </div>
          }
        </div>
      </div>
    );
  }
  const selectedDateBookings = selectedDate ?
  getBookingsForDate(selectedDate) :
  [];
  const isSelectedLocked = selectedDate ?
  lockedDates.includes(selectedDate) :
  false;
  const handleToggleLock = () => {
    if (!selectedDate) return;
    if (isSelectedLocked) {
      setLockedDates((prev) => prev.filter((d) => d !== selectedDate));
    } else {
      setLockedDates((prev) => [...prev, selectedDate]);
    }
  };
  const handleToggleSlot = (slot: string) => {
    if (!selectedDate) return;
    setTimeSlots((prev) => {
      const dateSlots = prev[selectedDate] || {
        morning: true,
        afternoon: true,
        evening: true
      };
      return {
        ...prev,
        [selectedDate]: {
          ...dateSlots,
          [slot]: !dateSlots[slot]
        }
      };
    });
  };
  const currentSlots = selectedDate ?
  timeSlots[selectedDate] || {
    morning: true,
    afternoon: true,
    evening: true
  } :
  {
    morning: true,
    afternoon: true,
    evening: true
  };
  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            Booking Calendar
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage dates and view daily schedules.
          </p>
        </div>
        <div className="flex items-center space-x-4 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={prevMonth}
            className="px-2">
            
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
          <span className="font-heading font-semibold text-slate-200 min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={nextMonth}
            className="px-2">
            
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) =>
            <div
              key={day}
              className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider py-2">
              
                {day}
              </div>
            )}
          </div>
          <div className="grid grid-cols-7 gap-2">{days}</div>
        </CardContent>
      </Card>

      {/* Side Panel */}
      {isPanelOpen && selectedDate &&
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-100">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
              </h3>
              <p className="text-sm text-slate-400">
                {selectedDateBookings.length} Bookings
              </p>
            </div>
            <button
            onClick={() => setIsPanelOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-full hover:bg-slate-800">
            
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-slate-200">Date Status</p>
                <p className="text-sm text-slate-500">
                  {isSelectedLocked ?
                'Locked for new bookings' :
                'Open for bookings'}
                </p>
              </div>
              <Button
              variant={isSelectedLocked ? 'outline' : 'danger'}
              size="sm"
              onClick={handleToggleLock}>
              
                {isSelectedLocked ? 'Unlock Date' : 'Lock Date'}
              </Button>
            </div>

            {!isSelectedLocked &&
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <h4 className="font-medium text-slate-200 mb-3">
                  Available Time Slots
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Morning (8AM - 12PM)
                    </span>
                    <button
                  onClick={() => handleToggleSlot('morning')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentSlots.morning ? 'bg-brand-blue' : 'bg-slate-700'}`}>
                  
                      <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentSlots.morning ? 'translate-x-6' : 'translate-x-1'}`} />
                  
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Afternoon (12PM - 5PM)
                    </span>
                    <button
                  onClick={() => handleToggleSlot('afternoon')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentSlots.afternoon ? 'bg-brand-blue' : 'bg-slate-700'}`}>
                  
                      <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentSlots.afternoon ? 'translate-x-6' : 'translate-x-1'}`} />
                  
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Evening (5PM - 10PM)
                    </span>
                    <button
                  onClick={() => handleToggleSlot('evening')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentSlots.evening ? 'bg-brand-blue' : 'bg-slate-700'}`}>
                  
                      <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${currentSlots.evening ? 'translate-x-6' : 'translate-x-1'}`} />
                  
                    </button>
                  </div>
                </div>
              </div>
          }

            {selectedDateBookings.length > 0 ?
          <div className="space-y-4">
                <h4 className="font-medium text-slate-400 text-sm uppercase tracking-wider">
                  Schedule
                </h4>
                {selectedDateBookings.map((booking) =>
            <div
              key={booking.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-brand-blue">
                        {booking.time}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <p className="font-medium text-slate-200">
                      {booking.customer}
                    </p>
                    <p className="text-sm text-slate-400 mb-3">
                      {booking.package}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" className="flex-1">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Contact
                      </Button>
                    </div>
                  </div>
            )}
              </div> :

          <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDaysIcon className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400">No bookings for this date.</p>
              </div>
          }
          </div>
        </div>
      }

      {/* Overlay for side panel */}
      {isPanelOpen &&
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={() => setIsPanelOpen(false)} />

      }
    </div>);

}