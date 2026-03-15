import React, { useState } from 'react';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { EQUIPMENT } from '../../data';

export function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filteredEquipment = EQUIPMENT.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'slide': return <Badge variant="info">Slide</Badge>;
      case 'bouncy': return <Badge variant="success">Bouncy</Badge>;
      case 'machine': return <Badge variant="warning">Machine</Badge>;
      case 'pool': return <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">Pool</Badge>;
      default: return <Badge variant="default" className="capitalize">{category}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">Equipment Inventory</h2>
          <p className="text-sm text-slate-400 mt-1">
            {filteredEquipment.length} of {EQUIPMENT.length} items shown
          </p>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="All">All Categories</option>
                <option value="slide">Slides</option>
                <option value="bouncy">Bouncies</option>
                <option value="machine">Machines</option>
                <option value="pool">Pool</option>
                <option value="other">Other</option>
              </select>
              <Button
                variant="outline"
                className="px-3"
                title="Clear filters"
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
              >
                <FilterIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Photo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size/Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                    No equipment found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEquipment.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className={`w-12 h-12 rounded bg-gradient-to-br ${item.imagePlaceholder} opacity-80`} />
                    </TableCell>
                    <TableCell className="font-medium text-slate-200">{item.name}</TableCell>
                    <TableCell>{getCategoryBadge(item.category)}</TableCell>
                    <TableCell>
                      <span className="text-xs text-slate-400">
                        {item.isLarge ? 'Large' : 'Standard'}
                        {item.dimensions && ` • ${item.dimensions}`}
                      </span>
                    </TableCell>
                    <TableCell><Badge variant="success">Active</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}