import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import { BackToDashboardButton } from '../../components/BackButton';

export default function CreateListing() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    maxGuests: '',
    bedrooms: '',
    bathrooms: '',
    amenities: [''],
  });
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          formData.amenities.forEach(amenity => {
            formDataToSend.append('amenities', amenity);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append all images
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/listings`,
        formDataToSend,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success('Listing created successfully!');
      router.push('/host/dashboard');
    } catch (error) {
      if (error.response?.status === 401) {
        router.push('/login');
        return;
      }
      toast.error(error.response?.data?.error || 'Error creating listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...formData.amenities];
    newAmenities[index] = value;
    setFormData({ ...formData, amenities: newAmenities });
  };

  const addAmenityField = () => {
    setFormData({ ...formData, amenities: [...formData.amenities, ''] });
  };

  const removeAmenityField = (index) => {
    const newAmenities = formData.amenities.filter((_, i) => i !== index);
    setFormData({ ...formData, amenities: newAmenities });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
      <BackToDashboardButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Listing</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price per night ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Max Guests</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.maxGuests}
                  onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bedrooms</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bathrooms</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {imagePreview.map((preview, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-w-16 aspect-h-9 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <FaPlus className="mx-auto h-8 w-8 text-gray-400" />
                    <span className="mt-2 block text-sm text-gray-600">Add Image</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Upload up to 10 images. Supported formats: JPG, JPEG, PNG, WEBP</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Wifi', 'TV', 'Kitchen', 'Washer', 'Free parking', 'Air conditioning', 'Workspace', 'Pool', 'Gym'].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={amenity}
                      checked={formData.amenities.includes(amenity)}
                      onChange={e => {
                        const checked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          amenities: checked
                            ? [...prev.amenities, amenity]
                            : prev.amenities.filter(a => a !== amenity),
                        }));
                      }}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 