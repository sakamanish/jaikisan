
import React from 'react';
import { ChatMessage as ChatMessageType } from '../services/chatbotService';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`chat-bubble ${isUser ? 'chat-bubble-user' : 'chat-bubble-bot'}`}>
      <p className="text-sm md:text-base">{message.content}</p>
    </div>
  );
};

export default ChatMessage;
