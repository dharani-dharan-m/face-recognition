
import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, Video, VideoOff } from 'lucide-react';
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
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  onCapture, 
  showControls = true, 
  processingFeed = false,
  detectedFaces = []
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Clean up stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      setCapturedImage(null); // Clear any previous capture

      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser doesn't support accessing the camera");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user" 
        },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for metadata to be loaded before playing
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Camera started successfully");
                setCameraActive(true);
                setStream(mediaStream);
              })
              .catch(e => {
                console.error("Error playing video:", e);
                setError("Error playing video stream: " + e.message);
              });
          }
        };
      } else {
        console.error("Video element reference is null");
        setError("Could not initialize video element");
      }
    } catch (err: any) {
      console.error("Error accessing webcam:", err);
      setError(`Failed to access webcam: ${err.message || "Unknown error"}. Please ensure you have granted camera permissions.`);
      toast({
        title: "Camera Error",
        description: "Failed to access webcam. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log("Camera track stopped:", track.label);
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
      setCameraActive(false);
      console.log("Camera stopped");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current && onCapture) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Ensure video is playing and has dimensions
      if (!video.videoWidth) {
        console.error("Video not ready for capture");
        setError("Video not ready for capture");
        return;
      }
      
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image
        const imageSrc = canvas.toDataURL('image/png');
        setCapturedImage(imageSrc);
        onCapture(imageSrc);
        
        toast({
          title: "Image Captured",
          description: "Face image has been captured successfully",
        });
      }
    } else {
      console.error("Cannot capture image: video or canvas ref missing");
      setError("Cannot capture image at this time");
    }
  };

  // Draw face boxes on video
  useEffect(() => {
    if (!processingFeed || !videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    let animationFrame: number;
    
    const drawBoxes = () => {
      if (!videoRef.current || !video.videoWidth) {
        animationFrame = requestAnimationFrame(drawBoxes);
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the video frame first
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Draw bounding boxes and labels
      if (detectedFaces && detectedFaces.length > 0) {
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
      }
      
      animationFrame = requestAnimationFrame(drawBoxes);
    };
    
    if (cameraActive) {
      drawBoxes();
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [processingFeed, detectedFaces, cameraActive]);

  return (
    <div className="border rounded-lg overflow-hidden bg-gray-50 relative">
      <div className="aspect-video relative">
        {cameraActive ? (
          <>
            <video 
              ref={videoRef} 
              className={`w-full h-full object-cover ${processingFeed || capturedImage ? 'hidden' : ''}`}
              autoPlay 
              playsInline
              muted
            />
            <canvas 
              ref={canvasRef} 
              className={`absolute top-0 left-0 w-full h-full ${processingFeed ? '' : 'hidden'}`}
            />
            
            {capturedImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-2 rounded-lg shadow-lg max-w-sm">
                  <img 
                    src={capturedImage} 
                    alt="Captured face" 
                    className="max-w-full h-auto rounded"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <CameraOff className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">Camera inactive</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50/80">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm">
              <p className="text-red-500">{error}</p>
              <Button 
                onClick={() => setError(null)} 
                variant="outline" 
                className="mt-2 w-full"
              >
                Dismiss
              </Button>
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
            <Button 
              onClick={startCamera} 
              className="bg-brand-blue hover:bg-brand-darkBlue flex items-center gap-2"
            >
              <Camera size={18} />
              Start Camera
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={stopCamera} variant="outline" className="flex items-center gap-2">
                <CameraOff size={18} />
                Stop Camera
              </Button>
              {onCapture && (
                <Button 
                  onClick={captureImage} 
                  className="bg-brand-green hover:bg-green-700 flex items-center gap-2"
                  disabled={!!capturedImage}
                >
                  {capturedImage ? 'Image Captured' : 'Capture Face'}
                </Button>
              )}
              {capturedImage && (
                <Button 
                  onClick={() => setCapturedImage(null)} 
                  variant="outline" 
                  className="ml-2"
                >
                  Clear Image
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
