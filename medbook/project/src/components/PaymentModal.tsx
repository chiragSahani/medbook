import React, { useEffect, useState } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPaymentOrder, updatePaymentStatus, verifyPayment } from '../lib/api';
import { toast } from 'react-hot-toast';
import type { Doctor, ConsultationType } from '../types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  consultationType: ConsultationType;
  bookingId: string;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ 
  isOpen, 
  onClose, 
  doctor, 
  consultationType, 
  bookingId,
  onPaymentSuccess 
}: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Get the fee based on consultation type
  const getFee = () => {
    switch (consultationType) {
      case 'in-clinic':
        return doctor.fees.inClinic;
      case 'video':
        return doctor.fees.video;
      case 'chat':
        return doctor.fees.chat;
      default:
        return 0;
    }
  };

  const fee = getFee();
  const tax = Math.round(fee * 0.18); // 18% GST
  const total = fee + tax;

  useEffect(() => {
    // Load Razorpay script
    if (!scriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    }
  }, [scriptLoaded]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create a payment order
      const order = await createPaymentOrder({
        bookingId,
        amount: total * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${bookingId}`,
        notes: {
          doctorName: doctor.name,
          consultationType,
          bookingId
        }
      });
      
      if (!window.Razorpay) {
        toast.error('Payment gateway not loaded. Please try again.');
        setLoading(false);
        return;
      }
      
      // Initialize Razorpay
      const options = {
        key: 'rzp_test_YourTestKey', // Replace with your Razorpay key
        amount: total * 100, // Amount in paise
        currency: 'INR',
        name: 'MedBook',
        description: `Consultation with Dr. ${doctor.name}`,
        order_id: order.id,
        handler: async function(response: any) {
          try {
            // Verify payment
            const isVerified = await verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );
            
            if (isVerified) {
              // Update payment status in database
              await updatePaymentStatus(bookingId, response.razorpay_payment_id, 'completed');
              setPaymentStatus('success');
              toast.success('Payment successful!');
              
              // Notify parent component
              onPaymentSuccess();
              
              // Close modal after 2 seconds
              setTimeout(() => {
                onClose();
              }, 2000);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Patient Name',
          email: 'patient@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#15803d' // Green-700
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
              
              {/* Modal content */}
              <div className="mt-4">
                {paymentStatus === 'pending' && (
                  <>
                    <div className="text-center mb-6">
                      <CreditCard className="h-12 w-12 mx-auto text-green-600 mb-2" />
                      <h3 className="text-lg font-medium text-gray-900">Complete Payment</h3>
                      <p className="text-sm text-gray-500">
                        Secure payment for your appointment with Dr. {doctor.name}
                      </p>
                    </div>
                    
                    <div className="border-t border-b py-4 my-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Consultation Fee</span>
                        <span className="font-medium">₹{fee}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">GST (18%)</span>
                        <span className="font-medium">₹{tax}</span>
                      </div>
                      <div className="flex justify-between font-bold mt-4">
                        <span>Total</span>
                        <span>₹{total}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <button
                        onClick={handlePayment}
                        disabled={loading || !scriptLoaded}
                        className="w-full px-4 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Processing...' : 'Pay Now'}
                      </button>
                      <p className="text-xs text-center text-gray-500 mt-2">
                        By clicking "Pay Now", you agree to our Terms and Conditions
                      </p>
                    </div>
                  </>
                )}
                
                {paymentStatus === 'success' && (
                  <div className="text-center py-6">
                    <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600">
                      Your appointment has been confirmed. You can view the details in your profile.
                    </p>
                  </div>
                )}
                
                {paymentStatus === 'failed' && (
                  <div className="text-center py-6">
                    <AlertCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">Payment Failed</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't process your payment. Please try again or use a different payment method.
                    </p>
                    <button
                      onClick={handlePayment}
                      className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}