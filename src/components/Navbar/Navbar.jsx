import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaChevronDown } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ This will detect route changes
  const dropdownRef = useRef();

  useEffect(() => {
    const status = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(status);

    if (status) {
      axios
        .get('http://localhost:5000/auth/api/info', { withCredentials: true })
        .then(res => {
          setUserName(res.data.name);
        })
        .catch(err => {
          console.error('User info fetch failed:', err.response?.data || err.message);
        });
    }
  }, [location.pathname]); 

  useEffect(() => {
    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false); 
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gray-700 text-white px-6 py-4 flex justify-between items-center">
      <FaUsers size={30} />
      <h1 className="text-xl font-semibold">Collaboration App</h1>

      <div className="relative" ref={dropdownRef}>
        {isLoggedIn ? (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="hover:text-yellow-400">{userName}</span>
            <FaChevronDown size={14} />
          </div>
        ) : (
          <Link to="/login" className="hover:text-yellow-400">
            Login
          </Link>
        )}

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg z-20">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
