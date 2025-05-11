
import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VideoFeedProps {
  onCapture?: (imageSrc: string) => void;
  showControls?: boolean;
  processingFeed?: boolean;
  detectedFaces?: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  cameraActive?: boolean;
  setCameraActive?: (active: boolean) => void;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  onCapture, 
  showControls = true, 
  processingFeed = false,
  detectedFaces = [],
  cameraActive: externalCameraActive,
  setCameraActive: setExternalCameraActive
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [internalCameraActive, setInternalCameraActive] = useState(false);
  const { toast } = useToast();
  
  // Use either internal or external camera state based on what's provided
  const cameraActive = externalCameraActive !== undefined ? externalCameraActive : internalCameraActive;
  const setCameraActive = setExternalCameraActive || setInternalCameraActive;

  useEffect(() => {
    // Start camera automatically if external control sets it to active
    if (cameraActive && !stream) {
      startCamera();
    } else if (!cameraActive && stream) {
      stopCamera();
    }
    
    // Clean up stream when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop();
        });
        setStream(null);
      }
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      if (stream) {
        // If we already have a stream, stop it first
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      
      console.log("Camera started successfully");
      
      toast({
        title: "Camera active",
        description: "Your camera is now turned on",
      });
    } catch (err) {
      console.error("Error accessing webcam:", err);
      setCameraActive(false);
      toast({
        title: "Camera error",
        description: "Failed to access webcam. Please ensure you have granted camera permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (stream) {
      stream.getTracks().forEach(track => {
        console.log("Stopping track:", track.kind, track.readyState);
        track.stop();
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setStream(null);
      console.log("Camera stopped successfully");
      
      toast({
        title: "Camera inactive",
        description: "Your camera has been turned off",
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && onCapture) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageSrc = canvas.toDataURL('image/png');
        onCapture(imageSrc);
      }
    }
  };

  // Draw face boxes on video
  useEffect(() => {
    if (!processingFeed || !videoRef.current || !canvasRef.current || detectedFaces.length === 0) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    const drawBoxes = () => {
      if (!cameraActive) return; // Don't draw if camera is inactive
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame first
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Draw bounding boxes and labels
      detectedFaces.forEach(face => {
        // Draw box
        context.strokeStyle = '#3B82F6'; // blue border
        context.lineWidth = 2;
        context.strokeRect(face.x, face.y, face.width, face.height);
        
        // Draw background for text
        context.fillStyle = 'rgba(59, 130, 246, 0.7)'; // semi-transparent blue
        context.fillRect(face.x, face.y - 30, face.width, 30);
        
        // Draw text
        context.fillStyle = '#FFFFFF'; // white text
        context.font = '16px sans-serif';
        context.fillText(face.name, face.x + 5, face.y - 10);
      });
      
      if (cameraActive) {
        requestAnimationFrame(drawBoxes);
      }
    };
    
    if (cameraActive) {
      drawBoxes();
    }
    
  }, [processingFeed, detectedFaces, cameraActive]);

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-50 relative">
      <div className="aspect-video relative">
        {cameraActive ? (
          <>
            <video 
              ref={videoRef} 
              className={`w-full h-full object-cover ${processingFeed ? 'hidden' : ''}`}
              autoPlay 
              playsInline
            />
            <canvas 
              ref={canvasRef} 
              className={`absolute top-0 left-0 w-full h-full ${processingFeed ? '' : 'hidden'}`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <CameraOff className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Camera inactive</p>
            </div>
          </div>
        )}
        {processingFeed && (
          <div className="absolute bottom-4 right-4 bg-brand-blue text-white py-1 px-3 rounded-full text-xs animate-pulse">
            Processing
          </div>
        )}
      </div>
      
      {showControls && (
        <div className="p-4 border-t bg-white flex justify-between items-center">
          {!cameraActive ? (
            <Button onClick={startCamera} className="bg-brand-blue hover:bg-brand-darkBlue flex items-center gap-2">
              <Camera className="w-4 h-4" /> Start Camera
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={stopCamera} variant="outline" className="flex items-center gap-2">
                <CameraOff className="w-4 h-4" /> Stop Camera
              </Button>
              {onCapture && (
                <Button onClick={captureImage} className="bg-brand-green hover:bg-green-700 flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Capture Face
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
