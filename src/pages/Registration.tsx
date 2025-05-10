
import React, { useState } from 'react';
import VideoFeed from '@/components/VideoFeed';
import FaceRegistrationForm from '@/components/FaceRegistrationForm';
import RegisteredFacesList from '@/components/RegisteredFacesList';
import { useToast } from "@/hooks/use-toast";
import { registerFace, getAllFaces, RegisteredFace } from '@/services/faceService';

const Registration = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [registeredFaces, setRegisteredFaces] = useState<RegisteredFace[]>(getAllFaces());
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleCapture = (imageSrc: string) => {
    setCapturedImage(imageSrc);
  };

  const handleClearImage = () => {
    setCapturedImage(null);
  };

  const handleRegisterFace = async (name: string, image: string) => {
    try {
      setIsProcessing(true);
      const newFace = await registerFace(name, image);
      
      setRegisteredFaces(prev => [...prev, newFace]);
      setCapturedImage(null);
      
      toast({
        title: "Face registered",
        description: `${name} has been successfully registered`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was a problem registering this face",
        variant: "destructive"
      });
      console.error("Registration error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Face Registration</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <VideoFeed 
            onCapture={handleCapture}
            showControls={true}
          />
          <FaceRegistrationForm 
            capturedImage={capturedImage}
            onRegister={handleRegisterFace}
            onClearImage={handleClearImage}
          />
        </div>
        
        <div>
          <RegisteredFacesList faces={registeredFaces} />
        </div>
      </div>
    </div>
  );
};

export default Registration;
