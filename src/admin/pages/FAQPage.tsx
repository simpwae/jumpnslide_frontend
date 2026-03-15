import React, { useState, useEffect } from 'react';
import {
  PlusIcon, EditIcon, TrashIcon,
  ChevronDownIcon, ChevronUpIcon, Loader2Icon
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { supabase } from '../../lib/supabase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at: string;
}

export function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: true });
    if (!error && data) setFaqs(data);
    setLoading(false);
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('faqs')
      .insert({ question: newQuestion, answer: newAnswer })
      .select()
      .single();

    if (!error && data) {
      setFaqs(prev => [...prev, data]);
      setNewQuestion('');
      setNewAnswer('');
      setShowAddForm(false);
    }
    setSaving(false);
  };

  const startEdit = (faq: FAQ, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setExpanded(prev => ({ ...prev, [faq.id]: true }));
  };

  const handleSaveEdit = async (id: string) => {
    if (!editQuestion.trim() || !editAnswer.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from('faqs')
      .update({ question: editQuestion, answer: editAnswer })
      .eq('id', id);

    if (!error) {
      setFaqs(prev => prev.map(f =>
        f.id === id ? { ...f, question: editQuestion, answer: editAnswer } : f
      ));
      setEditingId(null);
    }
    setSaving(false);
  };

  const handleDelete = (id: string) => setConfirmDelete(id);

  const confirmDeleteFaq = async () => {
    if (!confirmDelete) return;
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', confirmDelete);

    if (!error) {
      setFaqs(prev => prev.filter(f => f.id !== confirmDelete));
    }
    setConfirmDelete(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">FAQ Management</h2>
          <p className="text-sm text-slate-400 mt-1">Manage frequently asked questions.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      {showAddForm && (
        <Card className="border-brand-blue/50">
          <CardContent className="p-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Question</label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Answer</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save FAQ'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {faqs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-slate-400">
            No FAQs found. Add your first FAQ above.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <Card key={faq.id} className="overflow-hidden hover:border-slate-700 transition-all">
              {editingId === faq.id ? (
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Question</label>
                    <input
                      type="text"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Answer</label>
                    <textarea
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                    <Button onClick={() => handleSaveEdit(faq.id)} disabled={saving}>
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-1">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none"
                    onClick={() => toggleExpand(faq.id)}
                  >
                    <h3 className="font-medium text-slate-200 pr-4">{faq.question}</h3>
                    <div className="flex items-center space-x-2">
                      <div
                        className="flex items-center space-x-1 mr-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => startEdit(faq, e)}>
                          <EditIcon className="w-4 h-4 text-slate-400" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDelete(faq.id)}>
                          <TrashIcon className="w-4 h-4 text-rose-400" />
                        </Button>
                      </div>
                      {expanded[faq.id]
                        ? <ChevronUpIcon className="w-5 h-5 text-slate-500" />
                        : <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                      }
                    </div>
                  </div>
                  {expanded[faq.id] && (
                    <div className="px-4 pb-5 pt-1 text-slate-400 border-t border-slate-800/50">
                      <p className="leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete FAQ"
          message="Are you sure you want to delete this FAQ?"
          confirmLabel="Delete"
          onConfirm={confirmDeleteFaq}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}