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
      className={`p-2 rounded-full transition-colors ${
        isFavorite
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      } ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill={isFavorite ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </motion.button>
  );
};

export default FavoriteButton;
