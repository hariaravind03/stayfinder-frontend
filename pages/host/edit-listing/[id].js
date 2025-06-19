import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BackToDashboardButton } from '../../../components/BackButton';

export default function EditListing() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    maxGuests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    images: [],
  });
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (id) fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/${id}`);
      setForm({
        ...res.data,
        price: res.data.price || '',
        maxGuests: res.data.maxGuests || 1,
        bedrooms: res.data.bedrooms || 1,
        bathrooms: res.data.bathrooms || 1,
        amenities: res.data.amenities || [],
        images: res.data.images || [],
      });
      setLoading(false);
    } catch (error) {
      toast.error('Error loading listing');
      router.push('/host/dashboard');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((a) => a !== value),
    }));
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'amenities') {
        value.forEach((a) => formData.append('amenities', a));
      } else if (key === 'images') {
        // skip, handled below
      } else {
        formData.append(key, value);
      }
    });
    newImages.forEach((file) => formData.append('images', file));
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings/${id}`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Listing updated successfully');
      router.push('/host/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error updating listing');
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <BackToDashboardButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Listing</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (per night)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Guests</label>
              <input
                type="number"
                name="maxGuests"
                value={form.maxGuests}
                onChange={handleChange}
                required
                min={1}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                required
                min={1}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                required
                min={0.5}
                step={0.5}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Wifi', 'TV', 'Kitchen', 'Washer', 'Free parking', 'Air conditioning', 'Workspace', 'Pool', 'Gym'].map((amenity) => (
                <label key={amenity} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    value={amenity}
                    checked={form.amenities.includes(amenity)}
                    onChange={handleAmenitiesChange}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Images</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((img, idx) => (
                <img key={idx} src={img} alt="Listing" className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Add/Replace Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 