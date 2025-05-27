import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  userType: yup.string().oneOf(['creator', 'client'], 'Please select a valid user type').required('User type is required'),
  // Conditional fields
  companyName: yup.string().when('userType', {
    is: 'client',
    then: (schema) => schema.required('Company name is required for clients'),
    otherwise: (schema) => schema
  }),
  specialties: yup.array().when('userType', {
    is: 'creator',
    then: (schema) => schema.min(1, 'Please select at least one specialty').required('Specialties are required for creators'),
    otherwise: (schema) => schema
  }),
}).required();

type FormData = yup.InferType<typeof schema>;

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'creator' | 'client'>('creator');
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      userType: 'creator',
      specialties: []
    }
  });
  
  // Watch for userType changes to update the form state
  const watchUserType = watch('userType');
  
  React.useEffect(() => {
    if (watchUserType) {
      setUserType(watchUserType as 'creator' | 'client');
    }
  }, [watchUserType]);
  
  const specialtyOptions = [
    'Fashion', 'Beauty', 'Fitness', 'Tech', 'Food', 
    'Travel', 'Lifestyle', 'Gaming', 'Music', 'Art'
  ];
  
  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      toast.success('Registration successful!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to register');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                I am a:
              </label>
              <div className="mt-1 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    value="creator"
                    {...register('userType')}
                  />
                  <span className="ml-2">Creator</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    value="client"
                    {...register('userType')}
                  />
                  <span className="ml-2">Client</span>
                </label>
              </div>
              {errors.userType && (
                <p className="text-red-500 text-xs mt-1">{errors.userType.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            
            {/* Conditional fields based on user type */}
            {userType === 'client' && (
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  id="companyName"
                  type="text"
                  className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  {...register('companyName')}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>
                )}
              </div>
            )}
            
            {userType === 'creator' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Specialties
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {specialtyOptions.map((specialty) => (
                    <label key={specialty} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        value={specialty}
                        {...register('specialties')}
                      />
                      <span className="ml-2">{specialty}</span>
                    </label>
                  ))}
                </div>
                {errors.specialties && (
                  <p className="text-red-500 text-xs mt-1">{errors.specialties.message}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;