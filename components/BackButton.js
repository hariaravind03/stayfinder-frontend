import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}

export function BackToDashboardButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/host/dashboard')}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
    >
      <ArrowLeft className="w-4 h-4" />
      Back to Dashboard
    </button>
  );
} 