import { supabase } from "./supabase";
import type { Booking, Doctor, PaymentDetails, PaymentResponse } from "../types";

export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching doctors:", error.message);
      throw new Error(error.message);
    }

    // Join with doctor_fees to get the fees
    const doctorsWithFees = await Promise.all(
      (data || []).map(async (doctor) => {
        const { data: feesData } = await supabase
          .from("doctor_fees")
          .select("*")
          .eq("doctor_id", doctor.id)
          .single();

        // Join with work_experience to get the work experience
        const { data: workExperience } = await supabase
          .from("work_experience")
          .select("*")
          .eq("doctor_id", doctor.id);

        return {
          ...doctor,
          fees: {
            inClinic: feesData?.in_clinic || 0,
            video: feesData?.video || 0,
            chat: feesData?.chat || 0,
          },
          workExperience: (workExperience || []).map(exp => ({
            position: exp.position,
            hospital: exp.hospital,
            duration: exp.duration
          }))
        };
      })
    );

    return doctorsWithFees;
  } catch (err) {
    console.error("Unexpected error fetching doctors:", err);
    return [];
  }
};

export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  try {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching doctor:", error.message);
      throw new Error(error.message);
    }

    if (!data) {
      return null;
    }

    // Get doctor fees
    const { data: feesData } = await supabase
      .from("doctor_fees")
      .select("*")
      .eq("doctor_id", id)
      .single();

    // Get work experience
    const { data: workExperience } = await supabase
      .from("work_experience")
      .select("*")
      .eq("doctor_id", id);

    return {
      ...data,
      fees: {
        inClinic: feesData?.in_clinic || 0,
        video: feesData?.video || 0,
        chat: feesData?.chat || 0,
      },
      workExperience: (workExperience || []).map(exp => ({
        position: exp.position,
        hospital: exp.hospital,
        duration: exp.duration
      }))
    };
  } catch (err) {
    console.error("Unexpected error fetching doctor:", err);
    return null;
  }
};

export const createBooking = async (bookingData: {
  doctorId: string;
  bookingDate: string;
  bookingTime: string;
  consultationType: string;
}) => {
  try {
    const { data: doctor } = await supabase
      .from("doctors")
      .select("name, specialization, image")
      .eq("id", bookingData.doctorId)
      .single();

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id,
        doctor_id: bookingData.doctorId,
        booking_date: bookingData.bookingDate,
        booking_time: bookingData.bookingTime,
        consultation_type: bookingData.consultationType,
        status: 'pending',
        payment_status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error creating booking:", err);
    throw err;
  }
};

export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_date,
        booking_time,
        consultation_type,
        status,
        payment_status,
        payment_id,
        created_at,
        doctor_id,
        doctors(name, specialization, image)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching bookings:", error.message);
      throw new Error(error.message);
    }

    // Transform the data to match the Booking type
    return (data || []).map(booking => ({
      id: booking.id,
      doctorId: booking.doctor_id,
      doctorName: booking.doctors.name,
      doctorSpecialization: booking.doctors.specialization,
      doctorImage: booking.doctors.image,
      bookingDate: booking.booking_date,
      bookingTime: booking.booking_time,
      consultationType: booking.consultation_type,
      status: booking.status,
      createdAt: booking.created_at,
      paymentStatus: booking.payment_status,
      paymentId: booking.payment_id
    }));
  } catch (err) {
    console.error("Unexpected error fetching bookings:", err);
    return [];
  }
};

export const cancelBooking = async (bookingId: string) => {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ status: 'cancelled' })
      .eq("id", bookingId)
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      console.error("Error cancelling booking:", error.message);
      throw new Error(error.message);
    }

    return true;
  } catch (err) {
    console.error("Unexpected error cancelling booking:", err);
    throw err;
  }
};

// Payment related functions
export const createPaymentOrder = async (paymentDetails: PaymentDetails): Promise<PaymentResponse> => {
  try {
    // In a real application, this would be a server-side API call
    // For demo purposes, we're simulating the response
    const response: PaymentResponse = {
      id: `order_${Math.random().toString(36).substring(2, 15)}`,
      entity: 'order',
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      receipt: paymentDetails.receipt,
      status: 'created',
      created_at: Date.now()
    };
    
    return response;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw new Error('Failed to create payment order');
  }
};

export const verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
  try {
    // In a real application, this would be a server-side verification
    // For demo purposes, we're simulating a successful verification
    return true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Failed to verify payment');
  }
};

export const updatePaymentStatus = async (bookingId: string, paymentId: string, status: 'completed' | 'failed') => {
  try {
    const { error } = await supabase
      .from("bookings")
      .update({ 
        payment_status: status,
        payment_id: paymentId,
        status: status === 'completed' ? 'confirmed' : 'pending'
      })
      .eq("id", bookingId)
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

    if (error) {
      console.error("Error updating payment status:", error.message);
      throw new Error(error.message);
    }

    return true;
  } catch (err) {
    console.error("Unexpected error updating payment status:", err);
    throw err;
  }
};