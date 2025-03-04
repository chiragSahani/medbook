import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBookings, cancelBooking } from '../lib/api';
import { toast } from 'react-hot-toast';
import { Calendar, Clock, Video, MessageCircle, Building, X, CreditCard } from 'lucide-react';
import type { Booking } from '../types';
import { Link } from 'react-router-dom';

export function Profile() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const bookingsData = await getUserBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load your bookings');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      // Update the local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ));
      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };

  const getConsultationIcon = (type: string) => {
    switch (type) {
      case 'in-clinic':
        return <Building className="h-5 w-5 text-blue-600" />;
      case 'video':
        return <Video className="h-5 w-5 text-green-600" />;
      case 'chat':
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Please log in</h2>
        <p className="mt-2 text-gray-600">You need to be logged in to view your profile.</p>
        <Link 
          to="/login" 
          className="mt-4 inline-block px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
        >
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-8 text-white">
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="mt-2">{user.email}</p>
          <p className="mt-1">{user.full_name}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button className="border-b-2 border-green-600 py-4 px-6 text-sm font-medium text-green-700">
              My Appointments
            </button>
            <button className="border-b-2 border-transparent py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Profile Settings
            </button>
          </nav>
        </div>

        {/* Appointments List */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Appointments</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No appointments yet</h3>
              <p className="mt-2 text-gray-600">Book a consultation with a doctor to get started</p>
              <Link 
                to="/doctors" 
                className="mt-4 inline-block px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
              >
                Find Doctors
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-4 md:w-1/4 bg-gray-50 flex items-center">
                      <img 
                        src={booking.doctorImage} 
                        alt={booking.doctorName} 
                        className="w-16 h-16 rounded-full object-cover mr-4"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800';
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">Dr. {booking.doctorName}</h3>
                        <p className="text-sm text-gray-600">{booking.doctorSpecialization}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 md:w-2/4 flex flex-col justify-center">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">
                          {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <Clock className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700">{booking.bookingTime}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        {getConsultationIcon(booking.consultationType)}
                        <span className="ml-2 text-gray-700 capitalize">
                          {booking.consultationType.replace('-', ' ')} Consultation
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="text-gray-700 mr-2">Payment:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(booking.paymentStatus)}`}>
                          {booking.paymentStatus ? booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1) : 'Pending'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 md:w-1/4 flex flex-col justify-center items-center md:items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(booking.status)} mb-3`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                      
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="flex items-center text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </button>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <Link
                          to={`/doctors/${booking.doctorId}`}
                          className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 text-sm"
                        >
                          Join Consultation
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}