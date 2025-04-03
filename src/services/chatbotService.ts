
import { toast } from "sonner";

// Define interface for chat messages
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// API Key from the user input
const API_KEY = "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";
const API_ENDPOINT = "https://models.inference.ai.azure.com";
const MODEL_NAME = "gpt-4o";

// Languages supported by the chatbot
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", voiceName: "en-IN" },
  { code: "hi", name: "हिंदी (Hindi)", voiceName: "hi-IN" },
  { code: "ta", name: "தமிழ் (Tamil)", voiceName: "ta-IN" },
  { code: "te", name: "తెలుగు (Telugu)", voiceName: "te-IN" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)", voiceName: "kn-IN" },
  { code: "ml", name: "മലയാളം (Malayalam)", voiceName: "ml-IN" },
  { code: "bn", name: "বাংলা (Bengali)", voiceName: "bn-IN" },
  { code: "mr", name: "मराठी (Marathi)", voiceName: "mr-IN" },
  { code: "gu", name: "ગુજરાતી (Gujarati)", voiceName: "gu-IN" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjabi)", voiceName: "pa-IN" }
];

// Function to get the chatbot response
export const getChatbotResponse = async (
  messages: ChatMessage[],
  language: string
): Promise<string> => {
  try {
    // System message to instruct the AI to respond in the selected language
    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are a helpful agricultural assistant for farmers.
      Provide SHORT and DIRECT advice on farming techniques, crop diseases, weather considerations, and best practices.
      IMPORTANT: Your response MUST be in ${language} language - do not mix with English.
      Keep responses very brief (3-5 short points maximum) with only key actionable points.
      DO NOT use any markdown formatting, asterisks, hashtags or bullet point symbols - use simple text only.
      Use plain formatting - no headings, no bullet points with symbols.
      Speak directly to the farmer with simple practical steps they can take immediately.
      Use simple words that farmers will understand.
      If you don't know something, say so briefly.`
    };

    // Prepare messages for the API request
    const apiMessages = [systemMessage, ...messages];

    // Make API request
    const response = await fetch(API_ENDPOINT + "/openai/deployments/" + MODEL_NAME + "/chat/completions?api-version=2023-05-15", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": API_KEY
      },
      body: JSON.stringify({
        messages: apiMessages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800,
        model: MODEL_NAME  // Include model name explicitly
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    toast.error("Failed to get response. Please try again.");
    return "Sorry, I'm having trouble connecting right now. Please try again later.";
  }
};

// Function to handle text-to-speech
export const speakText = (text: string, language: string): void => {
  // Find the language voice name
  const lang = SUPPORTED_LANGUAGES.find(lang => lang.code === language)?.voiceName || 'en-IN';
  
  // Cancel any ongoing speech
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  // Clean text before speaking (remove markdown formatting)
  const cleanText = text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/^-\s+/gm, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for clarity
  
  // Log speech details for debugging
  console.log(`Speaking in language: ${lang}, text length: ${cleanText.length} chars`);
  
  window.speechSynthesis.speak(utterance);
};

// Function to initialize speech recognition
export const initializeSpeechRecognition = (
  language: string,
  onResult: (text: string) => void,
  onEnd: () => void,
  onError: (error: string) => void
): SpeechRecognition | null => {
  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    toast.error("Speech recognition is not supported in your browser");
    return null;
  }

  // Find the language voice name
  const lang = SUPPORTED_LANGUAGES.find(lang => lang.code === language)?.voiceName || 'en-IN';
  
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
};
