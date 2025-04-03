
import React, { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import VoiceRecorder from './VoiceRecorder';
import LanguageSelector from './LanguageSelector';
import { ChatMessage as ChatMessageType, getChatbotResponse, speakText, initializeSpeechRecognition, SUPPORTED_LANGUAGES } from '../services/chatbotService';

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    { role: 'assistant', content: "Hello! I'm your farming assistant. Ask me about crops, soil, or farming methods. I'll give you simple, practical advice." }
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Load speech synthesis voices when component mounts
  useEffect(() => {
    // This is needed because in some browsers, voices aren't loaded immediately
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
      console.log("Speech synthesis voices loaded");
    };
    
    loadVoices();
    
    // Some browsers (like Chrome) need an event listener to get the voices
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stop recording if component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Speak the welcome message on initial load
  useEffect(() => {
    // Small timeout to ensure speech synthesis is ready
    const timer = setTimeout(() => {
      speakText(messages[0].content, selectedLanguage);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    
    // Find the language name
    const languageName = SUPPORTED_LANGUAGES.find(lang => lang.code === language)?.name.split(' ')[0] || 'English';
    
    // Create welcome message for the new language
    let welcomeMessage = `I'll now speak in ${languageName}. How can I help with your farming?`;
    
    // Add a system message indicating the language change
    const newMessages: ChatMessageType[] = [
      ...messages,
      { 
        role: 'assistant', 
        content: welcomeMessage
      }
    ];
    
    setMessages(newMessages);
    
    // Speak the language change confirmation
    speakText(welcomeMessage, language);
  };

  const handleStartRecording = () => {
    // Initialize speech recognition
    recognitionRef.current = initializeSpeechRecognition(
      selectedLanguage,
      (text) => {
        handleUserMessage(text);
      },
      () => {
        setIsRecording(false);
      },
      (error) => {
        toast.error(`Speech recognition error: ${error}`);
        setIsRecording(false);
      }
    );

    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleUserMessage = async (content: string) => {
    if (!content.trim()) {
      return; // Don't process empty messages
    }
    
    // Add user message
    const userMessage: ChatMessageType = { role: 'user', content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    
    // Start processing
    setIsProcessing(true);
    
    try {
      // Get response from chatbot
      const response = await getChatbotResponse(
        newMessages,
        selectedLanguage
      );
      
      // Add assistant message
      const assistantMessage: ChatMessageType = { role: 'assistant', content: response };
      setMessages([...newMessages, assistantMessage]);
      
      // Speak the response
      speakText(response, selectedLanguage);
    } catch (error) {
      console.error('Error in chat flow:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[80vh] flex flex-col shadow-lg border-farm-green/20 rounded-xl">
      <CardHeader className="p-4 border-b bg-gradient-to-r from-farm-beige to-farm-light-green/30 rounded-t-xl">
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-medium text-farm-green text-center">Farmer's Voice Assistant</h3>
          <LanguageSelector 
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageChange}
            disabled={isProcessing || isRecording}
          />
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-farm-beige/10">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 border-t space-y-4 bg-white rounded-b-xl">
        <div className="w-full space-y-4">
          <ChatInput 
            onSendMessage={handleUserMessage}
            disabled={isProcessing || isRecording}
          />
          
          <VoiceRecorder
            isRecording={isRecording}
            isProcessing={isProcessing}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            disabled={isProcessing}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
