import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Stethoscope, X, ChevronDown, Loader2 } from 'lucide-react';
import { DoctorCard } from '../components/DoctorCard';
import { getDoctors } from '../lib/api';
import type { Doctor } from '../types';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export function DoctorListing() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    specialization: '',
    gender: '',
    experience: '',
    fee: ''
  });

  // Specializations list
  const specializations = [
    'Cardiologist', 
    'Dermatologist', 
    'Neurologist', 
    'Pediatrician', 
    'Orthopedic Surgeon',
    'Gynecologist',
    'Psychiatrist',
    'Ophthalmologist',
    'Dentist',
    'General Physician'
  ];

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        setError(null);
        const doctorsData = await getDoctors();
        setDoctors(doctorsData);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Failed to load doctors. Please try again later.');
        toast.error('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Update active filters
    if (value) {
      if (!activeFilters.includes(name)) {
        setActiveFilters([...activeFilters, name]);
      }
    } else {
      setActiveFilters(activeFilters.filter(filter => filter !== name));
    }
  };

  const clearFilter = (filterName: string) => {
    setFilters(prev => ({ ...prev, [filterName]: '' }));
    setActiveFilters(activeFilters.filter(filter => filter !== filterName));
  };

  const clearAllFilters = () => {
    setFilters({
      specialization: '',
      gender: '',
      experience: '',
      fee: ''
    });
    setActiveFilters([]);
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (searchQuery && !doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.specialization && doctor.specialization !== filters.specialization) return false;
    if (filters.gender && doctor.gender !== filters.gender) return false;
    if (filters.experience) {
      const exp = parseInt(String(doctor.experience));
      if (filters.experience === '0-5' && exp > 5) return false;
      if (filters.experience === '5-10' && (exp < 5 || exp > 10)) return false;
      if (filters.experience === '10+' && exp < 10) return false;
    }
    if (filters.fee) {
      const videoFee = doctor.fees.video;
      if (filters.fee === 'under-500' && videoFee >= 500) return false;
      if (filters.fee === '500-1000' && (videoFee < 500 || videoFee > 1000)) return false;
      if (filters.fee === 'above-1000' && videoFee <= 1000) return false;
    }
    return true;
  });

  const getFilterLabel = (name: string, value: string) => {
    switch (name) {
      case 'specialization':
        return `Specialization: ${value}`;
      case 'gender':
        return `Gender: ${value.charAt(0).toUpperCase() + value.slice(1)}`;
      case 'experience':
        if (value === '0-5') return 'Experience: 0-5 years';
        if (value === '5-10') return 'Experience: 5-10 years';
        if (value === '10+') return 'Experience: 10+ years';
        return '';
      case 'fee':
        if (value === 'under-500') return 'Fee: Under ₹500';
        if (value === '500-1000') return 'Fee: ₹500-₹1000';
        if (value === 'above-1000') return 'Fee: Above ₹1000';
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-lg p-6 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Find Your Doctor</h1>
        <p className="text-green-100">Connect with the best healthcare professionals</p>
      </div>

      <div className="mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name or specialization..."
            className="pl-10 p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          className={`p-3 border rounded-md flex items-center gap-2 whitespace-nowrap ${showFilters ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-700 hover:border-green-600 hover:text-green-600'}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-5 w-5" />
          Filters
          {activeFilters.length > 0 && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-600">Active filters:</span>
          {activeFilters.map(filter => (
            <span 
              key={filter} 
              className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm flex items-center"
            >
              {getFilterLabel(filter, filters[filter as keyof typeof filters])}
              <button 
                onClick={() => clearFilter(filter)}
                className="ml-2 text-green-700 hover:text-green-900"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button 
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-800 ml-2"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="p-6 border rounded-md bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                  <div className="relative">
                    <select 
                      name="specialization" 
                      value={filters.specialization} 
                      onChange={handleFilterChange}
                      className="block w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="">All Specializations</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <div className="relative">
                    <select 
                      name="gender" 
                      value={filters.gender} 
                      onChange={handleFilterChange}
                      className="block w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="">Any Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                  <div className="relative">
                    <select 
                      name="experience" 
                      value={filters.experience} 
                      onChange={handleFilterChange}
                      className="block w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="">Any Experience</option>
                      <option value="0-5">0-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
                  <div className="relative">
                    <select 
                      name="fee" 
                      value={filters.fee} 
                      onChange={handleFilterChange}
                      className="block w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="">Any Fee</option>
                      <option value="under-500">Under ₹500</option>
                      <option value="500-1000">₹500 - ₹1000</option>
                      <option value="above-1000">Above ₹1000</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results section */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {loading ? 'Finding doctors...' : `${filteredDoctors.length} doctors found`}
          </h2>
          <div className="relative">
            <select 
              className="block w-full p-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="rating">Sort by: Rating</option>
              <option value="experience">Sort by: Experience</option>
              <option value="fee-low">Sort by: Fee (Low to High)</option>
              <option value="fee-high">Sort by: Fee (High to Low)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none h-4 w-4" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No doctors found</h3>
          <p className="text-gray-600 mb-6">We couldn't find any doctors matching your criteria.</p>
          <button 
            onClick={clearAllFilters}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DoctorCard doctor={doctor} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}