import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Shield, Clock, Globe2, HeartPulse } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen font-sans text-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-100 to-blue-100 py-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold text-gray-900 mb-4"
        >
          About MedBook
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Connecting patients with qualified healthcare professionals through a seamless, 
          digital platform for better healthcare access and improved patient outcomes.
        </motion.p>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
          To revolutionize healthcare accessibility by providing a user-friendly platform 
          that connects patients with qualified doctors, making quality healthcare available 
          to everyone, anywhere, anytime.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
          {[
            { icon: HeartPulse, title: 'Quality Healthcare', desc: 'Partnering with top healthcare professionals for the highest standard of medical care.' },
            { icon: Globe2, title: 'Accessibility', desc: 'Bridging geographical gaps with seamless online consultations and healthcare access.' },
            { icon: Shield, title: 'Trust & Security', desc: 'Ensuring privacy and data security for both patients and doctors.' },
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-50 shadow-lg rounded-xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">Our Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 px-6">
          {[
            { value: '1000+', label: 'Verified Doctors' },
            { value: '50K+', label: 'Happy Patients' },
            { value: '30+', label: 'Specialties' },
            { value: '4.8', label: 'Average Rating' },
          ].map((stat, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.1 }}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <div className="text-5xl font-bold text-green-600 mb-2">{stat.value}</div>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-white text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">Why Choose MedBook?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {[
            { icon: Users, title: 'Expert Doctors', desc: 'All our doctors are thoroughly verified and come with years of experience in their fields.' },
            { icon: Clock, title: '24/7 Availability', desc: 'Access healthcare services round the clock and consult with doctors at your convenience.' },
            { icon: Shield, title: 'Secure Platform', desc: 'We prioritize your privacy and ensure industry-standard security for health data.' },
            { icon: Award, title: 'Quality Assurance', desc: 'We maintain the highest standards in healthcare service delivery through regular monitoring.' },
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="flex items-start p-6 bg-gray-50 shadow-lg rounded-lg"
            >
              <div className="flex-shrink-0">
                <item.icon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
