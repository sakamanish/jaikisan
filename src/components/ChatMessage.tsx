
import React, { useEffect, useState } from 'react';
import { ChatMessage as ChatMessageType } from '../services/chatbotService';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [formattedContent, setFormattedContent] = useState(message.content || "Loading...");
  
  // Process the content to remove markdown formatting
  useEffect(() => {
    if (message.content) {
      // Remove markdown formatting like asterisks, hashes, etc.
      let processed = message.content;
      processed = processed.replace(/\*\*/g, ''); // Remove bold asterisks
      processed = processed.replace(/\*/g, '');   // Remove any remaining asterisks
      processed = processed.replace(/^#+\s*/gm, ''); // Remove heading hashes
      processed = processed.replace(/^-\s+/gm, '• '); // Replace markdown bullet points with simple dots
      
      setFormattedContent(processed);
    }
  }, [message.content]);
  
  return (
    <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'} mb-3 p-4 rounded-lg max-w-[85%] ${isUser ? 'ml-auto bg-farm-green text-white shadow-md' : 'mr-auto bg-farm-beige text-black shadow-sm'}`}>
      <div className="text-sm md:text-base whitespace-pre-wrap">
        {formattedContent}
      </div>
    </div>
  );
};

export default ChatMessage;
