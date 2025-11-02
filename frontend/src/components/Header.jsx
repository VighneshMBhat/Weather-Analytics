import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleUnit, selectUnit } from '../features/settings/settingsSlice';
import { signInWithGoogle, signOut, selectUser } from '../features/auth/authSlice';
import ThemeToggle from './ThemeToggle';

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
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-gray-900/75 border-b border-gray-200/20 dark:border-gray-700/20 shadow-soft transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-semibold tracking-tight bg-gradient-1 bg-clip-text text-transparent"
            >
              <span className="text-3xl mr-2 filter drop-shadow-lg">🌤️</span>
              Weather Analytics
            </motion.h1>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Unit Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 122, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUnitToggle}
              className="relative px-4 py-2 rounded-xl bg-surface-light dark:bg-surface-dark backdrop-blur-sm border border-primary/20 dark:border-primary/30 hover:border-primary/40 dark:hover:border-primary/50 transition-all duration-300 font-semibold text-gray-700 dark:text-gray-200 shadow-soft overflow-hidden group"
              aria-label="Toggle temperature unit"
            >
              <span className="relative z-10 text-lg">{unit === 'metric' ? '°C' : '°F'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300" />
            </motion.button>

            {/* Sign In / User Profile */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0, 122, 255, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAuth}
              className="relative px-5 py-2 rounded-xl bg-gradient-1 hover:shadow-glow text-white font-semibold transition-all duration-300 flex items-center space-x-2 shadow-soft overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {user ? (
                <>
                  <span className="hidden sm:inline relative z-10">{user.email?.split('@')[0]}</span>
                  <span className="relative z-10">Sign Out</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="relative z-10">Sign In</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
