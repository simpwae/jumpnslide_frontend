import React, { useState } from 'react';
import { PlusIcon, TrashIcon, StarIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
const initialEvents = [
{
  id: 1,
  title: "Ahmed's 5th Birthday",
  date: '2026-02-15',
  photos: 12,
  featured: true,
  color: 'from-blue-500 to-purple-600'
},
{
  id: 2,
  title: 'School Spring Festival',
  date: '2026-02-28',
  photos: 45,
  featured: true,
  color: 'from-pink-500 to-orange-400'
},
{
  id: 3,
  title: "Zayed's Superhero Party",
  date: '2026-03-02',
  photos: 8,
  featured: false,
  color: 'from-emerald-500 to-cyan-500'
},
{
  id: 4,
  title: 'Corporate Family Day',
  date: '2026-03-05',
  photos: 24,
  featured: true,
  color: 'from-amber-500 to-red-500'
}];

const GRADIENTS = [
'from-blue-500 to-purple-600',
'from-pink-500 to-orange-400',
'from-emerald-500 to-cyan-500',
'from-amber-500 to-red-500',
'from-indigo-500 to-pink-500',
'from-teal-400 to-blue-500'];

export function GalleryPage() {
  const [events, setEvents] = useState(initialEvents);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;
    const newEvent = {
      id: Date.now(),
      title: newTitle,
      date: newDate,
      photos: 0,
      featured: false,
      color: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)]
    };
    setEvents([newEvent, ...events]);
    setNewTitle('');
    setNewDate('');
    setShowAddForm(false);
  };
  const toggleFeatured = (id: number) => {
    setEvents((prev) =>
    prev.map((evt) =>
    evt.id === id ?
    {
      ...evt,
      featured: !evt.featured
    } :
    evt
    )
    );
  };
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            Gallery Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Organize past event photos for the public website.
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Event Album
        </Button>
      </div>

      {showAddForm &&
      <Card className="border-brand-blue/50 shadow-lg shadow-brand-blue/10 max-w-2xl">
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Event Title
                  </label>
                  <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required />
                
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">
                    Event Date
                  </label>
                  <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                  required />
                
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddForm(false)}>
                
                  Cancel
                </Button>
                <Button type="submit">Create Album</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      }

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) =>
        <Card key={event.id} className="group overflow-hidden">
            <div className={`h-48 bg-gradient-to-br ${event.color} relative`}>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <button
              onClick={() => toggleFeatured(event.id)}
              className={`absolute top-3 right-3 bg-slate-900/80 backdrop-blur p-1.5 rounded-full transition-colors hover:bg-slate-900 ${event.featured ? 'text-amber-400' : 'text-slate-400 hover:text-amber-400/50'}`}>
              
                <StarIcon
                className={`w-4 h-4 ${event.featured ? 'fill-current' : ''}`} />
              
              </button>
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur px-2.5 py-1 rounded-md text-xs font-medium text-white">
                {event.photos} Photos
              </div>
            </div>
            <CardContent className="p-4">
              <h3
              className="font-heading font-bold text-slate-100 mb-1 truncate"
              title={event.title}>
              
                {event.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{event.date}</p>

              <div className="flex justify-between items-center">
                <Button
                variant="outline"
                size="sm"
                className="flex-1 mr-2"
                onClick={() => alert('Gallery management coming soon')}>
                
                  Manage
                </Button>
                <Button
                variant="ghost"
                size="sm"
                className="px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                onClick={() => handleDelete(event.id)}>
                
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>);

}