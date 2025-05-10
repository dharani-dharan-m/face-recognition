
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FaceRegistrationFormProps {
  capturedImage: string | null;
  onRegister: (name: string, image: string) => void;
  onClearImage: () => void;
}

const FaceRegistrationForm: React.FC<FaceRegistrationFormProps> = ({ 
  capturedImage, 
  onRegister,
  onClearImage
}) => {
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter a name for this face",
        variant: "destructive"
      });
      return;
    }
    
    if (!capturedImage) {
      toast({
        title: "No image captured",
        description: "Please capture a face image before registering",
        variant: "destructive"
      });
      return;
    }
    
    onRegister(name.trim(), capturedImage);
    setName('');
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Register New Face</h3>
      </div>
      
      <div className="p-4">
        {capturedImage ? (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="preview" className="text-sm text-gray-600">Image Preview</Label>
              <Button variant="ghost" size="sm" onClick={onClearImage}>
                Clear
              </Button>
            </div>
            <div className="border rounded overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured face" 
                className="w-full h-auto max-h-[200px] object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="mb-4 p-6 border rounded-md flex items-center justify-center">
            <p className="text-gray-400">No image captured yet</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name" className="text-sm text-gray-600">
              Person Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter person's name"
              className="mt-1"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-brand-blue hover:bg-brand-darkBlue" 
            disabled={!capturedImage}
          >
            Register Face
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FaceRegistrationForm;
