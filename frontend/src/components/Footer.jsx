import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-gray-600">
          <p className="text-sm">
            Weather data provided by OpenWeatherMap API
          </p>
          <p className="text-xs mt-2">
            © {new Date().getFullYear()} Weather Analytics Dashboard. Real-time weather updates every 60 seconds.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
