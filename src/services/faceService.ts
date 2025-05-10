
// This is a mock service that simulates face detection and recognition
// In a real implementation, this would connect to a Python backend with face_recognition library

import { v4 as uuidv4 } from 'uuid';

export interface RegisteredFace {
  id: string;
  name: string;
  image: string;
  encoding: number[]; // Simplified - this would be actual face encoding in production
  timestamp: string;
}

// Simulate storage - in production this would be a database
let registeredFaces: RegisteredFace[] = [];

// Generate pseudo-random face encoding (128-dim vector in real face_recognition)
const generateMockEncoding = (): number[] => {
  return Array(128).fill(0).map(() => Math.random() - 0.5);
};

// Calculate Euclidean distance between encodings (simplified)
const calculateDistance = (encoding1: number[], encoding2: number[]): number => {
  return Math.sqrt(
    encoding1.reduce((sum, value, index) => {
      const diff = value - encoding2[index];
      return sum + diff * diff;
    }, 0)
  );
};

export const registerFace = async (name: string, imageData: string): Promise<RegisteredFace> => {
  // Simulate delay for "processing"
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create new face record with random encoding
  const newFace: RegisteredFace = {
    id: uuidv4(),
    name,
    image: imageData,
    encoding: generateMockEncoding(),
    timestamp: new Date().toISOString()
  };
  
  registeredFaces.push(newFace);
  return newFace;
};

export const getAllFaces = (): RegisteredFace[] => {
  return [...registeredFaces];
};

export const recognizeFaces = async (imageData: string): Promise<Array<{name: string, confidence: number, x: number, y: number, width: number, height: number}>> => {
  // Simulate face detection delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // If we don't have any registered faces, return empty
  if (registeredFaces.length === 0) {
    return [];
  }
  
  // Simulate face detection - in real life this would use ML to detect faces
  // and extract encodings from the image
  const mockDetectedFaces = [];
  
  // Randomly decide if we detect any faces (80% chance)
  if (Math.random() < 0.8 && registeredFaces.length > 0) {
    // Simulate 1-3 detected faces with random positions
    const numFaces = Math.min(Math.ceil(Math.random() * 3), registeredFaces.length);
    
    for (let i = 0; i < numFaces; i++) {
      // Randomly pick a registered face
      const randomIndex = Math.floor(Math.random() * registeredFaces.length);
      const matchedFace = registeredFaces[randomIndex];
      
      // Generate slightly modified encoding to simulate real detection variations
      const detectedEncoding = matchedFace.encoding.map(val => val + (Math.random() - 0.5) * 0.1);
      
      // Calculate simulated confidence based on distance
      const distance = calculateDistance(matchedFace.encoding, detectedEncoding);
      const confidence = 1 - Math.min(distance, 1); // Higher is better
      
      // Random position - in real implementation this would be the actual face location
      const x = Math.floor(Math.random() * 400) + 100;
      const y = Math.floor(Math.random() * 300) + 50;
      const width = Math.floor(Math.random() * 100) + 100;
      const height = Math.floor(Math.random() * 100) + 100;
      
      mockDetectedFaces.push({
        name: matchedFace.name,
        confidence,
        x,
        y,
        width,
        height
      });
    }
  }
  
  return mockDetectedFaces;
};

export const clearAllFaces = (): void => {
  registeredFaces = [];
};

// Functions to support RAG queries
export const getLastRegisteredPerson = (): RegisteredFace | null => {
  if (registeredFaces.length === 0) return null;
  
  return [...registeredFaces].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  })[0];
};

export const getPersonRegistrationTime = (name: string): string | null => {
  const person = registeredFaces.find(face => 
    face.name.toLowerCase() === name.toLowerCase()
  );
  
  return person ? person.timestamp : null;
};

export const getRegisteredPersonCount = (): number => {
  return registeredFaces.length;
};
