import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDoctorById } from '../lib/api';
import { Star, MapPin, Award, Clock, Video, MessageSquare, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Doctor } from '../types';
import { BookingForm } from '../components/BookingForm';

export function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function fetchDoctor() {
      try {
        setLoading(true);
        setError(null);
        if (id) {
          const doctorData = await getDoctorById(id);
          setDoctor(doctorData);
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Failed to load doctor profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-200 h-24 w-24"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-4 mt-6">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error || 'Doctor not found'}</p>
          <Link 
            to="/doctors" 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Doctor Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <img 
              src={doctor.image} 
              alt={`Dr. ${doctor.name}`} 
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4 md:mb-0 md:mr-6"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800';
              }}
            />
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">Dr. {doctor.name}</h1>
              <p className="text-green-100 text-lg mt-1">{doctor.specialization}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-300 mr-1" />
                  <span>{doctor.ratings} Rating</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-blue-300 mr-1" />
                  <span>{doctor.experience} Years Experience</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-red-300 mr-1" />
                  <span>{doctor.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'experience'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Doctor Info */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About Dr. {doctor.name}</h2>
                  <p className="text-gray-700 mb-6">
                    {doctor.about || `Dr. ${doctor.name} is a highly qualified ${doctor.specialization} with ${doctor.experience} years of experience. They specialize in providing comprehensive care and treatment for various conditions.`}
                  </p>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {doctor.specializations && doctor.specializations.length > 0 ? (
                      doctor.specializations.map((spec, index) => (
                        <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600">General {doctor.specialization}</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Concerns Treated</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {doctor.concernsTreated && doctor.concernsTreated.length > 0 ? (
                      doctor.concernsTreated.map((concern, index) => (
                        <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                          {concern}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-600">General medical concerns</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages && doctor.languages.length > 0 ? (
                      doctor.languages.map((lang, index) => (
                        <span key={index} className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                        English
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'experience' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Work Experience</h2>
                  
                  {doctor.workExperience && doctor.workExperience.length > 0 ? (
                    <div className="space-y-6">
                      {doctor.workExperience.map((exp, index) => (
                        <div key={index} className="border-l-4 border-green-600 pl-4 py-1">
                          <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                          <p className="text-gray-600">{exp.hospital}</p>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      Dr. {doctor.name} has {doctor.experience} years of experience as a {doctor.specialization}.
                    </p>
                  )}
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Patient Reviews</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-2">
                      <div className="text-4xl font-bold text-gray-900 mr-4">{doctor.ratings}</div>
                      <div>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < Math.floor(doctor.ratings) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">Based on patient reviews</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Sample reviews */}
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">2 weeks ago</span>
                      </div>
                      <p className="text-gray-700">
                        Dr. {doctor.name} was very professional and thorough. They took the time to explain everything clearly and answer all my questions.
                      </p>
                      <p className="text-sm text-gray-600 mt-1">- Sarah J.</p>
                    </div>
                    
                    <div className="border-b pb-4">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">1 month ago</span>
                      </div>
                      <p className="text-gray-700">
                        Great experience overall. The doctor was knowledgeable and the staff was friendly. Would recommend.
                      </p>
                      <p className="text-sm text-gray-600 mt-1">- Michael T.</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">2 months ago</span>
                      </div>
                      <p className="text-gray-700">
                        Dr. {doctor.name} is amazing! They really listened to my concerns and provided excellent care. I felt very comfortable during my visit.
                      </p>
                      <p className="text-sm text-gray-600 mt-1">- Emily R.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column - Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Book Appointment</h2>
                
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="text-center p-3 border rounded bg-white">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-xs">In-Clinic</span>
                    </div>
                    <p className="text-sm font-medium">₹{doctor.fees.inClinic}</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white">
                    <div className="flex items-center justify-center mb-1">
                      <Video className="h-4 w-4 text-blue-600 mr-1" />
                      <span className="text-xs">Video</span>
                    </div>
                    <p className="text-sm font-medium">₹{doctor.fees.video}</p>
                  </div>
                  <div className="text-center p-3 border rounded bg-white">
                    <div className="flex items-center justify-center mb-1">
                      <MessageSquare className="h-4 w-4 text-purple-600 mr-1" />
                      <span className="text-xs">Chat</span>
                    </div>
                    <p className="text-sm font-medium">₹{doctor.fees.chat}</p>
                  </div>
                </div>
                
                <BookingForm doctor={doctor} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}