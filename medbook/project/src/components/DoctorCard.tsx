import React from 'react';
import { Star, MapPin, Heart, MessageSquare, Video, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Doctor } from '../types';
import { motion } from 'framer-motion';

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="relative p-4">
        <div className="flex items-start">
          <div className="relative">
            <img
              src={doctor.image}
              alt={`Dr. ${doctor.name}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-green-50"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800';
              }}
            />
            <button 
              onClick={toggleFavorite}
              className="absolute -top-1 -right-1 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            </button>
          </div>
          
          <div className="ml-4 flex-1">
            <Link to={`/doctors/${doctor.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-green-700">
                Dr. {doctor.name}
              </h3>
            </Link>
            
            <p className="text-sm text-gray-600 mt-1">{doctor.specialization}</p>
            
            <div className="flex items-center mt-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="ml-1 text-sm text-gray-700">{doctor.ratings}</span>
              <span className="mx-2 text-gray-300">•</span>
              <Award className="h-4 w-4 text-blue-500" />
              <span className="ml-1 text-sm text-gray-700">{doctor.experience} yrs</span>
            </div>
            
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              {doctor.location}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {doctor.languages && doctor.languages.length > 0 ? (
            doctor.languages.map((lang) => (
              <span key={lang} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                {lang}
              </span>
            ))
          ) : (
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              English
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="text-center p-2 border rounded bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-xs">In-Clinic</span>
            </div>
            <p className="text-sm font-medium">₹{doctor.fees.inClinic}</p>
          </div>
          <div className="text-center p-2 border rounded bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center mb-1">
              <Video className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-xs">Video</span>
            </div>
            <p className="text-sm font-medium">₹{doctor.fees.video}</p>
          </div>
          <div className="text-center p-2 border rounded bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center justify-center mb-1">
              <MessageSquare className="h-4 w-4 text-purple-600 mr-1" />
              <span className="text-xs">Chat</span>
            </div>
            <p className="text-sm font-medium">₹{doctor.fees.chat}</p>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            to={`/doctors/${doctor.id}`}
            className="w-full px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 transition-colors text-center text-sm font-medium"
          >
            View Profile
          </Link>
          
          <Link
            to={`/doctors/${doctor.id}`}
            className="w-full px-4 py-2 border border-green-700 text-green-700 rounded-md hover:bg-green-50 transition-colors text-center text-sm font-medium"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}