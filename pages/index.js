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
    </div>
  );
} 