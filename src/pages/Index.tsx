
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Header from '@/components/Header';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to FaceFriend</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Register your face, recognize faces in real-time, or chat with our AI assistant about face recognition activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-3">Face Registration</h3>
          <p className="text-gray-600 mb-6">Register new faces by capturing images and assigning names.</p>
          <Button 
            onClick={() => navigate('/registration')} 
            className="w-full bg-brand-blue hover:bg-brand-darkBlue"
          >
            Register Faces
          </Button>
        </div>

        <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-3">Live Recognition</h3>
          <p className="text-gray-600 mb-6">Recognize registered faces in real-time using your camera.</p>
          <Button 
            onClick={() => navigate('/recognition')} 
            className="w-full bg-brand-blue hover:bg-brand-darkBlue"
          >
            Start Recognition
          </Button>
        </div>

        <div className="border rounded-lg p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
          <h3 className="text-xl font-semibold mb-3">AI Chat</h3>
          <p className="text-gray-600 mb-6">Ask questions about registered faces and recognition activities.</p>
          <Button 
            onClick={() => navigate('/chat')} 
            className="w-full bg-brand-blue hover:bg-brand-darkBlue"
          >
            Open Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
