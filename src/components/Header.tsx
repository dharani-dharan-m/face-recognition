
import React from 'react';

const Header = () => {
  return (
    <header className="bg-brand-blue text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-xl font-bold">F</span>
          </div>
          <h1 className="text-xl font-bold">FaceFriend</h1>
        </div>
        <div className="text-sm opacity-80">AI-Powered Face Recognition</div>
      </div>
    </header>
  );
};

export default Header;
