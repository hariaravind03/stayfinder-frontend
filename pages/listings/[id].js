import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { FaStar, FaMapMarkerAlt, FaBed, FaBath, FaUsers, FaArrowLeft, FaRegHeart, FaHeart, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import { Label } from "../../components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import BackButton from '../../components/BackButton';

export default function ListingDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null,
  });
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
      checkFavoriteStatus();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/${id}`);
      setListing(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Error loading listing');
      router.push('/listings');
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorites`, {
        withCredentials: true,
      });
      const favorites = response.data;
      setIsFavorited(favorites.some((fav) => fav._id === id));
    } catch (error) {
      // If not authenticated, or no favorites, assume not favorited
      setIsFavorited(false);
    }
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorited) {
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorites/${id}`, {
          withCredentials: true,
        });
        toast.success('Removed from favorites!');
      } else {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/favorites/${id}`, {}, {
          withCredentials: true,
        });
        toast.success('Added to favorites!');
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      toast.error(error.response?.data?.error || 'Error updating favorites');
    }
  };

  const handleBooking = async () => {
    if (!dateRange.from || !dateRange.to) {
      return toast.error('Please select check-in and check-out dates');
    }

    // Format dates to ISO string and remove time component
    const checkIn = new Date(dateRange.from);
    checkIn.setHours(0, 0, 0, 0);
    
    const checkOut = new Date(dateRange.to);
    checkOut.setHours(0, 0, 0, 0);

    // Validate dates
    if (checkIn >= checkOut) {
      return toast.error('Check-out date must be after check-in date');
    }

    // Calculate number of nights
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`,
        {
          listingId: id,
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          guests,
          totalPrice,
          nights
        },
        {
          withCredentials: true
        }
      );

      toast.success('Booking created successfully!');
      router.push('/my-bookings');
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      toast.error(error.response?.data?.error || 'Error creating booking');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % listing.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!listing) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modal for full image view */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setIsModalOpen(false)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-80 z-10"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close full image"
            >
              <FaTimes className="w-6 h-6" />
            </button>
            <div className="relative w-full h-[70vh]">
              <Image
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                layout="fill"
                objectFit="contain"
                className="rounded-xl"
                priority
              />
            </div>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setIsModalOpen(true)}>
              <Image
                src={listing.images[currentImageIndex]}
                alt={listing.title}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); previousImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                    aria-label="Previous image"
                  >
                    <FaChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-gray-800 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                    aria-label="Next image"
                  >
                    <FaChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {listing.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`relative h-24 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'ring-2 ring-blue-500 scale-105' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`${listing.title} ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{listing.title}</h1>
              <button 
                onClick={handleFavoriteToggle}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {isFavorited ? (
                  <FaHeart className="text-red-500 text-3xl" />
                ) : (
                  <FaRegHeart className="text-gray-500 text-3xl" />
                )}
              </button>
            </div>

            <div className="flex items-center text-gray-600 space-x-2">
              <FaMapMarkerAlt className="text-blue-500" />
              <span className="text-lg">{listing.location}</span>
            </div>

            <div className="grid grid-cols-3 gap-6 py-6 border-y border-gray-200">
              <div className="flex items-center space-x-2">
                <FaBed className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium">{listing.bedrooms}</p>
                  <p className="text-sm text-gray-500">Bedrooms</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaBath className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium">{listing.bathrooms}</p>
                  <p className="text-sm text-gray-500">Bathrooms</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium">{listing.maxGuests}</p>
                  <p className="text-sm text-gray-500">Guests</p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed">{listing.description}</p>
            </div>

            {listing.amenities.filter(a => a && a.trim() !== '').length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {listing.amenities
                    .filter(a => a && a.trim() !== '')
                    .map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2 text-gray-700">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Booking Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-3xl font-bold">${listing.price}</span>
                  <span className="text-gray-600"> / night</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="check-in" className="text-sm font-medium">
                      Check-in & Check-out
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-range"
                          className="w-full justify-between font-normal h-12"
                        >
                          {dateRange.from ? (
                            dateRange.to ? (
                              `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                            ) : (
                              dateRange.from.toLocaleDateString()
                            )
                          ) : (
                            "Select your dates"
                          )}
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-4">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          numberOfMonths={1}
                          showOutsideDays={true}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guests" className="text-sm font-medium">
                      Guests
                    </Label>
                    <select
                      id="guests"
                      required
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[...Array(listing.maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path was not previously generated.
export async function getStaticProps({ params }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/${params.id}`);
    const listing = await res.json();

    return {
      props: {
        listing,
      },
      // Re-generate the page at most once per second
      revalidate: 1,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export async function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return {
    paths: [],
    fallback: true
  };
} 