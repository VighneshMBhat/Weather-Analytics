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
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* Animated Aurora Gradient Background */}
      <div className="absolute inset-0 bg-gradient-aurora animate-aurora" />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
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

          {/* Title with Gradient */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-4"
            style={{
              background: 'linear-gradient(90deg, #6C63FF, #00D4FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
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
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-purple-600 bg-white rounded-full shadow-2xl hover:shadow-glow transform hover:scale-105 transition-all duration-300"
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
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(90deg, rgba(108,99,255,0.3), rgba(0,212,255,0.3))',
                  filter: 'blur(8px)',
                }}
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

        {/* Floating Weather Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-20 left-10 text-7xl opacity-40"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255, 200, 0, 0.5))' }}
          >
            ☀️
          </motion.div>
          <motion.div
            animate={{
              y: [0, 25, 0],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-40 right-20 text-6xl opacity-50"
            style={{ filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))' }}
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-32 left-1/4 text-5xl opacity-40"
            style={{ filter: 'drop-shadow(0 0 15px rgba(0, 212, 255, 0.4))' }}
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute bottom-20 right-1/4 text-6xl opacity-45"
            style={{ filter: 'drop-shadow(0 0 20px rgba(255, 200, 0, 0.5))' }}
          >
            ☀️
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Feature Card Component with Enhanced Glassmorphism
function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="relative group rounded-2xl p-6 text-white transition-all duration-300 overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(18px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      {/* Glowing hover effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(108,99,255,0.2), rgba(0,212,255,0.2))',
          filter: 'blur(20px)',
        }}
      />
      <div className="relative z-10">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-white/90">{description}</p>
      </div>
    </motion.div>
  );
}

export default Landing;
