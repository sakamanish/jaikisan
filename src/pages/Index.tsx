
import React from 'react';
import Header from '@/components/Header';
import Chatbot from '@/components/Chatbot';
import { Toaster } from "sonner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-farm-beige to-farm-light-green/40">
      <Toaster position="top-center" />
      <Header />
      
      <main className="flex-1 container mx-auto p-4 flex flex-col items-center">
        <div className="w-full max-w-md mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-farm-green mb-3">Farmer's Voice Assistant</h2>
          <p className="text-gray-600 text-lg">
            Get quick, simple farming advice in your language
          </p>
        </div>
        
        <Chatbot />
      </main>
      
      <footer className="bg-farm-soil text-white p-5 text-center mt-8">
        <div className="container mx-auto">
          <p className="text-sm md:text-base">© 2023 किसान वाणी साथी - Helping farmers through voice technology</p>
          <p className="text-xs mt-1 text-white/70">Providing multilingual agricultural advice across India</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
