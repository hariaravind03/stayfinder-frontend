import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import PropertyCard from '../../components/PropertyCard';
import BackButton from '../../components/BackButton';
import { FaSearch, FaFilter, FaCalendarAlt } from 'react-icons/fa';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { ChevronDownIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Listings() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    dateRange: {
      from: null,
      to: null
    }
  });

  // Only fetch listings on initial load
  useEffect(() => {
    if (router.isReady) {
      const { search, minPrice, maxPrice, location, checkIn, checkOut } = router.query;
      setFilters({
        search: search || '',
        minPrice: minPrice || '',
        maxPrice: maxPrice || '',
        location: location || '',
        dateRange: {
          from: checkIn ? new Date(checkIn) : null,
          to: checkOut ? new Date(checkOut) : null
        }
      });
      fetchListings();
    }
  }, [router.isReady]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add all filters to params
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.location) params.append('location', filters.location);
      if (filters.dateRange.from) params.append('checkIn', filters.dateRange.from.toISOString());
      if (filters.dateRange.to) params.append('checkOut', filters.dateRange.to.toISOString());

      console.log('Fetching listings with params:', params.toString());
      const response = await axios.get(`http://localhost:5000/api/listings?${params}`);
      console.log('Received listings:', response.data);
      
      setListings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Error loading listings');
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateRangeChange = (range) => {
    setFilters(prev => ({
      ...prev,
      dateRange: range
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'dateRange') {
        if (value.from) params.append('checkIn', value.from.toISOString());
        if (value.to) params.append('checkOut', value.to.toISOString());
      } else if (value) {
        params.append(key, value);
      }
    });
    router.push(`/listings?${params.toString()}`);
    fetchListings(); // Fetch listings when search button is clicked
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search listings..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Enter location..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min price"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max price"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="date-range" className="block text-sm font-medium text-gray-700">
                  Dates
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-range"
                      className="w-full justify-between font-normal mt-1"
                    >
                      {filters.dateRange.from ? (
                        filters.dateRange.to ? (
                          `${formatDate(filters.dateRange.from)} - ${formatDate(filters.dateRange.to)}`
                        ) : (
                          formatDate(filters.dateRange.from)
                        )
                      ) : (
                        "Select dates"
                      )}
                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-4">
                    <Calendar
                      mode="range"
                      selected={filters.dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={1}
                      showOutsideDays={true}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaSearch className="mr-2" />
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <PropertyCard key={listing._id} property={listing} />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No listings found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
} 