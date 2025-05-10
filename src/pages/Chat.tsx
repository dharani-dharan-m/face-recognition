
import React, { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { processChatMessage, Message } from '@/services/chatService';
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (text: string) => {
    // Add user message to the chat
    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      text: text,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Process message through RAG system
      const botResponse = await processChatMessage(text);
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'bot',
        text: "Sorry, I encountered an error while processing your message.",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Chat Assistant</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatInterface 
            onSendMessage={handleSendMessage} 
            messages={messages}
            isLoading={isLoading}
          />
        </div>
        
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Sample Questions</h3>
          </div>
          
          <div className="p-4">
            <ul className="space-y-2">
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" 
                  onClick={() => handleSendMessage("Who was the last person registered?")}>
                "Who was the last person registered?"
              </li>
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSendMessage("How many people are currently registered?")}>
                "How many people are currently registered?"
              </li>
              <li className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSendMessage("At what time was John registered?")}>
                "At what time was John registered?"
              </li>
            </ul>
            
            <p className="mt-4 text-xs text-gray-500">
              Click on any question to ask it automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
