import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkSession, setSession } from './features/auth/authSlice';
import supabase from './api/supabaseClient';
import { ThemeProvider } from './context/ThemeContext';
import Landing from './components/Landing';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import CityDetail from './components/CityDetail';

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check for existing session
    dispatch(checkSession());

    // Listen for auth state changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        dispatch(setSession(session));
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [dispatch]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // If not authenticated, show landing page
  if (!user) {
    return (
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  // If authenticated, show main app
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-400">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/city/:cityName" element={<CityDetail />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
