
import React from 'react';
import { Leaf } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-center gap-2 p-4 bg-farm-green text-white">
      <Leaf className="h-6 w-6" />
      <h1 className="text-xl font-bold">किसान वाणी साथी</h1>
      <Leaf className="h-6 w-6" />
    </header>
  );
};

export default Header;
