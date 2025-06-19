import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function BecomeHost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    reason: '',
  });
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/me`, {
        withCredentials: true
      });
      setUserStatus(response.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/login');
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/become-host`,
        formData,
        {
          withCredentials: true
        }
      );

      toast.success('Host request submitted successfully!');
      router.push('/host/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      toast.error(error.response?.data?.error || 'Error submitting host request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (userStatus?.role === 'host') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-4">
              <FaCheckCircle className="text-green-500 text-4xl mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Already a Host</h1>
            </div>
            <p className="text-gray-600 text-center mb-6">
              You are already a host. You can manage your listings from the host dashboard.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push('/host/dashboard')}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (userStatus?.role === 'pending_host') {
    const hostDetails = userStatus.hostDetails || {};
    const submittedDate = new Date(hostDetails.submittedAt).toLocaleDateString();
    const submittedTime = new Date(hostDetails.submittedAt).toLocaleTimeString();

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center mb-4">
              <FaClock className="text-yellow-500 text-4xl mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Host Request Pending</h1>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 text-center">
                Your host request is currently under review. We'll notify you once it's been processed.
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-semibold mb-2">Application Details</h2>
                <div className="space-y-2">
                  <p><span className="font-medium">Submitted on:</span> {submittedDate} at {submittedTime}</p>
                  <p><span className="font-medium">Name:</span> {hostDetails.name}</p>
                  <p><span className="font-medium">Email:</span> {hostDetails.email}</p>
                  <p><span className="font-medium">Phone:</span> {hostDetails.phone}</p>
                  <p><span className="font-medium">Address:</span> {hostDetails.address}</p>
                  <p><span className="font-medium">Reason:</span> {hostDetails.reason}</p>
                </div>
              </div>
              <div className="text-center text-sm text-gray-500">
                <p>We typically review applications within 1-2 business days.</p>
                <p>You'll receive an email notification once your application is reviewed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Become a Host</h1>

        {/* Temporary: Display userStatus for debugging */}
        {userStatus && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
            <p className="font-bold">User Status Debug Info:</p>
            <pre className="text-sm">{JSON.stringify(userStatus, null, 2)}</pre>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-6">
            Fill out the form below to request host status. We'll review your application and get back to you soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Why do you want to become a host?
              </label>
              <textarea
                required
                rows={4}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Tell us about your experience and why you'd make a great host..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 