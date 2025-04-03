
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
  disabled
}) => {
  return (
    <div className="flex justify-center">
      {isProcessing ? (
        <Button 
          disabled 
          className="h-12 w-12 rounded-full p-0 flex items-center justify-center"
        >
          <Loader2 className="h-6 w-6 animate-spin" />
        </Button>
      ) : isRecording ? (
        <Button 
          onClick={onStopRecording}
          className="h-12 w-12 rounded-full p-0 bg-red-500 hover:bg-red-600 flex items-center justify-center animate-pulse-light"
        >
          <Square className="h-5 w-5" />
        </Button>
      ) : (
        <Button 
          onClick={onStartRecording}
          disabled={disabled}
          className="h-12 w-12 rounded-full p-0 bg-farm-green hover:bg-farm-green/90 flex items-center justify-center"
        >
          <Mic className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default VoiceRecorder;
