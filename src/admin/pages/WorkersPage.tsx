import React, { useState, useEffect } from 'react';
import {
  PlusIcon, EditIcon, TrashIcon, UsersIcon,
  UserCheckIcon, UserXIcon, CalendarIcon,
  PhoneIcon, XIcon, DollarSignIcon, Loader2Icon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { EditModal } from '../components/ui/EditModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';

const PAY_PER_EVENT = 150;

const ROLES = [
  'Setup Technician', 'Machine Operator', 'Delivery Driver',
  'Face Painter', 'Supervisor', 'General Helper'
];

interface Worker {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: string;
  created_at: string;
}

interface Assignment {
  id: string;
  booking_ref: string;
  worker_id: string;
  admin_note: string;
  booking_date: string;
  package_name: string;
  time_slot: string;
  location: string;
  created_at: string;
}

export function WorkersPage() {
  const [activeTab, setActiveTab] = useState('workers');
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [earningsPeriod, setEarningsPeriod] = useState('month');
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<{ assignmentId: string; workerId: string } | null>(null);
  const [noteText, setNoteText] = useState('');

  // Add form
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Edit form
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editPhone, setEditPhone] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [workersRes, assignmentsRes, bookingsRes] = await Promise.all([
      supabase.from('workers').select('*').order('created_at', { ascending: true }),
      supabase.from('worker_assignments').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('*').in('status', ['Confirmed', 'Payment Uploaded', 'Pending Payment']).order('event_date', { ascending: true }),
    ]);
    if (workersRes.data) setWorkers(workersRes.data);
    if (assignmentsRes.data) setAssignments(assignmentsRes.data);
    if (bookingsRes.data) setBookings(bookingsRes.data);
    setLoading(false);
  };

  // Stats
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const inactiveWorkers = totalWorkers - activeWorkers;

  const getWorkerAssignments = (workerId: string) =>
    assignments.filter(a => a.worker_id === workerId);

  const getWorkerEventCount = (workerId: string) =>
    getWorkerAssignments(workerId).length;

  const getWorkerEarnings = (workerId: string) =>
    getWorkerEventCount(workerId) * PAY_PER_EVENT;

  const totalPayOwed = workers.reduce((sum, w) => sum + getWorkerEarnings(w.id), 0);

  const hasConflict = (workerId: string, bookingRef: string) => {
    const target = bookings.find(b => b.booking_ref === bookingRef);
    if (!target) return false;
    return assignments.some(a =>
      a.worker_id === workerId &&
      a.booking_ref !== bookingRef &&
      a.booking_date === target.event_date &&
      a.time_slot === target.event_time
    );
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('workers')
      .insert({ name: newName, role: newRole, phone: newPhone, status: 'active' })
      .select().single();
    if (!error && data) {
      setWorkers(prev => [...prev, data]);
      setNewName(''); setNewRole(''); setNewPhone('');
      setShowAddForm(false);
    }
    setSaving(false);
  };

  const handleSaveEdit = async () => {
    if (!editingWorker) return;
    setSaving(true);
    const { error } = await supabase
      .from('workers')
      .update({ name: editName, role: editRole, phone: editPhone })
      .eq('id', editingWorker.id);
    if (!error) {
      setWorkers(prev => prev.map(w =>
        w.id === editingWorker.id ? { ...w, name: editName, role: editRole, phone: editPhone } : w
      ));
      setEditingWorker(null);
    }
    setSaving(false);
  };

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === 'active' ? 'inactive' : 'active';
    const { error } = await supabase.from('workers').update({ status: newStatus }).eq('id', id);
    if (!error) setWorkers(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
  };

  const handleDelete = (id: string) => setConfirmDelete(id);

  const confirmDeleteWorker = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from('workers').delete().eq('id', confirmDelete);
    if (!error) setWorkers(prev => prev.filter(w => w.id !== confirmDelete));
    setConfirmDelete(null);
  };

  const assignWorker = async (bookingRef: string, workerId: string) => {
    const booking = bookings.find(b => b.booking_ref === bookingRef);
    if (!booking) return;
    const { data, error } = await supabase
      .from('worker_assignments')
      .insert({
        booking_ref: bookingRef,
        worker_id: workerId,
        booking_date: booking.event_date,
        package_name: booking.package_name,
        time_slot: booking.event_time,
        location: `${booking.emirate} - ${booking.area}`,
        admin_note: '',
      })
      .select().single();
    if (!error && data) {
      setAssignments(prev => [data, ...prev]);
      setAssigningTo(null);
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    const { error } = await supabase.from('worker_assignments').delete().eq('id', assignmentId);
    if (!error) setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  const saveNote = async () => {
    if (!editingNote) return;
    const { error } = await supabase
      .from('worker_assignments')
      .update({ admin_note: noteText })
      .eq('id', editingNote.assignmentId);
    if (!error) {
      setAssignments(prev => prev.map(a =>
        a.id === editingNote.assignmentId ? { ...a, admin_note: noteText } : a
      ));
      setEditingNote(null);
      setNoteText('');
    }
  };

  const earningsChartData = workers
    .filter(w => w.status === 'active')
    .map(w => ({
      name: w.name.split(' ')[0],
      earnings: getWorkerEarnings(w.id),
      events: getWorkerEventCount(w.id),
    }));

  const selectedWorkerData = selectedWorker ? workers.find(w => w.id === selectedWorker) : null;
  const selectedWorkerAssignments = selectedWorker ? getWorkerAssignments(selectedWorker) : [];

  const tabs = [
    { id: 'workers', label: 'Workers' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'earnings', label: 'Earnings' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Workers', value: totalWorkers, icon: UsersIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Active', value: activeWorkers, icon: UserCheckIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Inactive', value: inactiveWorkers, icon: UserXIcon, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Pay Owed', value: `AED ${totalPayOwed}`, icon: DollarSignIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="text-xl font-bold text-slate-100">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-brand-blue text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1 — WORKERS */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-100">All Workers</h3>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <PlusIcon className="w-4 h-4 mr-2" />Add Worker
            </Button>
          </div>

          {showAddForm && (
            <Card className="border-brand-blue/30">
              <CardContent className="p-6">
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-1">Full Name</label>
                      <input required value={newName} onChange={e => setNewName(e.target.value)}
                        placeholder="e.g. Ahmad Hassan"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-1">Role</label>
                      <select required value={newRole} onChange={e => setNewRole(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                        <option value="">Select Role...</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-1">Phone</label>
                      <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)}
                        placeholder="+971 50 000 0000"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add Worker'}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {workers.map(worker => (
              <div
                key={worker.id}
                className={`cursor-pointer transition-all hover:border-slate-600 ${selectedWorker === worker.id ? 'border-brand-blue' : ''}`}
                onClick={() => setSelectedWorker(selectedWorker === worker.id ? null : worker.id)}
              >
                <Card>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-slate-100">{worker.name}</h4>
                        <p className="text-sm text-brand-blue font-medium">{worker.role}</p>
                      </div>
                      <Badge variant={worker.status === 'active' ? 'success' : 'danger'}>
                        {worker.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-slate-400 mb-4">
                      <PhoneIcon className="w-4 h-4 mr-2 shrink-0" />
                      {worker.phone}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-slate-100">{getWorkerEventCount(worker.id)}</p>
                        <p className="text-xs text-slate-400">Events</p>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-400">AED {getWorkerEarnings(worker.id)}</p>
                        <p className="text-xs text-slate-400">Earned</p>
                      </div>
                    </div>
                    <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                      <Button size="sm" variant="ghost" className="flex-1"
                        onClick={() => {
                          setEditingWorker(worker);
                          setEditName(worker.name);
                          setEditRole(worker.role);
                          setEditPhone(worker.phone);
                        }}>
                        <EditIcon className="w-3.5 h-3.5 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1"
                        onClick={() => toggleStatus(worker.id, worker.status)}>
                        {worker.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-rose-400 px-2"
                        onClick={() => handleDelete(worker.id)}>
                        <TrashIcon className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Worker History Panel */}
          {selectedWorkerData && (
            <Card className="border-brand-blue/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{selectedWorkerData.name} — Event History</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedWorker(null)}>
                  <XIcon className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {selectedWorkerAssignments.length === 0 ? (
                  <p className="text-slate-400 text-sm">No events assigned yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedWorkerAssignments.map(a => (
                      <div key={a.id} className="bg-slate-800/50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-slate-100">{a.package_name}</p>
                            <p className="text-sm text-brand-blue">{a.booking_ref}</p>
                          </div>
                          <div className="text-right text-sm text-slate-400">
                            <p>{a.booking_date}</p>
                            <p>{a.time_slot}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{a.location}</p>
                        <div className="flex items-center justify-between">
                          {editingNote?.assignmentId === a.id ? (
                            <div className="flex-1 flex gap-2">
                              <input value={noteText} onChange={e => setNoteText(e.target.value)}
                                placeholder="Add note..."
                                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                              <Button size="sm" onClick={saveNote}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
                            </div>
                          ) : (
                            <>
                              <p className="text-xs text-slate-400 italic flex-1">
                                {a.admin_note || 'No note added'}
                              </p>
                              <Button size="sm" variant="ghost"
                                onClick={() => {
                                  setEditingNote({ assignmentId: a.id, workerId: selectedWorker! });
                                  setNoteText(a.admin_note || '');
                                }}>
                                <EditIcon className="w-3 h-3 mr-1" />
                                {a.admin_note ? 'Edit' : 'Add Note'}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* TAB 2 — ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-100">Event Assignments</h3>
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-slate-400">
                No upcoming bookings to assign workers to.
              </CardContent>
            </Card>
          ) : (
            bookings.map(booking => {
              const bookingAssignments = assignments.filter(a => a.booking_ref === booking.booking_ref);
              return (
                <Card key={booking.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-brand-blue text-sm">{booking.booking_ref}</span>
                          {bookingAssignments.length === 0 && <Badge variant="warning">Unassigned</Badge>}
                        </div>
                        <h4 className="font-bold text-lg text-slate-100">{booking.customer_name}</h4>
                        <p className="text-sm text-slate-400">{booking.package_name}</p>
                      </div>
                      <div className="text-sm text-slate-400 text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <CalendarIcon className="w-4 h-4" />{booking.event_date}
                        </div>
                        <p>{booking.event_time}</p>
                        <p>{booking.emirate}</p>
                      </div>
                    </div>

                    {/* Assigned Workers */}
                    <div className="space-y-2 mb-3">
                      {bookingAssignments.length > 0 ? (
                        bookingAssignments.map(a => {
                          const worker = workers.find(w => w.id === a.worker_id);
                          return (
                            <div key={a.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-2">
                              <div>
                                <span className="font-medium text-slate-200">{worker?.name}</span>
                                <span className="text-xs text-slate-400 ml-2">{worker?.role}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {editingNote?.assignmentId === a.id ? (
                                  <div className="flex gap-2">
                                    <input value={noteText} onChange={e => setNoteText(e.target.value)}
                                      className="px-3 py-1 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue w-48" />
                                    <Button size="sm" onClick={saveNote}>Save</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
                                  </div>
                                ) : (
                                  <>
                                    {a.admin_note && <span className="text-xs text-slate-400 italic">"{a.admin_note}"</span>}
                                    <Button size="sm" variant="ghost"
                                      onClick={() => {
                                        setEditingNote({ assignmentId: a.id, workerId: a.worker_id });
                                        setNoteText(a.admin_note || '');
                                      }}>
                                      <EditIcon className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                                <button onClick={() => removeAssignment(a.id)} className="text-rose-400 hover:text-rose-300">
                                  <XIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-slate-500 italic">No workers assigned yet.</p>
                      )}
                    </div>

                    {/* Assign Worker */}
                    {assigningTo === booking.booking_ref ? (
                      <div className="bg-slate-800/30 rounded-xl p-4">
                        <p className="text-sm font-medium text-slate-300 mb-3">Select worker:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {workers
                            .filter(w => w.status === 'active' && !bookingAssignments.some(a => a.worker_id === w.id))
                            .map(worker => {
                              const conflict = hasConflict(worker.id, booking.booking_ref);
                              return (
                                <button key={worker.id}
                                  onClick={() => !conflict && assignWorker(booking.booking_ref, worker.id)}
                                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${conflict ? 'border-rose-500/30 bg-rose-500/5 opacity-60 cursor-not-allowed' : 'border-slate-700 hover:border-brand-blue hover:bg-brand-blue/5'}`}
                                >
                                  <div>
                                    <p className="font-medium text-slate-200 text-sm">{worker.name}</p>
                                    <p className="text-xs text-slate-400">{worker.role}</p>
                                  </div>
                                  {conflict && <Badge variant="danger">Conflict</Badge>}
                                </button>
                              );
                            })}
                        </div>
                        <Button variant="ghost" size="sm" className="mt-3" onClick={() => setAssigningTo(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setAssigningTo(booking.booking_ref)}>
                        <PlusIcon className="w-3.5 h-3.5 mr-1" />Assign Worker
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3 — EARNINGS */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Worker Earnings</h3>
            <select value={earningsPeriod} onChange={e => setEarningsPeriod(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <Card>
            <CardHeader><CardTitle>Earnings by Worker (AED)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `AED ${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                      formatter={(value: number) => [`AED ${value}`, 'Earnings']} />
                    <Bar dataKey="earnings" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Events</TableHead>
                    <TableHead>Rate/Event</TableHead>
                    <TableHead>Total Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map(worker => (
                    <TableRow key={worker.id}>
                      <TableCell className="font-medium text-slate-200">{worker.name}</TableCell>
                      <TableCell className="text-slate-400">{worker.role}</TableCell>
                      <TableCell>
                        <Badge variant={worker.status === 'active' ? 'success' : 'danger'}>{worker.status}</Badge>
                      </TableCell>
                      <TableCell>{getWorkerEventCount(worker.id)}</TableCell>
                      <TableCell>AED {PAY_PER_EVENT}</TableCell>
                      <TableCell className="font-bold text-emerald-400">AED {getWorkerEarnings(worker.id)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <td colSpan={5} className="font-bold text-slate-200">Total</td>
                    <TableCell className="font-bold text-emerald-400">AED {totalPayOwed}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Worker Modal */}
      {editingWorker && (
        <EditModal title="Edit Worker" onClose={() => setEditingWorker(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">Full Name</label>
              <input value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">Role</label>
              <select value={editRole} onChange={e => setEditRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">Phone</label>
              <input value={editPhone} onChange={e => setEditPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setEditingWorker(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            </div>
          </div>
        </EditModal>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Worker"
          message="Are you sure you want to delete this worker?"
          confirmLabel="Delete"
          onConfirm={confirmDeleteWorker}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}