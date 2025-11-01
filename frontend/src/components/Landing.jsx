import React from 'react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { signInWithGoogle } from '../features/auth/authSlice';

function Landing() {
  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      await dispatch(signInWithGoogle()).unwrap();
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert('Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* App Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-8xl mb-6"
          >
            🌤️
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            Weather Analytics
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 mb-12"
          >
            Real-time weather insights with beautiful visualizations
          </motion.p>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto"
          >
            <FeatureCard
              icon="🌍"
              title="Global Coverage"
              description="Weather data for cities worldwide"
              delay={0.9}
            />
            <FeatureCard
              icon="📊"
              title="Interactive Charts"
              description="Visualize temperature, precipitation, and wind"
              delay={1.0}
            />
            <FeatureCard
              icon="⭐"
              title="Favorite Cities"
              description="Save and track your favorite locations"
              delay={1.1}
            />
            <FeatureCard
              icon="🔔"
              title="Real-time Updates"
              description="Auto-refresh every 60 seconds"
              delay={1.2}
            />
            <FeatureCard
              icon="🌡️"
              title="AQI Monitoring"
              description="Air Quality Index tracking included"
              delay={1.3}
            />
            <FeatureCard
              icon="📅"
              title="Forecast & History"
              description="View past, current, and future weather"
              delay={1.4}
            />
          </motion.div>

          {/* Sign In Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
          >
            <button
              onClick={handleSignIn}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-purple-600 bg-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <svg
                className="w-6 h-6 mr-3"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
              <motion.span
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"
                initial={false}
              />
            </button>
          </motion.div>

          {/* Info Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="mt-6 text-white/70 text-sm"
          >
            Sign in to save your favorite cities and access personalized features
          </motion.p>
        </motion.div>

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 left-10 text-6xl opacity-20"
          >
            ☀️
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-40 right-20 text-5xl opacity-20"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-32 left-1/4 text-4xl opacity-20"
          >
            🌧️
          </motion.div>
          <motion.div
            animate={{
              y: [0, 15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-20 right-1/3 text-5xl opacity-20"
          >
            ⛈️
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white hover:bg-white/20 transition-all duration-300 border border-white/20"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </motion.div>
  );
}

export default Landing;
