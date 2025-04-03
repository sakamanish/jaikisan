
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
      Provide practical advice on farming techniques, crop diseases, weather considerations, and best practices.
      Your answers must be clear, concise, and in ${language} language. 
      Keep responses brief with only key actionable points - no hashtags, no lengthy explanations.
      Format responses in short bullet points with simple language for farmers.
      Avoid using markdown formatting like headings, bullet points with symbols, or unnecessary formatting.
      Speak directly to the farmer with practical steps they can take immediately.
      If you don't know something, admit it clearly rather than providing incorrect information.`
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
        model: MODEL_NAME  // Add model explicitly in the request body
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

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for clarity
  
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
