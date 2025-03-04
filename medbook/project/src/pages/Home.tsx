import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Clock, Video, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-100 to-blue-100 py-20 text-center">
        <motion.h1 
          className="text-5xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Your Health, Our Priority
        </motion.h1>
        <p className="text-xl text-gray-600 mb-8">Find and book appointments with top doctors in your area</p>
        {/* Search Bar */}
        <motion.div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4 bg-white shadow-lg p-6 rounded-lg" 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}>
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select className="w-full pl-10 pr-4 py-3 border rounded-lg appearance-none bg-white">
              <option>Select Location</option>
              <option>New York</option>
              <option>Los Angeles</option>
              <option>Chicago</option>
            </select>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search doctors, specializations..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
            />
          </div>
          <Link
            to="/doctors"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
          >
            Search
          </Link>
        </motion.div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose MedBook?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: "Verified Doctors", desc: "All our doctors are verified professionals." },
              { icon: Clock, title: "Instant Booking", desc: "Book appointments instantly with top doctors." },
              { icon: Video, title: "Multiple Consultation Modes", desc: "Choose between in-clinic, video, or chat." }
            ].map((feature, index) => (
              <motion.div key={index} 
                className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Consultation Types */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Consultation Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MessageSquare, title: "Chat Consultation", desc: "Chat with doctors instantly.", price: "₹500" },
              { icon: Video, title: "Video Consultation", desc: "Face-to-face video calls.", price: "₹800" },
              { icon: MapPin, title: "In-Clinic Visit", desc: "Visit doctors in person.", price: "₹1000" }
            ].map((consult, index) => (
              <motion.div key={index} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.05 }}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <consult.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{consult.title}</h3>
                <p className="text-gray-600 mb-4">{consult.desc}</p>
                <p className="text-green-600 font-semibold">Starting from {consult.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
