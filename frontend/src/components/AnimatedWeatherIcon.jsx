import React from 'react';
import { motion } from 'framer-motion';

const AnimatedWeatherIcon = ({ condition, className = "w-16 h-16" }) => {
  const getIconAnimation = () => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return {
          animate: { rotate: 360 },
          transition: { duration: 20, repeat: Infinity, ease: "linear" },
        };
      case 'cloudy':
      case 'overcast':
      case 'partly cloudy':
        return {
          animate: { x: [-5, 5, -5] },
          transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        };
      case 'rain':
      case 'rainy':
      case 'drizzle':
        return {
          animate: { y: [0, 5, 0] },
          transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
        };
      case 'snow':
      case 'snowy':
        return {
          animate: { y: [0, 10, 0], rotate: [0, 10, -10, 0] },
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        };
      default:
        return {
          animate: { scale: [1, 1.05, 1] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        };
    }
  };

  const getSVGIcon = () => {
    const cond = condition?.toLowerCase() || '';
    
    if (cond.includes('sun') || cond.includes('clear')) {
      return (
        <svg className={`${className} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    
    if (cond.includes('cloud')) {
      return (
        <svg className={`${className} text-gray-400`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
        </svg>
      );
    }
    
    if (cond.includes('rain') || cond.includes('drizzle')) {
      return (
        <svg className={`${className} text-blue-400`} fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.5 15a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 15h-8zm2-2a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zm4 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    
    if (cond.includes('snow')) {
      return (
        <svg className={`${className} text-cyan-300`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zm6-5a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0116 10zm-11 0a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zm9.192-4.192a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0zm-6.384 6.384a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0z" />
        </svg>
      );
    }
    
    // Default icon
    return (
      <svg className={`${className} text-gray-500`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
      </svg>
    );
  };

  const animation = getIconAnimation();

  return (
    <motion.div
      className="inline-block"
      {...animation}
    >
      {getSVGIcon()}
    </motion.div>
  );
};

export default AnimatedWeatherIcon;
