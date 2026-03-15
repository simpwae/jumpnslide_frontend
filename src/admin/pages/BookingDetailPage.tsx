import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon, MessageCircleIcon, CheckCircleIcon,
  XCircleIcon, FileTextIcon, UserIcon, CalendarIcon,
  PackageIcon, LandmarkIcon, TrashIcon, Loader2Icon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { supabase } from '../../lib/supabase';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_wdhb3u5';
const EMAILJS_CONFIRMED_TEMPLATE = 'template_ydqjnp5';
const EMAILJS_PUBLIC_KEY = 'hF4zI9NwINt2gOzUa';

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const isMounted = useRef(true);

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (id) fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_ref', id)
      .single();

    if (error) {
      console.error('Error fetching booking:', error);
    } else {
      setBooking(data);
      setNotes(data.admin_notes || '');
    }
    setLoading(false);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Confirmed' })
        .eq('booking_ref', id);

      if (error) throw error;

      // Send confirmation email
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_CONFIRMED_TEMPLATE,
          {
            customer_email: booking.customer_email,
            customer_name: booking.customer_name,
            booking_ref: booking.booking_ref,
            package_name: booking.package_name,
            event_date: booking.event_date,
            event_time: booking.event_time,
            emirate: booking.emirate,
            address: booking.address,
            total_amount: booking.total_amount,
            advance_amount: booking.advance_amount,
            remaining_balance: booking.total_amount - booking.advance_amount,
          },
          EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.error('Email failed:', emailError);
      }

      setBooking({ ...booking, status: 'Confirmed' });
      setActionMessage('Booking confirmed! Customer has been notified.');

    } catch (error) {
      console.error('Error confirming:', error);
      setActionMessage('Failed to confirm. Please try again.');
    } finally {
      if (isMounted.current) setIsConfirming(false);
    }
  };

  const handleReject = async () => {
    setShowRejectModal(false);
    setIsRejecting(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Cancelled' })
        .eq('booking_ref', id);

      if (error) throw error;
      setBooking({ ...booking, status: 'Cancelled' });
      setActionMessage('Payment rejected. Please contact customer via WhatsApp.');

    } catch (error) {
      console.error('Error rejecting:', error);
    } finally {
      if (isMounted.current) setIsRejecting(false);
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('booking_ref', id);

      if (error) throw error;
      window.location.href = '/admin/bookings';

    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ admin_notes: notes })
        .eq('booking_ref', id);

      if (error) throw error;
      if (isMounted.current) {
        setNoteSaved(true);
        setTimeout(() => {
          if (isMounted.current) setNoteSaved(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      if (isMounted.current) setIsSavingNotes(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed': return <Badge variant="success">{status}</Badge>;
      case 'Pending': return <Badge variant="warning">{status}</Badge>;
      case 'Pending Payment': return <Badge variant="warning">{status}</Badge>;
      case 'Payment Uploaded': return <Badge variant="info">{status}</Badge>;
      case 'Cancelled': return <Badge variant="danger">{status}</Badge>;
      case 'Completed': return <Badge variant="default" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Booking not found.</p>
        <Link to="/admin/bookings">
          <Button variant="outline">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const remainingBalance = booking.total_amount - booking.advance_amount;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">

      {/* Header */}
      <div className="flex items-center space-x-4 mb-2">
        <Link
          to="/admin/bookings"
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-heading font-bold text-slate-100">{booking.booking_ref}</h2>
            {getStatusBadge(booking.status)}
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Created on {new Date(booking.created_at).toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}
          </p>
        </div>
      </div>

      {/* Action Message */}
      {actionMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium">
          {actionMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Customer Info */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2 pb-4">
              <UserIcon className="w-5 h-5 text-brand-blue" />
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Full Name</p>
                  <p className="font-medium text-slate-200">{booking.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Phone Number</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-slate-200">{booking.customer_phone}</p>
                    <a
                      href={`https://wa.me/${booking.customer_phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-500 hover:text-green-400"
                    >
                      <MessageCircleIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Email Address</p>
                  <p className="font-medium text-slate-200">{booking.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Emirate & Area</p>
                  <p className="font-medium text-slate-200">{booking.emirate} - {booking.area}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-slate-400 mb-1">Full Address</p>
                  <p className="font-medium text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {booking.address}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2 pb-4">
              <CalendarIcon className="w-5 h-5 text-brand-pink" />
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Event Date</p>
                  <p className="font-medium text-slate-200">{booking.event_date}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Event Time</p>
                  <p className="font-medium text-slate-200">{booking.event_time}</p>
                </div>
              </div>
              {booking.special_requests && (
                <div>
                  <p className="text-sm text-slate-400 mb-1">Special Requests</p>
                  <p className="font-medium text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {booking.special_requests}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Package */}
          <Card>
            <CardHeader className="flex flex-row items-center space-x-2 pb-4">
              <PackageIcon className="w-5 h-5 text-purple-400" />
              <CardTitle>Package</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold text-lg text-brand-blue">{booking.package_name}</p>
            </CardContent>
          </Card>

        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Actions */}
          <Card className="border-brand-blue/30">
            <CardHeader className="pb-4">
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">

              {booking.status === 'Payment Uploaded' && (
                <>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={handleConfirm}
                    disabled={isConfirming}
                  >
                    {isConfirming ? (
                      <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                    )}
                    {isConfirming ? 'Confirming...' : 'Confirm Booking'}
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full"
                    onClick={() => setShowRejectModal(true)}
                    disabled={isRejecting}
                  >
                    <XCircleIcon className="w-4 h-4 mr-2" />
                    Reject Payment
                  </Button>
                </>
              )}

              {booking.status === 'Confirmed' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-emerald-400 text-sm font-medium">Booking Confirmed</p>
                </div>
              )}

              {booking.status === 'Cancelled' && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-center">
                  <XCircleIcon className="w-5 h-5 text-rose-400 mx-auto mb-1" />
                  <p className="text-rose-400 text-sm font-medium">Payment Rejected</p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.open(`https://wa.me/${booking.customer_phone.replace(/\D/g, '')}`, '_blank')}
              >
                <MessageCircleIcon className="w-4 h-4 mr-2" />
                WhatsApp Customer
              </Button>

              <Button
                variant="ghost"
                className="w-full text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                onClick={() => setShowDeleteModal(true)}
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete Booking
              </Button>

            </CardContent>
          </Card>

          {/* Transfer Details */}
          {booking.bank_name && (
            <Card className="border-amber-500/30">
              <CardHeader className="pb-4 flex flex-row items-center space-x-2">
                <LandmarkIcon className="w-5 h-5 text-amber-500" />
                <CardTitle>Transfer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Bank</span>
                    <span className="font-medium text-slate-100">{booking.bank_name}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Account Name</span>
                    <span className="font-medium text-slate-100">{booking.account_holder}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Amount</span>
                    <span className="font-medium text-emerald-400">{booking.transfer_amount}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Submitted At</span>
                    <span className="font-medium text-slate-100">
                      {booking.transfer_date
                        ? new Date(booking.transfer_date).toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })
                        : 'N/A'}
                    </span>
                  </div>
                  {booking.transfer_ref && (
                    <div className="flex justify-between text-slate-300">
                      <span>Reference</span>
                      <span className="font-medium text-slate-100">{booking.transfer_ref}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Financial Summary */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Package + Delivery</span>
                  <span>AED {booking.total_amount}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded">
                  <span>Advance Paid (50%)</span>
                  <span>AED {booking.advance_amount}</span>
                </div>
                <div className="flex justify-between text-amber-400 font-medium bg-amber-500/10 p-2 rounded">
                  <span>Remaining Balance</span>
                  <span>AED {remainingBalance}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                placeholder="Internal notes (not visible to customer)..."
              />
              <Button
                size="sm"
                variant="secondary"
                className="w-full mt-3"
                onClick={handleSaveNotes}
                disabled={isSavingNotes}
              >
                {isSavingNotes ? 'Saving...' : 'Save Notes'}
              </Button>
              {noteSaved && (
                <p className="text-emerald-400 text-sm text-center mt-2 font-medium">
                  Notes saved ✓
                </p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Modals */}
      {showRejectModal && (
        <ConfirmModal
          title="Reject Payment"
          message="Are you sure you want to reject this payment? The booking status will be set to Cancelled."
          confirmLabel="Reject"
          variant="danger"
          onConfirm={handleReject}
          onCancel={() => setShowRejectModal(false)}
        />
      )}

      {showDeleteModal && (
        <ConfirmModal
          title="Delete Booking"
          message="Are you sure you want to permanently delete this booking? This cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

    </div>
  );
}