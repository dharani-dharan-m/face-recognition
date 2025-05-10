
import React from 'react';
import { User } from 'lucide-react';

interface RegisteredFace {
  id: string;
  name: string;
  image: string;
  timestamp: string;
}

interface RegisteredFacesListProps {
  faces: RegisteredFace[];
}

const RegisteredFacesList: React.FC<RegisteredFacesListProps> = ({ faces }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium">Registered Faces</h3>
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
          {faces.length} {faces.length === 1 ? 'person' : 'people'}
        </span>
      </div>
      
      <div className="p-4">
        {faces.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <User className="mx-auto h-12 w-12 mb-2 opacity-30" />
            <p>No faces registered yet</p>
          </div>
        ) : (
          <ul className="divide-y">
            {faces.map((face) => (
              <li key={face.id} className="py-3 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={face.image} 
                    alt={face.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{face.name}</p>
                  <p className="text-xs text-gray-500">Registered: {face.timestamp}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RegisteredFacesList;
