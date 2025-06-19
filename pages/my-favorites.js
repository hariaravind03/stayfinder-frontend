import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import BackButton from '../components/BackButton';

export default function MyFavorites() {
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/favorites', {
        withCredentials: true,
      });
      setFavoriteListings(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please log in to view your favorites.');
        router.push('/login');
        return;
      }
      toast.error(error.response?.data?.error || 'Error loading favorites');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>

        {favoriteListings.length === 0 ? (
          <p className="text-gray-700 text-lg">You haven't favorited any listings yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => router.push(`/listings/${listing._id}`)}
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1 truncate">
                    {listing.title}
                  </h2>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <FaMapMarkerAlt className="mr-1" /> {listing.location}
                  </div>
                  <p className="text-gray-700 text-lg font-semibold mb-2">${listing.price} / night</p>
                  {listing.averageRating > 0 && (
                    <div className="flex items-center text-yellow-500 text-sm">
                      <FaStar className="mr-1" /> {listing.averageRating.toFixed(1)} ({listing.reviews.length} reviews)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 