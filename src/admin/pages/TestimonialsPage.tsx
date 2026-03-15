import React, { useState, useEffect } from 'react';
import { EditModal } from '../components/ui/EditModal';
import {
  PlusIcon, StarIcon, EditIcon,
  TrashIcon, MessageSquareIcon, Loader2Icon
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { supabase } from '../../lib/supabase';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  text: string;
  package_name: string;
  date: string;
  is_featured: boolean;
  admin_reply?: string;
  created_at: string;
}

export function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [newPackage, setNewPackage] = useState('');
  const [newDate, setNewDate] = useState('');

  const [editName, setEditName] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState('');
  const [editPackage, setEditPackage] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editReply, setEditReply] = useState('');

  useEffect(() => { fetchTestimonials(); }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTestimonials(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('testimonials')
      .insert({ name: newName, rating: newRating, text: newText, package_name: newPackage, date: newDate, is_featured: false })
      .select().single();
    if (!error && data) {
      setTestimonials(prev => [data, ...prev]);
      setNewName(''); setNewRating(5); setNewText(''); setNewPackage(''); setNewDate('');
      setShowAddForm(false);
    }
    setSaving(false);
  };

  const startEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id);
    setEditName(testimonial.name);
    setEditRating(testimonial.rating);
    setEditText(testimonial.text);
    setEditPackage(testimonial.package_name);
    setEditDate(testimonial.date);
    setEditReply(testimonial.admin_reply || '');
  };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('testimonials')
      .update({ name: editName, rating: editRating, text: editText, package_name: editPackage, date: editDate, admin_reply: editReply || null })
      .eq('id', id);
    if (!error) {
      setTestimonials(prev => prev.map(t =>
        t.id === id ? { ...t, name: editName, rating: editRating, text: editText, package_name: editPackage, date: editDate, admin_reply: editReply || undefined } : t
      ));
      setEditingId(null);
    }
    setSaving(false);
  };

 const toggleFeatured = async (id: string, current: boolean) => {
  // Add this check
  if (!current) {
    const featuredCount = testimonials.filter(t => t.is_featured).length;
    if (featuredCount >= 6) {
      alert('Maximum 6 featured testimonials allowed. Please unfeature one first.');
      return;
    }
  }

  const { error } = await supabase
    .from('testimonials')
    .update({ is_featured: !current })
    .eq('id', id);

  if (!error) {
    setTestimonials(prev => prev.map(t =>
      t.id === id ? { ...t, is_featured: !current } : t
    ));
  }
};

  const handleDelete = (id: string) => setConfirmDelete(id);

  const confirmDeleteTestimonial = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', confirmDelete);
    if (!error) setTestimonials(prev => prev.filter(t => t.id !== confirmDelete));
    setConfirmDelete(null);
  };

  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map(s => (
        <StarIcon key={s} className={`w-4 h-4 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">Testimonials Management</h2>
          <p className="text-sm text-slate-400 mt-1">Manage customer reviews and testimonials.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-brand-blue/50">
          <CardContent className="p-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Customer Name</label>
                  <input required type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Rating</label>
                  <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                    {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Package</label>
                  <input type="text" value={newPackage} onChange={(e) => setNewPackage(e.target.value)} placeholder="e.g. Ultimate Party"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">Date</label>
                  <input type="text" value={newDate} onChange={(e) => setNewDate(e.target.value)} placeholder="e.g. March 2026"
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Review</label>
                <textarea required value={newText} onChange={(e) => setNewText(e.target.value)} rows={3}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none" />
              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Testimonial'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-400">No testimonials found.</CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Admin Reply</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-200">{testimonial.name}</p>
                        <p className="text-xs text-slate-500">{testimonial.date}</p>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(testimonial.rating)}</TableCell>
                    <TableCell>
                      <p className="text-sm text-slate-400 max-w-xs truncate">{testimonial.text}</p>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-400">{testimonial.package_name}</span>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => toggleFeatured(testimonial.id, testimonial.is_featured)}>
                        <Badge variant={testimonial.is_featured ? 'success' : 'default'}>
                          {testimonial.is_featured ? 'Featured' : 'Not Featured'}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell>
                      {testimonial.admin_reply ? (
                        <div className="flex items-center text-xs text-slate-400">
                          <MessageSquareIcon className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-[100px]">{testimonial.admin_reply}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-600">No reply</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => startEdit(testimonial)}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(testimonial.id)}>
                          <TrashIcon className="w-4 h-4 text-rose-400" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal — OUTSIDE the table */}
      {editingId && (
        <EditModal title="Edit Testimonial" onClose={() => setEditingId(null)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Customer Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Rating</label>
                <select value={editRating} onChange={(e) => setEditRating(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Package</label>
                <input value={editPackage} onChange={(e) => setEditPackage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 block mb-1">Date</label>
                <input value={editDate} onChange={(e) => setEditDate(e.target.value)} placeholder="e.g. March 2026"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">Review</label>
              <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300 block mb-1">
                Admin Reply <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <textarea value={editReply} onChange={(e) => setEditReply(e.target.value)} rows={2}
                placeholder="Reply to this review..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
              <Button onClick={() => handleSaveEdit(editingId)} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </EditModal>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Testimonial"
          message="Are you sure you want to delete this testimonial?"
          confirmLabel="Delete"
          onConfirm={confirmDeleteTestimonial}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}