
import React from 'react';
import { ChatMessage as ChatMessageType } from '../services/chatbotService';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'} mb-2 p-3 rounded-lg max-w-[80%] ${isUser ? 'ml-auto bg-farm-green text-white' : 'mr-auto bg-white border border-gray-200'}`}>
      <div className="text-sm md:text-base whitespace-pre-wrap">
        {message.content || "Loading..."}
      </div>
    </div>
  );
};

export default ChatMessage;
