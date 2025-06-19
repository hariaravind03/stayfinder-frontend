import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';
import BackButton from '../components/BackButton';
import OTPVerification from '../components/OTPVerification';
import { toast } from 'react-hot-toast';
import { FaArrowLeft } from 'react-icons/fa';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/\d/.test(password)) {
      return 'Password must contain a number';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain an uppercase letter';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'password') {
      setPasswordError(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEmailVerified) {
      toast.error('Please verify your email first');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      toast.error(passwordValidationError);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      toast.success('Registration successful!');
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = error.response.data.errors.map(err => err.msg);
        toast.error(errorMessages.join(', '));
      } else {
        toast.error(error.response?.data?.error || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <BackButton />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {!isEmailVerified && (
                <div className="mt-2">
                  <OTPVerification 
                    email={formData.email} 
                    onVerificationComplete={setIsEmailVerified} 
                  />
                </div>
              )}
              {isEmailVerified && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Email verified
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                  passwordError ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                Password requirements:
                <ul className="list-disc list-inside">
                  <li>At least 6 characters long</li>
                  <li>Contains at least one number</li>
                  <li>Contains at least one uppercase letter</li>
                </ul>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                I want to
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="user">Book a stay</option>
                <option value="host">List my property</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !isEmailVerified || !!passwordError}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 