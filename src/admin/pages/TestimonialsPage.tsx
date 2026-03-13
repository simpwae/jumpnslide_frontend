import React, { useState } from 'react';
import {
  PlusIcon,
  StarIcon,
  EditIcon,
  TrashIcon,
  MessageSquareIcon } from
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
import { TESTIMONIALS } from '../../data';
import { useLanguage } from '../context/LanguageContext';
export function TestimonialsPage() {
  const { t, isRTL } = useLanguage();
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  // Add Form State
  const [newName, setNewName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState('');
  const [newPackage, setNewPackage] = useState('');
  const [newDate, setNewDate] = useState('');
  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState('');
  const [editPackage, setEditPackage] = useState('');
  const [editDate, setEditDate] = useState('');
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;
    const newTestimonial = {
      id: `new-${Date.now()}`,
      name: newName,
      rating: newRating,
      text: newText,
      packageName: newPackage,
      date: newDate,
      isFeatured: false
    };
    setTestimonials([newTestimonial, ...testimonials]);
    setNewName('');
    setNewRating(5);
    setNewText('');
    setNewPackage('');
    setNewDate('');
    setShowAddForm(false);
  };
  const startEdit = (testimonial: any) => {
    setEditingId(testimonial.id);
    setEditName(testimonial.name);
    setEditRating(testimonial.rating);
    setEditText(testimonial.text);
    setEditPackage(testimonial.packageName);
    setEditDate(testimonial.date);
  };
  const handleSaveEdit = (id: string) => {
    setTestimonials((prev) =>
    prev.map((t) =>
    t.id === id ?
    {
      ...t,
      name: editName,
      rating: editRating,
      text: editText,
      packageName: editPackage,
      date: editDate
    } :
    t
    )
    );
    setEditingId(null);
  };
  const toggleFeatured = (id: string) => {
    setTestimonials((prev) =>
    prev.map((item) =>
    item.id === id ?
    {
      ...item,
      isFeatured: !item.isFeatured
    } :
    item
    )
    );
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            {t('testimonials.title')}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {t('testimonials.desc')}
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <PlusIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('testimonials.add')}
        </Button>
      </div>

      {showAddForm &&
      <Card className="border-brand-blue/50 shadow-lg shadow-brand-blue/10">
          <CardContent className="p-6">
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Customer Name
                  </label>
                  <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Rating (1-5)
                  </label>
                  <input
                  type="number"
                  min="1"
                  max="5"
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Package
                  </label>
                  <input
                  type="text"
                  value={newPackage}
                  onChange={(e) => setNewPackage(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Date
                  </label>
                  <input
                  type="text"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">
                    Review
                  </label>
                  <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none" />
                
                </div>
              </div>
              <div
              className={`flex justify-end space-x-3 ${isRTL ? 'space-x-reverse' : ''} pt-2`}>
              
                <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddForm(false)}>
                
                  {t('common.cancel')}
                </Button>
                <Button type="submit">{t('common.save')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      }

      <Card>
        <CardContent className="p-0">
          {testimonials.length === 0 ?
          <div className="p-8 text-center text-slate-400">
              {t('testimonials.empty')}
            </div> :

          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('testimonials.customer')}</TableHead>
                  <TableHead>{t('testimonials.rating')}</TableHead>
                  <TableHead>{t('testimonials.review')}</TableHead>
                  <TableHead>{t('testimonials.package')}</TableHead>
                  <TableHead>{t('testimonials.date')}</TableHead>
                  <TableHead>{t('common.featured')}</TableHead>
                  <TableHead className={isRTL ? 'text-left' : 'text-right'}>
                    {t('common.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) =>
              editingId === testimonial.id ?
              <TableRow key={testimonial.id}>
                      <TableCell>
                        <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                  
                      </TableCell>
                      <TableCell>
                        <input
                    type="number"
                    min="1"
                    max="5"
                    value={editRating}
                    onChange={(e) =>
                    setEditRating(Number(e.target.value))
                    }
                    className="w-16 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                  
                      </TableCell>
                      <TableCell>
                        <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                  
                      </TableCell>
                      <TableCell>
                        <input
                    type="text"
                    value={editPackage}
                    onChange={(e) => setEditPackage(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                  
                      </TableCell>
                      <TableCell>
                        <input
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-blue" />
                  
                      </TableCell>
                      <TableCell>
                        <Badge
                    variant={
                    testimonial.isFeatured ? 'success' : 'default'
                    }>
                    
                          {testimonial.isFeatured ?
                    t('common.featured') :
                    t('common.notFeatured')}
                        </Badge>
                      </TableCell>
                      <TableCell className={isRTL ? 'text-left' : 'text-right'}>
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
                      onClick={() => handleSaveEdit(testimonial.id)}>
                      
                            {t('common.save')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow> :

              <TableRow key={testimonial.id}>
                      <TableCell className="font-medium text-slate-200">
                        {testimonial.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) =>
                    <StarIcon
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />

                    )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p
                      className="text-slate-300 truncate"
                      title={testimonial.text}>
                      
                            {testimonial.text}
                          </p>
                          {testimonial.adminReply &&
                    <div className="flex items-center mt-1 text-xs text-brand-blue">
                              <MessageSquareIcon
                        className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                      
                              {t('testimonials.adminReply')}
                            </div>
                    }
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {testimonial.packageName}
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {testimonial.date}
                      </TableCell>
                      <TableCell>
                        <button onClick={() => toggleFeatured(testimonial.id)}>
                          <Badge
                      variant={
                      testimonial.isFeatured ? 'success' : 'default'
                      }
                      className="cursor-pointer hover:opacity-80">
                      
                            {testimonial.isFeatured ?
                      t('common.featured') :
                      t('common.notFeatured')}
                          </Badge>
                        </button>
                      </TableCell>
                      <TableCell className={isRTL ? 'text-left' : 'text-right'}>
                        <div
                    className={`flex items-center justify-end space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                    
                          <Button
                      variant="ghost"
                      size="sm"
                      className="px-2"
                      onClick={() => startEdit(testimonial)}>
                      
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button
                      variant="ghost"
                      size="sm"
                      className="px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                      onClick={() => handleDelete(testimonial.id)}>
                      
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>

              )}
              </TableBody>
            </Table>
          }
        </CardContent>
      </Card>
    </div>);

}