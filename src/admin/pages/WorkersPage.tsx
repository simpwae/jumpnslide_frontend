import React, { useState } from 'react';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  UsersIcon,
  UserCheckIcon,
  UserXIcon,
  CalendarIcon } from
'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
import { useLanguage } from '../context/LanguageContext';
const MOCK_WORKERS = [
{
  id: '1',
  name: 'Ahmad Hassan',
  nameAr: 'أحمد حسن',
  role: 'Setup Technician',
  roleAr: 'فني تركيب',
  phone: '+971 50 123 4567',
  status: 'active',
  eventsThisMonth: 12
},
{
  id: '2',
  name: 'Omar Khalil',
  nameAr: 'عمر خليل',
  role: 'Machine Operator',
  roleAr: 'مشغل آلات',
  phone: '+971 55 234 5678',
  status: 'active',
  eventsThisMonth: 8
},
{
  id: '3',
  name: 'Yusuf Ali',
  nameAr: 'يوسف علي',
  role: 'Delivery Driver',
  roleAr: 'سائق توصيل',
  phone: '+971 52 345 6789',
  status: 'active',
  eventsThisMonth: 15
},
{
  id: '4',
  name: 'Mariam Noor',
  nameAr: 'مريم نور',
  role: 'Face Painter',
  roleAr: 'رسامة وجوه',
  phone: '+971 56 456 7890',
  status: 'inactive',
  eventsThisMonth: 0
},
{
  id: '5',
  name: 'Hassan Raza',
  nameAr: 'حسن رضا',
  role: 'Setup Technician',
  roleAr: 'فني تركيب',
  phone: '+971 50 567 8901',
  status: 'active',
  eventsThisMonth: 10
}];

export function WorkersPage() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('list');
  const [workers, setWorkers] = useState(MOCK_WORKERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Add Form State
  const [newName, setNewName] = useState('');
  const [newNameAr, setNewNameAr] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newRoleAr, setNewRoleAr] = useState('');
  const [newPhone, setNewPhone] = useState('');
  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editNameAr, setEditNameAr] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editRoleAr, setEditRoleAr] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newRole.trim()) return;
    const newWorker = {
      id: `new-${Date.now()}`,
      name: newName,
      nameAr: newNameAr || newName,
      role: newRole,
      roleAr: newRoleAr || newRole,
      phone: newPhone,
      status: 'active',
      eventsThisMonth: 0
    };
    setWorkers([newWorker, ...workers]);
    setNewName('');
    setNewNameAr('');
    setNewRole('');
    setNewRoleAr('');
    setNewPhone('');
    setShowAddForm(false);
  };
  const startEdit = (worker: any) => {
    setEditingId(worker.id);
    setEditName(worker.name);
    setEditNameAr(worker.nameAr);
    setEditRole(worker.role);
    setEditRoleAr(worker.roleAr);
    setEditPhone(worker.phone);
  };
  const handleSaveEdit = (id: string) => {
    setWorkers((prev) =>
    prev.map((w) =>
    w.id === id ?
    {
      ...w,
      name: editName,
      nameAr: editNameAr,
      role: editRole,
      roleAr: editRoleAr,
      phone: editPhone
    } :
    w
    )
    );
    setEditingId(null);
  };
  const toggleStatus = (id: string) => {
    setWorkers((prev) =>
    prev.map((worker) =>
    worker.id === id ?
    {
      ...worker,
      status: worker.status === 'active' ? 'inactive' : 'active'
    } :
    worker
    )
    );
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      setWorkers((prev) => prev.filter((w) => w.id !== id));
    }
  };
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter((w) => w.status === 'active').length;
  const inactiveWorkers = totalWorkers - activeWorkers;
  const totalEvents = workers.reduce((sum, w) => sum + w.eventsThisMonth, 0);
  const stats = [
  {
    title: t('workers.totalWorkers'),
    value: totalWorkers,
    icon: UsersIcon,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    title: t('workers.activeWorkers'),
    value: activeWorkers,
    icon: UserCheckIcon,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  },
  {
    title: t('workers.inactiveWorkers'),
    value: inactiveWorkers,
    icon: UserXIcon,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10'
  },
  {
    title: t('workers.totalEvents'),
    value: totalEvents,
    icon: CalendarIcon,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  }];

  const tabs = [
  {
    id: 'list',
    label: 'Workers List'
  },
  {
    id: 'info',
    label: 'Worker Information'
  },
  {
    id: 'assignments',
    label: 'Event Assignments'
  },
  {
    id: 'performance',
    label: 'Worker Performance'
  },
  {
    id: 'analytics',
    label: 'Performance Analytics'
  },
  {
    id: 'feedback',
    label: 'Worker Feedback System'
  }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            {t('workers.title')}
          </h2>
          <p className="text-sm text-slate-400 mt-1">{t('workers.desc')}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <PlusIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('workers.add')}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-800">
        {tabs.map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-brand-blue text-brand-blue' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'}`}>
          
            {tab.label}
          </button>
        )}
      </div>

      {activeTab === 'list' &&
      <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) =>
          <Card key={i}>
                <CardContent className="p-4 flex items-center space-x-4 rtl:space-x-reverse">
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

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('workers.name')}</TableHead>
                    <TableHead>{t('workers.role')}</TableHead>
                    <TableHead>{t('workers.phone')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('workers.events')}</TableHead>
                    <TableHead className={isRTL ? 'text-left' : 'text-right'}>
                      {t('common.actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workers.map((worker) =>
                editingId === worker.id ?
                <TableRow key={worker.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="EN Name"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                      
                            <input
                        type="text"
                        value={editNameAr}
                        onChange={(e) => setEditNameAr(e.target.value)}
                        placeholder="AR Name"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                      
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <input
                        type="text"
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        placeholder="EN Role"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                      
                            <input
                        type="text"
                        value={editRoleAr}
                        onChange={(e) => setEditRoleAr(e.target.value)}
                        placeholder="AR Role"
                        className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                      
                          </div>
                        </TableCell>
                        <TableCell>
                          <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                    
                        </TableCell>
                        <TableCell>
                          <Badge
                      variant={
                      worker.status === 'active' ? 'success' : 'default'
                      }>
                      
                            {worker.status === 'active' ?
                      t('common.active') :
                      t('common.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {worker.eventsThisMonth}
                        </TableCell>
                        <TableCell
                    className={isRTL ? 'text-left' : 'text-right'}>
                    
                          <div
                      className={`flex items-center justify-end space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      
                            <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}>
                        
                              {t('common.cancel')}
                            </Button>
                            <Button
                        size="sm"
                        onClick={() => handleSaveEdit(worker.id)}>
                        
                              {t('common.save')}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow> :

                <TableRow key={worker.id}>
                        <TableCell className="font-medium text-slate-200">
                          {isRTL ? worker.nameAr : worker.name}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {isRTL ? worker.roleAr : worker.role}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {worker.phone}
                        </TableCell>
                        <TableCell>
                          <button onClick={() => toggleStatus(worker.id)}>
                            <Badge
                        variant={
                        worker.status === 'active' ?
                        'success' :
                        'default'
                        }
                        className="cursor-pointer hover:opacity-80">
                        
                              {worker.status === 'active' ?
                        t('common.active') :
                        t('common.inactive')}
                            </Badge>
                          </button>
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {worker.eventsThisMonth}
                        </TableCell>
                        <TableCell
                    className={isRTL ? 'text-left' : 'text-right'}>
                    
                          <div
                      className={`flex items-center justify-end space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                      
                            <Button
                        variant="ghost"
                        size="sm"
                        className="px-2"
                        onClick={() => startEdit(worker)}>
                        
                              <EditIcon className="w-4 h-4" />
                            </Button>
                            <Button
                        variant="ghost"
                        size="sm"
                        className="px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                        onClick={() => handleDelete(worker.id)}>
                        
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      }

      {activeTab === 'info' &&
      <Card>
          <CardContent className="p-8 text-center text-slate-400">
            Worker Information module coming soon.
          </CardContent>
        </Card>
      }

      {activeTab === 'assignments' &&
      <Card>
          <CardContent className="p-8 text-center text-slate-400">
            Event Assignments module coming soon.
          </CardContent>
        </Card>
      }

      {activeTab === 'performance' &&
      <Card>
          <CardContent className="p-8 text-center text-slate-400">
            Worker Performance module coming soon.
          </CardContent>
        </Card>
      }

      {activeTab === 'analytics' &&
      <Card>
          <CardContent className="p-8 text-center text-slate-400">
            Performance Analytics module coming soon.
          </CardContent>
        </Card>
      }

      {activeTab === 'feedback' &&
      <Card>
          <CardContent className="p-8 text-center text-slate-400">
            Worker Feedback System coming soon.
          </CardContent>
        </Card>
      }
    </div>);

}