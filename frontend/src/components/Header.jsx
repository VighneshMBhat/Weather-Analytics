import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleUnit, selectUnit } from '../features/settings/settingsSlice';
import { signInWithGoogle, signOut, selectUser } from '../features/auth/authSlice';

const Header = () => {
  const dispatch = useDispatch();
  const unit = useSelector(selectUnit);
  const user = useSelector(selectUser);

  const handleUnitToggle = () => {
    dispatch(toggleUnit());
  };

  const handleAuth = () => {
    if (user) {
      dispatch(signOut());
    } else {
      dispatch(signInWithGoogle());
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-blue-600"
            >
              🌤️ Weather Analytics
            </motion.h1>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Unit Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUnitToggle}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-gray-700"
              aria-label="Toggle temperature unit"
            >
              {unit === 'metric' ? '°C' : '°F'}
            </motion.button>

            {/* Sign In / User Profile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAuth}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors flex items-center space-x-2"
            >
              {user ? (
                <>
                  <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                  <span>Sign Out</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
