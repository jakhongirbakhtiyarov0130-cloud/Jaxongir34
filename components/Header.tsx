
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">NotaScan <span className="text-indigo-600">AI</span></span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-500 hover:text-gray-900 font-medium">Bosh sahifa</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 font-medium">Qanday ishlaydi?</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 font-medium">Xizmatlar</a>
          </nav>
          <div className="flex items-center">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-indigo-700 transition shadow-sm">
              Bepul boshlash
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
