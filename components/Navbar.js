import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaHome, FaUserPlus, FaClock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    fetchUserStatus();
  }, []);

  const fetchUserStatus = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
        withCredentials: true
      });
      setUser(response.data);
      setLoadingUser(false);
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
      } else {
        console.error('Error fetching user status:', error);
      }
      setLoadingUser(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      setUser(null);
      setIsMenuOpen(false);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server request fails, clear local state
      setUser(null);
      setIsMenuOpen(false);
      toast.error('Error logging out, but you have been logged out locally');
      router.push('/');
    }
  };

  if (loadingUser) {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">StayFinder</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/listings" className="text-gray-700 hover:text-blue-600 px-3 py-2">
              Browse Listings
            </Link>
            
            {user ? (
              <>
                {user.role === 'host' && (
                  <Link href="/host/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                    Host Dashboard
                  </Link>
                )}
                {user.role === 'user' && (
                  <Link 
                    href="/host/become-host" 
                    className="flex items-center text-blue-600 hover:text-blue-700 px-3 py-2 font-medium"
                  >
                    <FaUserPlus className="mr-2" />
                    Become a Host
                  </Link>
                )}
                {user.role === 'pending_host' && (
                  <span className="flex items-center text-yellow-600 px-3 py-2">
                    <FaClock className="mr-2" />
                    Host Request Pending
                  </span>
                )}
                
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2"
                  >
                    <FaUser className="mr-2" />
                    {user.name}
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link href="/my-bookings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        My Bookings
                      </Link>
                      <Link href="/my-favorites" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        My Favorites
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <FaSignOutAlt className="inline mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          aria-hidden={isMenuOpen ? 'false' : 'true'}
        >
          <div
            className={`absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out
              ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="px-4 pt-6 pb-8 space-y-2 flex flex-col h-full">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="self-end mb-4 text-gray-500 hover:text-blue-600 focus:outline-none"
                aria-label="Close menu"
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <Link href="/listings" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
                Browse Listings
              </Link>
              {user ? (
                <>
                  {user.role === 'host' && (
                    <Link href="/host/dashboard" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
                      Host Dashboard
                    </Link>
                  )}
                  {user.role === 'user' && (
                    <Link 
                      href="/host/become-host" 
                      className="flex items-center text-blue-600 hover:text-blue-700 px-3 py-2 font-medium rounded"
                    >
                      <FaUserPlus className="mr-2" />
                      Become a Host
                    </Link>
                  )}
                  {user.role === 'pending_host' && (
                    <span className="flex items-center text-yellow-600 px-3 py-2 rounded">
                      <FaClock className="mr-2" />
                      Host Request Pending
                    </span>
                  )}
                  <Link href="/my-bookings" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
                    My Bookings
                  </Link>
                  <Link href="/my-favorites" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
                    My Favorites
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 rounded"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
                    Login
                  </Link>
                  <Link href="/register" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded">
                    Sign Up
                  </Link>
                </>
              )}
              <div className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 