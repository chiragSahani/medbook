import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Calendar, Clock } from 'lucide-react';
import { createBooking } from '../lib/api';
import type { Doctor, ConsultationType, TimeSlot } from '../types';
import clsx from 'clsx';
import { PaymentModal } from './PaymentModal';
import { useAuth } from '../context/AuthContext';

interface BookingFormProps {
  doctor: Doctor;
}

interface BookingFormData {
  consultationType: ConsultationType;
  bookingDate: string;
  bookingTime: string;
}

// Mock available time slots
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour <= endHour; hour++) {
    // Skip lunch hour
    if (hour !== 13) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: Math.random() > 0.3 // 70% chance of being available
      });
      
      // Add 30-minute slots
      if (hour < endHour) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:30`,
          available: Math.random() > 0.3
        });
      }
    }
  }
  
  return slots;
};

export function BookingForm({ doctor }: BookingFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<ConsultationType>('in-clinic');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormData>();
  
  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayOfMonth: date.getDate()
    };
  });
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setValue('bookingDate', date);
    // Generate new time slots when date changes
    setTimeSlots(generateTimeSlots());
  };
  
  const handleTypeSelect = (type: ConsultationType) => {
    setSelectedType(type);
    setValue('consultationType', type);
  };
  
  const onSubmit = async (data: BookingFormData) => {
    if (!user) {
      toast.error('Please log in to book an appointment');
      navigate('/login', { state: { from: `/doctors/${doctor.id}` } });
      return;
    }
    
    setIsLoading(true);
    try {
      const booking = await createBooking({
        doctorId: doctor.id,
        bookingDate: data.bookingDate,
        bookingTime: data.bookingTime,
        consultationType: data.consultationType
      });
      
      setBookingId(booking.id);
      setShowPaymentModal(true);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePaymentSuccess = () => {
    toast.success('Appointment booked successfully!');
    navigate('/profile');
  };
  
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Consultation Type</h3>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => handleTypeSelect('in-clinic')}
              className={clsx(
                'p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors',
                selectedType === 'in-clinic' 
                  ? 'border-green-600 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-green-600'
              )}
            >
              <span className="font-medium">In-Clinic</span>
              <span className="mt-2 font-semibold">₹{doctor.fees.inClinic}</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleTypeSelect('video')}
              className={clsx(
                'p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors',
                selectedType === 'video' 
                  ? 'border-green-600 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-green-600'
              )}
            >
              <span className="font-medium">Video</span>
              <span className="mt-2 font-semibold">₹{doctor.fees.video}</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleTypeSelect('chat')}
              className={clsx(
                'p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-colors',
                selectedType === 'chat' 
                  ? 'border-green-600 bg-green-50 text-green-700' 
                  : 'border-gray-200 hover:border-green-600'
              )}
            >
              <span className="font-medium">Chat</span>
              <span className="mt-2 font-semibold">₹{doctor.fees.chat}</span>
            </button>
          </div>
          <input
            type="hidden"
            {...register('consultationType', { required: 'Please select a consultation type' })}
            value={selectedType}
          />
          {errors.consultationType && (
            <p className="mt-1 text-sm text-red-600">{errors.consultationType.message}</p>
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {dates.map((date) => (
              <button
                key={date.date}
                type="button"
                onClick={() => handleDateSelect(date.date)}
                className={clsx(
                  'p-3 border-2 rounded-lg flex flex-col items-center min-w-[80px] transition-colors',
                  selectedDate === date.date 
                    ? 'border-green-600 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-green-600'
                )}
              >
                <span className="text-sm">{date.day}</span>
                <span className="text-lg font-semibold">{date.dayOfMonth}</span>
              </button>
            ))}
          </div>
          <input
            type="hidden"
            {...register('bookingDate', { required: 'Please select a date' })}
            value={selectedDate}
          />
          {errors.bookingDate && (
            <p className="mt-1 text-sm text-red-600">{errors.bookingDate.message}</p>
          )}
        </div>
        
        {selectedDate && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {timeSlots.map((slot) => (
                <label
                  key={slot.time}
                  className={clsx(
                    'p-2 border-2 rounded-lg flex items-center justify-center cursor-pointer transition-colors',
                    !slot.available && 'opacity-50 cursor-not-allowed',
                    slot.available && 'hover:border-green-600'
                  )}
                >
                  <input
                    type="radio"
                    value={slot.time}
                    disabled={!slot.available}
                    {...register('bookingTime', { required: 'Please select a time slot' })}
                    className="sr-only"
                  />
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{slot.time}</span>
                </label>
              ))}
            </div>
            {errors.bookingTime && (
              <p className="mt-1 text-sm text-red-600">{errors.bookingTime.message}</p>
            )}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !selectedDate}
          className="w-full px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </form>
      
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          doctor={doctor}
          consultationType={selectedType}
          bookingId={bookingId}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}