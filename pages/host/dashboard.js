import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaArrowLeft, FaMoneyBillWave, FaTimesCircle } from 'react-icons/fa';
import BackButton from '../../components/BackButton';
export default function HostDashboard() {
  const router = useRouter();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const listingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/my-listings`, {
        withCredentials: true
      });
      const bookingsRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/host-bookings`, {
        withCredentials: true
      });

      console.log('Listings data:', listingsRes.data);
      console.log('Bookings data:', bookingsRes.data);

      setListings(listingsRes.data);
      setBookings(bookingsRes.data);
      setLoading(false);
    } catch (error) {
      console.log('Error in fetchData:', error);
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      toast.error('Error loading dashboard data');
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/${id}`, {
        withCredentials: true
      });
      toast.success('Listing deleted successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error deleting listing');
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setPendingDeleteId(null);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      console.log(bookingId, status);
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${bookingId}/status`,
        { status },
        {
          withCredentials: true
        }
      );
      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      toast.error('Error updating booking status');
    }
  };

  const handleCancelApproval = async (bookingId, action) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings/${bookingId}/cancel-approval`,
        { action },
        { withCredentials: true }
      );
      toast.success(`Cancellation ${action}`);
      fetchData();
    } catch (error) {
      toast.error('Error updating cancellation approval');
    }
  };

  // Calculate earnings and cancelled balance for the current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const earnings = bookings
    .filter(b => b.status === 'confirmed' && new Date(b.checkIn).getMonth() === currentMonth && new Date(b.checkIn).getFullYear() === currentYear)
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const cancelled = bookings
    .filter(b => b.status === 'cancelled' && new Date(b.checkIn).getMonth() === currentMonth && new Date(b.checkIn).getFullYear() === currentYear)
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 pb-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <BackButton/>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight text-center sm:text-left">Host Dashboard</h1>
          <button
            onClick={() => router.push('/host/create-listing')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            <span className="hidden xs:inline">Create New Listing</span>
            <span className="inline xs:hidden">New</span>
          </button>
        </div>
        {/* Earnings Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[120px] border border-blue-100">
            <div className="flex items-center gap-2 mb-2">
              <FaMoneyBillWave className="text-green-500 text-2xl" />
              <span className="text-lg font-semibold text-gray-700">This Month's Earnings</span>
            </div>
            <div className="text-3xl font-extrabold text-green-600">${earnings}</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[120px] border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <FaTimesCircle className="text-red-500 text-2xl" />
              <span className="text-lg font-semibold text-gray-700">Cancelled Bookings (Balance Lost)</span>
            </div>
            <div className="text-3xl font-extrabold text-red-600">${cancelled}</div>
          </div>
        </div>
        {/* My Listings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4">My Listings</h2>
          <div className="overflow-x-auto w-full">
            <table className="min-w-[600px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Title</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Price</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {listings.map((listing) => (
                  <tr key={listing._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">{listing.title}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-gray-900">${listing.price}/night</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 sm:gap-4">
                      <button
                        onClick={() => router.push(`/host/edit-listing/${listing._id}`)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => { setShowDeleteModal(true); setPendingDeleteId(listing._id); }}
                        className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition-colors"
                        disabled={deletingId === listing._id}
                      >
                        {deletingId === listing._id ? 'Deleting...' : <FaTrash />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Recent Bookings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-4">Recent Bookings</h2>
          <div className="overflow-x-auto w-full">
            <table className="min-w-[700px] w-full divide-y divide-gray-200 text-xs sm:text-sm">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Guest</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Listing</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Dates</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-2 sm:px-6 py-3 text-left font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900">{booking.guest.name}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-gray-900">{booking.listing.title}</td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(booking.checkIn).toLocaleDateString()} -{' '}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                      {booking.cancelRequested && (
                        <div className="text-xs text-red-500 mt-1">
                          Cancellation Requested
                          {booking.cancelReason && (
                            <div className="text-xs text-gray-500 mt-1 italic">Reason: {booking.cancelReason}</div>
                          )}
                          {booking.cancelApprovalStatus === 'pending' && (
                            <div className="flex gap-2 mt-2">
                              <button
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                onClick={() => handleCancelApproval(booking._id, 'approved')}
                              >
                                Approve
                              </button>
                              <button
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                onClick={() => handleCancelApproval(booking._id, 'rejected')}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {booking.cancelApprovalStatus !== 'pending' && (
                            <div className={`mt-2 text-xs font-semibold ${booking.cancelApprovalStatus === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                              {`Cancellation ${booking.cancelApprovalStatus.charAt(0).toUpperCase() + booking.cancelApprovalStatus.slice(1)}`}
                              {booking.cancelApprovalDate && (
                                <span className="ml-2 text-gray-500">on {new Date(booking.cancelApprovalDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2 sm:gap-4">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                            className="text-green-600 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-400 rounded transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                            className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-400 rounded transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-2">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md relative">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Confirm Deletion</h2>
              <p className="text-sm sm:text-base">Are you sure you want to delete this listing? This action cannot be undone.</p>
              <div className="flex justify-end gap-2 mt-4 sm:mt-6">
                <button
                  className="px-3 sm:px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => { setShowDeleteModal(false); setPendingDeleteId(null); }}
                  disabled={deletingId !== null}
                >
                  Cancel
                </button>
                <button
                  className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => handleDeleteListing(pendingDeleteId)}
                  disabled={deletingId !== null}
                >
                  {deletingId !== null ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 