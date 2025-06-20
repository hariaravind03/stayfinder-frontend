import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredListings, setFeaturedListings] = useState([]);

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings`);
      setFeaturedListings(response.data.slice(0,4));
    } catch (error) {
      // Optionally handle error
      setFeaturedListings([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/listings?search=${searchQuery}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-pink-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-pink-100 via-blue-100 to-white h-[320px] sm:h-[400px] md:h-[480px] flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-blue-100/60"></div>
        <div className="relative z-10 max-w-3xl w-full mx-auto px-4 sm:px-8 text-center flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-3 sm:mb-4 drop-shadow-lg leading-tight">
            Book unique places to stay
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 font-medium">
            Discover and book amazing homes and experiences around the world.
          </p>
          <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
            <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-md p-1.5 sm:p-2 gap-2 sm:gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where to? Try 'Goa', 'Paris', ..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-base sm:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent min-w-0 placeholder-gray-500"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition-colors"
                aria-label="Search"
              >
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 md:py-16">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-left sm:text-center">Featured Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-8">
          {featuredListings.length > 0 ? (
            featuredListings.map((listing) => (
              <PropertyCard key={listing._id} property={listing} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-8">No featured listings found.</div>
          )}
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="w-full bg-gray-50 border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start">
            <span className="text-2xl font-extrabold text-gray-800 tracking-tight">StayFinder</span>
            <span className="text-sm text-gray-500 mt-1">Find your perfect stay, anywhere.</span>
          </div>
          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600 text-sm font-medium">
            <a href="/about" className="hover:text-blue-600 transition-colors">About</a>
            <a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a>
            <a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          </div>
          {/* Social Media Icons */}
          <div className="flex items-center justify-center gap-4">
            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.94 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.68 2.12 2.9 3.99 2.93A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-700 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
            </a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 py-2 border-t border-gray-100 mt-4">&copy; {new Date().getFullYear()} StayFinder. All rights reserved.</div>
      </footer>
    </div>
  );
} 