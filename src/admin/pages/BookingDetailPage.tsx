import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MessageCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  FileTextIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon,
  PackageIcon,
  LandmarkIcon } from
'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow } from
'../components/ui/Table';
export function BookingDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();
  const [notes, setNotes] = useState(
    'Customer requested early setup if possible. Need to check schedule.'
  );
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    setTimeout(() => {
      setIsSavingNotes(false);
      alert('Notes saved successfully');
    }, 500);
  };
  // Mock data for the detail view
  const booking = {
    id: id || '#JNS-20260310-001',
    status: 'Payment Uploaded',
    createdAt: '2026-03-05 14:30',
    customer: {
      name: 'Sarah Ahmed',
      phone: '+971 50 123 4567',
      email: 'sarah.ahmed@example.com',
      emirate: 'Dubai',
      area: 'Jumeirah 3',
      address: 'Villa 45, Street 12B, Near Jumeirah Beach Road'
    },
    event: {
      date: '2026-03-15',
      time: '4:00 PM to 9:00 PM',
      requests:
      'Please set up the bouncy castle in the backyard near the pool. Access is through the side gate.'
    },
    package: {
      name: 'Ultimate Party',
      basePrice: 2499,
      inflatable: 'Spider-Man Slide (Large)',
      pool: 'Included',
      machines: [
      'Cotton Candy (30 servings)',
      'Popcorn (30 servings)',
      'Ice Cream (30 servings)']

    },
    extras: [
    {
      name: 'Extra Kids Chairs',
      qty: 10,
      price: 100
    },
    {
      name: 'Extra Kids Tables',
      qty: 2,
      price: 60
    },
    {
      name: 'Extra Popcorn Servings',
      qty: 20,
      price: 100
    }],

    financials: {
      baseTotal: 2499,
      extrasTotal: 260,
      deliveryFee: 150,
      grandTotal: 2909,
      advancePaid: 1455,
      remainingBalance: 1454
    },
    transferDetails: {
      bank: 'Emirates NBD',
      accountName: 'Sarah Ahmed',
      amount: '1455',
      date: '2026-03-05 15:00',
      transactionRef: 'TRN987654321',
      hasProof: true
    }
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
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      <div className="flex items-center space-x-4 mb-2">
        <Link
          to="/admin/bookings"
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors">
          
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-heading font-bold text-slate-100">
              {booking.id}
            </h2>
            {getStatusBadge(booking.status)}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Created on {booking.createdAt}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2 pb-4">
              <UserIcon className="w-5 h-5 text-brand-blue" />
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Full Name</p>
                  <p className="font-medium text-slate-200">
                    {booking.customer.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Phone Number</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-slate-200">
                      {booking.customer.phone}
                    </p>
                    <a
                      href={`https://wa.me/${booking.customer.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400">
                      
                      <MessageCircleIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Email Address</p>
                  <p className="font-medium text-slate-200">
                    {booking.customer.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Emirate & Area</p>
                  <p className="font-medium text-slate-200">
                    {booking.customer.emirate} - {booking.customer.area}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-400 mb-1">Full Address</p>
                  <p className="font-medium text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {booking.customer.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-2 pb-4">
              <CalendarIcon className="w-5 h-5 text-brand-pink" />
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Event Date</p>
                  <p className="font-medium text-slate-200">
                    {booking.event.date}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Event Time</p>
                  <p className="font-medium text-slate-200">
                    {booking.event.time}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Special Requests</p>
                <p className="font-medium text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {booking.event.requests}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-x-2 pb-4">
              <PackageIcon className="w-5 h-5 text-purple-400" />
              <CardTitle>Package & Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-1">Selected Package</p>
                <p className="font-bold text-lg text-brand-blue">
                  {booking.package.name}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-300">Inflatable Selection</span>
                  <span className="font-medium text-slate-100">
                    {booking.package.inflatable}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-300">Inflatable Pool</span>
                  <span className="font-medium text-slate-100">
                    {booking.package.pool}
                  </span>
                </div>
                <div className="py-2 border-b border-slate-800">
                  <span className="text-slate-300 block mb-2">
                    Snack Machines
                  </span>
                  <ul className="list-disc list-inside text-slate-100 font-medium space-y-1">
                    {booking.package.machines.map((m, i) =>
                    <li key={i}>{m}</li>
                    )}
                  </ul>
                </div>
              </div>

              {booking.extras.length > 0 &&
              <div className="mt-6">
                  <h4 className="font-medium text-slate-200 mb-3">
                    Extras & Add-ons
                  </h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {booking.extras.map((extra, i) =>
                    <TableRow key={i}>
                          <TableCell className="text-slate-300">
                            {extra.name}
                          </TableCell>
                          <TableCell>{extra.qty}</TableCell>
                          <TableCell className="text-right">
                            AED {extra.price}
                          </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                  </Table>
                </div>
              }
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions & Financials */}
        <div className="space-y-6">
          <Card className="border-brand-blue/30 shadow-lg shadow-brand-blue/5">
            <CardHeader className="bg-slate-900/50 pb-4">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {booking.status === 'Payment Uploaded' &&
              <>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                    <CheckCircleIcon className="w-4 h-4 mr-2" /> Confirm Booking
                  </Button>
                  <Button variant="danger" className="w-full">
                    <XCircleIcon className="w-4 h-4 mr-2" /> Reject Payment
                  </Button>
                </>
              }
              <Button variant="outline" className="w-full">
                <MessageCircleIcon className="w-4 h-4 mr-2" /> WhatsApp Customer
              </Button>
              <Button
                variant="ghost"
                className="w-full text-slate-400 hover:text-slate-200">
                
                Edit Booking Details
              </Button>
            </CardContent>
          </Card>

          {booking.transferDetails &&
          <Card className="border-amber-500/30">
              <CardHeader className="pb-4 flex flex-row items-center space-x-2">
                <LandmarkIcon className="w-5 h-5 text-amber-500" />
                <CardTitle>Transfer Confirmation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between text-slate-300">
                    <span>Bank</span>
                    <span className="font-medium text-slate-100">
                      {booking.transferDetails.bank}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Account Name</span>
                    <span className="font-medium text-slate-100">
                      {booking.transferDetails.accountName}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Amount</span>
                    <span className="font-medium text-emerald-400">
                      AED {booking.transferDetails.amount}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Date</span>
                    <span className="font-medium text-slate-100">
                      {booking.transferDetails.date}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Ref</span>
                    <span className="font-medium text-slate-100">
                      {booking.transferDetails.transactionRef}
                    </span>
                  </div>
                </div>

                {booking.transferDetails.hasProof &&
              <div className="aspect-video bg-slate-950 border border-slate-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-brand-blue transition-colors group">
                    <FileTextIcon className="w-8 h-8 text-slate-500 group-hover:text-brand-blue mb-2" />
                    <span className="text-sm text-slate-400 group-hover:text-slate-300">
                      View Receipt Image
                    </span>
                  </div>
              }
              </CardContent>
            </Card>
          }

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Package Base</span>
                  <span>AED {booking.financials.baseTotal}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Extras Total</span>
                  <span>AED {booking.financials.extrasTotal}</span>
                </div>
                <div className="flex justify-between text-slate-300 pb-3 border-b border-slate-800">
                  <span>Delivery Fee</span>
                  <span>AED {booking.financials.deliveryFee}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-100 text-base pt-1">
                  <span>Grand Total</span>
                  <span>AED {booking.financials.grandTotal}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded">
                    <span>Advance Paid (50%)</span>
                    <span>AED {booking.financials.advancePaid}</span>
                  </div>
                  <div className="flex justify-between text-amber-400 font-medium bg-amber-500/10 p-2 rounded">
                    <span>Remaining Balance</span>
                    <span>AED {booking.financials.remainingBalance}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                placeholder="Add internal notes here... (Not visible to customer)" />
              
              <Button
                size="sm"
                variant="secondary"
                className="w-full mt-3"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}>
                
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);

}