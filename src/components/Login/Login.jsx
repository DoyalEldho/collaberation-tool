import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => setShowPass(!showPass);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/api/login',
        { email: data.email, password: data.password },
        { withCredentials: true }
      );

        toast.success('Login successfully!');
      localStorage.setItem('isLoggedIn', 'true');
        navigate('/dashboard',{ replace: true });
      

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-400 flex items-center justify-center px-4">
  <div className="bg-white rounded-xl shadow-md p-10 w-full max-w-md">
    <div className="text-center mb-6">
      <img
        src="https://img.freepik.com/premium-vector/team-collaboration-icon-vector-image-can-be-used-project-assesment_120816-383545.jpg"
        alt="Leave Logo"
        className="w-20 mx-auto mb-3"
      />
      <h2 className="text-2xl font-semibold text-gray-800">Login </h2>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          placeholder="employee@gmail.com"
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address'
            }
          })}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type={showPass ? 'text' : 'password'}
          id="password"
          placeholder="Enter your password"
          className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('password', {
            required: 'Password is required'
          })}
        />
        <span
          onClick={togglePassword}
          className="absolute top-9 right-3 text-gray-500 cursor-pointer"
        >
          {showPass ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
        </span>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition"
      >
        Login
      </button>
    </form>

    <p className="text-sm text-center text-gray-600 mt-4">
      Don’t have an account? <a href="/register" className="text-blue-600 font-medium hover:underline">Register</a>
    </p>
  </div>
</div>

  );
};

export default Login;
