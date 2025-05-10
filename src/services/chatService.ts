
import { v4 as uuidv4 } from 'uuid';
import { getLastRegisteredPerson, getPersonRegistrationTime, getRegisteredPersonCount } from './faceService';

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

// Simple intent detection for handling user questions
export const processChatMessage = async (message: string): Promise<Message> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const query = message.toLowerCase().trim();
  let response = "I'm sorry, I don't understand that question. You can ask me about registered faces, like 'Who was the last person registered?' or 'How many people are registered?'";
  
  // Last registered person
  if (query.includes("last") && (query.includes("person") || query.includes("registered"))) {
    const lastPerson = getLastRegisteredPerson();
    if (lastPerson) {
      const formattedTime = new Date(lastPerson.timestamp).toLocaleString();
      response = `The last person registered was ${lastPerson.name} at ${formattedTime}.`;
    } else {
      response = "No one has been registered yet.";
    }
  }
  
  // Registration time of a specific person
  else if ((query.includes("when") || query.includes("what time") || query.includes("time")) && 
           query.includes("registered")) {
    // Extract name from query - this is a simplified approach
    const parts = query.split(" ");
    let name = "";
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "was") {
        name = parts[i+1];
        // Check if there might be a last name too
        if (parts[i+2] && !["registered", "added"].includes(parts[i+2])) {
          name += " " + parts[i+2];
        }
        break;
      }
    }
    
    if (name) {
      const timestamp = getPersonRegistrationTime(name);
      if (timestamp) {
        const formattedTime = new Date(timestamp).toLocaleString();
        response = `${name} was registered at ${formattedTime}.`;
      } else {
        response = `I couldn't find anyone named ${name} in the registered faces.`;
      }
    } else {
      response = "Could you please specify whose registration time you're asking about?";
    }
  }
  
  // Number of registered people
  else if ((query.includes("how many") || query.includes("number of")) && 
           (query.includes("people") || query.includes("person") || query.includes("faces") || 
            query.includes("registered"))) {
    const count = getRegisteredPersonCount();
    response = `There ${count === 1 ? 'is' : 'are'} currently ${count} ${count === 1 ? 'person' : 'people'} registered.`;
  }
  
  return {
    id: uuidv4(),
    sender: 'bot',
    text: response,
    timestamp: new Date().toISOString()
  };
};
