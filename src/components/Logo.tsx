
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 bg-bank-primary rounded-md flex items-center justify-center">
        <span className="text-white font-bold text-lg">SB</span>
      </div>
      <span className="font-bold text-xl text-bank-primary">SecureBank</span>
    </div>
  );
};

export default Logo;
