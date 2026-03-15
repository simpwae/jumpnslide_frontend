import React, { useState } from 'react';
import {
  PlusIcon, EditIcon, TrashIcon, UsersIcon,
  UserCheckIcon, UserXIcon, CalendarIcon,
  PhoneIcon, XIcon, ChevronRightIcon,
  DollarSignIcon, ClockIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PAY_PER_EVENT = 150; // AED — confirm with admin

interface Assignment {
  id: string;
  bookingRef: string;
  customerName: string;
  package: string;
  date: string;
  timeSlot: string;
  location: string;
  workerIds: string[];
  adminNotes: Record<string, string>;
}

const MOCK_WORKERS = [
  { id: '1', name: 'Ahmad Hassan', role: 'Setup Technician', phone: '+971 50 123 4567', status: 'active' },
  { id: '2', name: 'Omar Khalil', role: 'Machine Operator', phone: '+971 55 234 5678', status: 'active' },
  { id: '3', name: 'Yusuf Ali', role: 'Delivery Driver', phone: '+971 52 345 6789', status: 'active' },
  { id: '4', name: 'Mariam Noor', role: 'Face Painter', phone: '+971 56 456 7890', status: 'inactive' },
  { id: '5', name: 'Hassan Raza', role: 'Setup Technician', phone: '+971 50 567 8901', status: 'active' },
];

const MOCK_ASSIGNMENTS = [
  { id: 'a1', bookingRef: 'JNS-20260315-001', customerName: 'Sarah Ahmed', package: 'Ultimate Party', date: '2026-03-15', timeSlot: 'Evening (4PM-8PM)', location: 'Dubai - Jumeirah 3', workerIds: ['1', '2'], adminNotes: { '1': 'Great setup, arrived early.', '2': '' } },
  { id: 'a2', bookingRef: 'JNS-20260315-002', customerName: 'Mohammed R.', package: 'Splash Zone', date: '2026-03-15', timeSlot: 'Morning (8AM-12PM)', location: 'Sharjah - Al Nahda', workerIds: ['3', '1'], adminNotes: { '3': '', '1': '' } },
  { id: 'a3', bookingRef: 'JNS-20260316-001', customerName: 'Fatima Al Suwaidi', package: 'Party Starter', date: '2026-03-16', timeSlot: 'Afternoon (12PM-4PM)', location: 'Abu Dhabi - Khalidiyah', workerIds: ['2', '5'], adminNotes: { '2': 'Customer very happy.', '5': '' } },
  { id: 'a4', bookingRef: 'JNS-20260320-001', customerName: 'David C.', package: 'Snack Fiesta', date: '2026-03-20', timeSlot: 'Evening (4PM-8PM)', location: 'RAK - Al Hamra', workerIds: [], adminNotes: {} },
  { id: 'a5', bookingRef: 'JNS-20260322-001', customerName: 'Aisha K.', package: 'Birthday Bash', date: '2026-03-22', timeSlot: 'Afternoon (12PM-4PM)', location: 'Ajman - Al Rashidiya', workerIds: [], adminNotes: {} },
];

const ROLES = ['Setup Technician', 'Machine Operator', 'Delivery Driver', 'Face Painter', 'Supervisor', 'General Helper'];

export function WorkersPage() {
  const [activeTab, setActiveTab] = useState('workers');
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [earningsPeriod, setEarningsPeriod] = useState('month');
  const [assigningTo, setAssigningTo] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<{ assignmentId: string; workerId: string } | null>(null);
  const [noteText, setNoteText] = useState('');

  // Add form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Stats
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const inactiveWorkers = totalWorkers - activeWorkers;
  const totalAssignments = assignments.reduce((sum, a) => sum + a.workerIds.length, 0);

  const getWorkerEventCount = (workerId: string) =>
    assignments.filter(a => a.workerIds.includes(workerId)).length;

  const getWorkerEarnings = (workerId: string) =>
    getWorkerEventCount(workerId) * PAY_PER_EVENT;

  const totalPayOwed = workers.reduce((sum, w) => sum + getWorkerEarnings(w.id), 0);

  const getWorkerAssignments = (workerId: string) =>
    assignments.filter(a => a.workerIds.includes(workerId));

  // Check if worker has conflict on same date+timeSlot
  const hasConflict = (workerId: string, assignmentId: string) => {
    const target = assignments.find(a => a.id === assignmentId);
    if (!target) return false;
    return assignments.some(a =>
      a.id !== assignmentId &&
      a.date === target.date &&
      a.timeSlot === target.timeSlot &&
      a.workerIds.includes(workerId)
    );
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;
    setWorkers(prev => [...prev, {
      id: `w-${Date.now()}`,
      name: newName,
      role: newRole,
      phone: newPhone,
      status: 'active'
    }]);
    setNewName(''); setNewRole(''); setNewPhone('');
    setShowAddForm(false);
  };

  const startEdit = (worker: typeof MOCK_WORKERS[0]) => {
    setEditingId(worker.id);
    setEditName(worker.name);
    setEditRole(worker.role);
    setEditPhone(worker.phone);
  };

  const handleSaveEdit = (id: string) => {
    setWorkers(prev => prev.map(w =>
      w.id === id ? { ...w, name: editName, role: editRole, phone: editPhone } : w
    ));
    setEditingId(null);
  };

  const toggleStatus = (id: string) => {
    setWorkers(prev => prev.map(w =>
      w.id === id ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' } : w
    ));
  };

  const handleDelete = (id: string) => setConfirmDelete(id);
  const confirmDeleteWorker = () => {
    if (confirmDelete) {
      setWorkers(prev => prev.filter(w => w.id !== confirmDelete));
      setConfirmDelete(null);
    }
  };

  const assignWorker = (assignmentId: string, workerId: string) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId && !a.workerIds.includes(workerId)
        ? { ...a, workerIds: [...a.workerIds, workerId] }
        : a
    ));
    setAssigningTo(null);
  };

  const removeWorkerFromAssignment = (assignmentId: string, workerId: string) => {
    setAssignments(prev => prev.map(a =>
      a.id === assignmentId
        ? { ...a, workerIds: a.workerIds.filter(id => id !== workerId) }
        : a
    ));
  };

  const saveNote = () => {
    if (!editingNote) return;
    setAssignments(prev => prev.map(a =>
      a.id === editingNote.assignmentId
        ? { ...a, adminNotes: { ...a.adminNotes, [editingNote.workerId]: noteText } }
        : a
    ));
    setEditingNote(null);
    setNoteText('');
  };

  const earningsChartData = workers
    .filter(w => w.status === 'active')
    .map(w => ({
      name: w.name.split(' ')[0],
      earnings: getWorkerEarnings(w.id),
      events: getWorkerEventCount(w.id)
    }));

  const selectedWorkerData = selectedWorker ? workers.find(w => w.id === selectedWorker) : null;
  const selectedWorkerAssignments = selectedWorker ? getWorkerAssignments(selectedWorker) : [];

  const tabs = [
    { id: 'workers', label: 'Workers' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'earnings', label: 'Earnings' },
  ];

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Workers', value: totalWorkers, icon: UsersIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Active', value: activeWorkers, icon: UserCheckIcon, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Inactive', value: inactiveWorkers, icon: UserXIcon, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'Pay Owed (Month)', value: `AED ${totalPayOwed}`, icon: DollarSignIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
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
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Worker
            </Button>
          </div>

          {showAddForm && (
            <Card className="border-brand-blue/30">
              <CardContent className="p-6">
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-1">Full Name</label>
                      <input
                        required
                        type="text"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        placeholder="e.g. Ahmad Hassan"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-1">Role</label>
                      <select
                        required
                        value={newRole}
                        onChange={e => setNewRole(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      >
                        <option value="">Select Role...</option>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300 block mb-1">Phone</label>
                      <input
                        type="tel"
                        value={newPhone}
                        onChange={e => setNewPhone(e.target.value)}
                        placeholder="+971 50 000 0000"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    <Button type="submit">Add Worker</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {workers.map(worker => (
              <Card
                key={worker.id}
                className={`cursor-pointer transition-all hover:border-slate-600 ${selectedWorker === worker.id ? 'border-brand-blue' : ''}`}
                onClick={() => setSelectedWorker(selectedWorker === worker.id ? null : worker.id)}
              >
                <CardContent className="p-5">
                  {editingId === worker.id ? (
                    <div className="space-y-3" onClick={e => e.stopPropagation()}>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="Full Name"
                      />
                      <select
                        value={editRole}
                        onChange={e => setEditRole(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <input
                        value={editPhone}
                        onChange={e => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="Phone"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveEdit(worker.id)}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                        <Button size="sm" variant="ghost" className="flex-1" onClick={() => startEdit(worker)}>
                          <EditIcon className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="flex-1" onClick={() => toggleStatus(worker.id)}>
                          {worker.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button size="sm" variant="ghost" className="text-rose-400 hover:text-rose-300 px-2" onClick={() => handleDelete(worker.id)}>
                          <TrashIcon className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Worker Detail Panel */}
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
                            <p className="font-bold text-slate-100">{a.customerName}</p>
                            <p className="text-sm text-brand-blue">{a.package}</p>
                          </div>
                          <div className="text-right text-sm text-slate-400">
                            <p>{a.date}</p>
                            <p>{a.timeSlot}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{a.location}</p>
                        <div className="flex items-center justify-between">
                          {editingNote?.assignmentId === a.id && editingNote?.workerId === selectedWorker ? (
                            <div className="flex-1 flex gap-2">
                              <input
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                placeholder="Add admin note..."
                                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                              />
                              <Button size="sm" onClick={saveNote}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
                            </div>
                          ) : (
                            <div className="flex-1">
                              {a.adminNotes[selectedWorker!] ? (
                                <p className="text-xs text-slate-400 italic">"{a.adminNotes[selectedWorker!]}"</p>
                              ) : (
                                <p className="text-xs text-slate-600">No note added</p>
                              )}
                            </div>
                          )}
                          {editingNote?.assignmentId !== a.id && (
                            <Button
                              size="sm" variant="ghost"
                              onClick={() => {
                                setEditingNote({ assignmentId: a.id, workerId: selectedWorker! });
                                setNoteText(a.adminNotes[selectedWorker!] || '');
                              }}
                            >
                              <EditIcon className="w-3 h-3 mr-1" />
                              {a.adminNotes[selectedWorker!] ? 'Edit Note' : 'Add Note'}
                            </Button>
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
          {assignments.map(assignment => (
            <Card key={assignment.id}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-brand-blue text-sm">{assignment.bookingRef}</span>
                      {assignment.workerIds.length === 0 && (
                        <Badge variant="warning">Unassigned</Badge>
                      )}
                    </div>
                    <h4 className="font-bold text-lg text-slate-100">{assignment.customerName}</h4>
                    <p className="text-sm text-slate-400">{assignment.package}</p>
                  </div>
                  <div className="text-sm text-slate-400 text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <CalendarIcon className="w-4 h-4" />
                      {assignment.date}
                    </div>
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <ClockIcon className="w-4 h-4" />
                      {assignment.timeSlot}
                    </div>
                    <p>{assignment.location}</p>
                  </div>
                </div>

                {/* Assigned Workers */}
                <div className="space-y-2 mb-3">
                  {assignment.workerIds.length > 0 ? (
                    assignment.workerIds.map(wId => {
                      const worker = workers.find(w => w.id === wId);
                      if (!worker) return null;
                      return (
                        <div key={wId} className="flex items-center justify-between bg-slate-800/50 rounded-lg px-4 py-2">
                          <div>
                            <span className="font-medium text-slate-200">{worker.name}</span>
                            <span className="text-xs text-slate-400 ml-2">{worker.role}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {editingNote?.assignmentId === assignment.id && editingNote?.workerId === wId ? (
                              <div className="flex gap-2">
                                <input
                                  value={noteText}
                                  onChange={e => setNoteText(e.target.value)}
                                  placeholder="Add note..."
                                  className="px-3 py-1 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue w-48"
                                />
                                <Button size="sm" onClick={saveNote}>Save</Button>
                                <Button size="sm" variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
                              </div>
                            ) : (
                              <>
                                {assignment.adminNotes[wId] && (
                                  <span className="text-xs text-slate-400 italic">"{assignment.adminNotes[wId]}"</span>
                                )}
                                <Button
                                  size="sm" variant="ghost"
                                  onClick={() => {
                                    setEditingNote({ assignmentId: assignment.id, workerId: wId });
                                    setNoteText(assignment.adminNotes[wId] || '');
                                  }}
                                >
                                  <EditIcon className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <button
                              onClick={() => removeWorkerFromAssignment(assignment.id, wId)}
                              className="text-rose-400 hover:text-rose-300 transition-colors"
                            >
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
                {assigningTo === assignment.id ? (
                  <div className="bg-slate-800/30 rounded-xl p-4">
                    <p className="text-sm font-medium text-slate-300 mb-3">Select worker to assign:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {workers.filter(w => w.status === 'active' && !assignment.workerIds.includes(w.id)).map(worker => {
                        const conflict = hasConflict(worker.id, assignment.id);
                        return (
                          <button
                            key={worker.id}
                            onClick={() => !conflict && assignWorker(assignment.id, worker.id)}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${conflict ? 'border-rose-500/30 bg-rose-500/5 opacity-60 cursor-not-allowed' : 'border-slate-700 hover:border-brand-blue hover:bg-brand-blue/5 cursor-pointer'}`}
                          >
                            <div>
                              <p className="font-medium text-slate-200 text-sm">{worker.name}</p>
                              <p className="text-xs text-slate-400">{worker.role}</p>
                            </div>
                            {conflict ? (
                              <Badge variant="danger">Conflict</Badge>
                            ) : (
                              <ChevronRightIcon className="w-4 h-4 text-slate-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <Button variant="ghost" size="sm" className="mt-3" onClick={() => setAssigningTo(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setAssigningTo(assignment.id)}>
                    <PlusIcon className="w-3.5 h-3.5 mr-1" />
                    Assign Worker
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 3 — EARNINGS */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100">Worker Earnings</h3>
            <select
              value={earningsPeriod}
              onChange={e => setEarningsPeriod(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader><CardTitle>Earnings by Worker (AED)</CardTitle></CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={v => `AED ${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                      formatter={(value: number) => [`AED ${value}`, 'Earnings']}
                    />
                    <Bar dataKey="earnings" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Earnings Table */}
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
                        <Badge variant={worker.status === 'active' ? 'success' : 'danger'}>
                          {worker.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">{getWorkerEventCount(worker.id)}</TableCell>
                      <TableCell className="text-slate-300">AED {PAY_PER_EVENT}</TableCell>
                      <TableCell className="font-bold text-emerald-400">AED {getWorkerEarnings(worker.id)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={5} className="font-bold text-slate-200">Total</TableCell>
                    <TableCell className="font-bold text-emerald-400">AED {totalPayOwed}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Worker"
          message="Are you sure you want to delete this worker? This cannot be undone."
          confirmLabel="Delete"
          onConfirm={confirmDeleteWorker}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}