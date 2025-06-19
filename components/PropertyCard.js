import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';

export default function PropertyCard({ property }) {
  return (
    <Link href={`/listings/${property._id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={property.images[0] || '/placeholder-image.jpg'}
            alt={property.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{property.title}</h3>
            <div className="flex items-center">
              <FaStar className="text-yellow-400" />
              <span className="ml-1 text-gray-600">{property.rating || 'New'}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-600 mt-2">
            <FaMapMarkerAlt className="mr-1" />
            <span className="line-clamp-1">{property.location}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">${property.price}</span>
              <span className="text-gray-600"> / night</span>
            </div>
            <div className="text-sm text-gray-500">
              {property.bedrooms} beds • {property.bathrooms} baths
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 