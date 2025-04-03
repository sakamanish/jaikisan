
import React from 'react';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { Toaster } from "sonner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-farm-beige to-farm-light-green/20">
      <Toaster position="top-center" />
      <Header />
      
      <main className="flex-1 container mx-auto p-4 flex flex-col items-center">
        <div className="w-full max-w-md mb-6 text-center">
          <h2 className="text-2xl font-bold text-farm-green mb-2">Farmer's Voice Assistant</h2>
          <p className="text-gray-600">
            Ask questions about farming, crops, weather, or any agricultural concerns
          </p>
        </div>
        
        <Chatbot />
      </main>
      
      <footer className="bg-farm-soil text-white p-4 text-center text-sm">
        <p>© 2023 किसान वाणी साथी - Helping farmers through voice technology</p>
      </footer>
    </div>
  );
};

export default Index;
