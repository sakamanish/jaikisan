
import React from 'react';
import { ChatMessage as ChatMessageType } from '../services/chatbotService';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'} mb-3 p-4 rounded-lg max-w-[85%] ${isUser ? 'ml-auto bg-farm-green text-white shadow-md' : 'mr-auto bg-farm-beige text-black shadow-sm'}`}>
      <div className="text-sm md:text-base whitespace-pre-wrap">
        {message.content || "Loading..."}
      </div>
    </div>
  );
};

export default ChatMessage;
