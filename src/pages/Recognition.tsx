
import React, { useState, useEffect, useRef } from 'react';
import VideoFeed from '@/components/VideoFeed';
import { recognizeFaces } from '@/services/faceService';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Recognition = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedFaces, setDetectedFaces] = useState<Array<{
    name: string;
    confidence: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>>([]);
  const processingInterval = useRef<number | null>(null);
  const { toast } = useToast();
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (processingInterval.current !== null) {
        clearInterval(processingInterval.current);
      }
    };
  }, []);

  const startProcessing = () => {
    setIsProcessing(true);
    toast({
      title: "Recognition Started",
      description: "Scanning for recognized faces..."
    });
    
    // Capture a frame every 1 second and recognize faces
    processingInterval.current = window.setInterval(async () => {
      try {
        const canvas = document.createElement('canvas');
        const video = document.querySelector('video');
        
        if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/png');
            
            const faces = await recognizeFaces(imageData);
            if (faces.length > 0 && faces.length !== detectedFaces.length) {
              toast({
                title: `${faces.length} Face${faces.length > 1 ? 's' : ''} Detected`,
                description: "Recognition results updated"
              });
            }
            setDetectedFaces(faces);
          }
        }
      } catch (error) {
        console.error('Error during face recognition:', error);
        toast({
          title: "Recognition Error",
          description: "An error occurred during face processing",
          variant: "destructive"
        });
      }
    }, 1000);
  };
  
  const stopProcessing = () => {
    setIsProcessing(false);
    setDetectedFaces([]);
    
    if (processingInterval.current !== null) {
      clearInterval(processingInterval.current);
      processingInterval.current = null;
    }
    
    toast({
      title: "Recognition Stopped",
      description: "Face detection has been turned off"
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Live Recognition</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoFeed 
            showControls={false} 
            processingFeed={isProcessing}
            detectedFaces={detectedFaces}
          />
          
          <div className="mt-4 flex justify-center space-x-4">
            {!isProcessing ? (
              <Button 
                onClick={startProcessing} 
                className="bg-brand-blue hover:bg-brand-darkBlue"
              >
                Start Face Recognition
              </Button>
            ) : (
              <Button 
                onClick={stopProcessing} 
                variant="outline"
              >
                Stop Recognition
              </Button>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Recognition Results</h3>
          </div>
          
          <div className="p-4">
            {!isProcessing && (
              <div className="py-8 text-center text-gray-400">
                <p>Start recognition to see results</p>
              </div>
            )}
            
            {isProcessing && detectedFaces.length === 0 && (
              <div className="py-8 text-center text-gray-400">
                <p>No faces detected</p>
              </div>
            )}
            
            {isProcessing && detectedFaces.length > 0 && (
              <ul className="divide-y">
                {detectedFaces.map((face, index) => (
                  <li key={index} className="py-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{face.name}</span>
                      <span className="text-sm bg-brand-blue/10 text-brand-blue px-2 py-1 rounded-full">
                        {Math.round(face.confidence * 100)}% match
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recognition;
