import React, { useState } from 'react';
import { PlusIcon, EditIcon, CopyIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PACKAGES } from '../../data';
export function PackagesPage() {
  const [packages, setPackages] = useState(PACKAGES);
  const handleDelete = (slug: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      setPackages((prev) => prev.filter((p) => p.slug !== slug));
    }
  };
  const handleDuplicate = (pkg: any) => {
    const newPkg = {
      ...pkg,
      slug: `${pkg.slug}-copy-${Date.now()}`,
      name: `${pkg.name} (Copy)`
    };
    setPackages([newPkg, ...packages]);
  };
  const handleEdit = () => {
    alert('Package editing coming soon');
  };
  const handleCreate = () => {
    alert('Package creation coming soon');
  };
  const handlePreview = (slug: string) => {
    window.open(`/packages/${slug}`, '_blank');
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            Packages
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage your party packages and deals.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Package
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) =>
        <Card key={pkg.slug} className="flex flex-col">
            <div className="h-32 bg-slate-800 relative">
              {/* Mock Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <span className="text-slate-600 font-medium">
                  {pkg.name} Cover
                </span>
              </div>
              {pkg.tag &&
            <div className="absolute top-3 left-3">
                  <Badge
                variant={pkg.tag.type === 'popular' ? 'success' : 'info'}>
                
                    {pkg.tag.label}
                  </Badge>
                </div>
            }
            </div>
            <CardContent className="flex-1 flex flex-col p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-heading font-bold text-lg text-slate-100">
                  {pkg.name}
                </h3>
                <span className="font-bold text-brand-blue">
                  AED {pkg.price}
                </span>
              </div>
              <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                {pkg.description}
              </p>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-4 border-b border-slate-800">
                <span>{pkg.bookingCount} Bookings</span>
                <span>
                  ★ {pkg.rating} ({pkg.reviewCount})
                </span>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex space-x-2">
                  <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  title="Edit"
                  onClick={handleEdit}>
                  
                    <EditIcon className="w-4 h-4" />
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  title="Duplicate"
                  onClick={() => handleDuplicate(pkg)}>
                  
                    <CopyIcon className="w-4 h-4" />
                  </Button>
                  <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 text-rose-400 hover:text-rose-300"
                  title="Delete"
                  onClick={() => handleDelete(pkg.slug)}>
                  
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                variant="outline"
                size="sm"
                onClick={() => handlePreview(pkg.slug)}>
                
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>);

}