import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  addFavoriteCity,
  removeFavoriteCity,
  selectIsFavorite,
} from '../features/favorites/favoritesSlice';
import { selectSession } from '../features/auth/authSlice';

const FavoriteButton = ({ cityName, lat, lon, className = '' }) => {
  const dispatch = useDispatch();
  const session = useSelector(selectSession);
  const isFavorite = useSelector((state) => selectIsFavorite(state, cityName));

  const handleToggle = async (e) => {
    e.stopPropagation(); // Prevent triggering parent click events

    const token = session?.access_token;
    console.log(' Favorite button clicked for:', cityName);
    console.log('📋 Session:', session ? 'Present' : 'NO SESSION');
    console.log('🔑 Token:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
    console.log('📍 Coordinates:', { lat, lon });

    if (isFavorite) {
      dispatch(removeFavoriteCity({ token, cityName }));
    } else {
      dispatch(addFavoriteCity({ token, cityName, lat, lon }));
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className={`relative p-2 rounded-full transition-all duration-300 ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {/* Gradient glow when favorited */}
      {isFavorite && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-2 opacity-20 blur-sm"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
      
      {/* Heart icon */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 relative z-10"
        fill={isFavorite ? 'url(#heartGradient)' : 'none'}
        viewBox="0 0 24 24"
        stroke={isFavorite ? 'none' : 'currentColor'}
        strokeWidth={2}
        animate={isFavorite ? {
          scale: [1, 1.2, 1],
        } : {}}
        transition={isFavorite ? {
          duration: 0.3,
        } : {}}
      >
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#FFD93D" />
          </linearGradient>
        </defs>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          className={isFavorite ? '' : 'text-gray-400 dark:text-gray-500 hover:text-accent transition-colors'}
        />
      </motion.svg>
    </motion.button>
  );
};

export default FavoriteButton;
