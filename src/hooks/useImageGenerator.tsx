
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ImageGenerationResult {
  loading: boolean;
  imageUrl: string | null;
  error: string | null;
}

export function useImageGenerator() {
  const [results, setResults] = useState<Record<string, ImageGenerationResult>>({});

  const generateImage = useCallback(async (prompt: string, slideId: string) => {
    // If we already have this image and it's not in an error state, don't regenerate
    if (results[slideId]?.imageUrl && !results[slideId]?.error) {
      return results[slideId].imageUrl;
    }

    // Mark this image as loading
    setResults(prev => ({
      ...prev,
      [slideId]: { loading: true, imageUrl: null, error: null }
    }));

    const apiKey = import.meta.env.VITE_CHATGPT_API_KEY;
    if (!apiKey) {
      const error = "OpenAI API key not found. Please add it to your environment variables.";
      toast.error(error);
      setResults(prev => ({
        ...prev,
        [slideId]: { loading: false, imageUrl: null, error }
      }));
      return null;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to generate image");
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      
      // Update the state with the successful result
      setResults(prev => ({
        ...prev,
        [slideId]: { loading: false, imageUrl, error: null }
      }));
      
      return imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Image generation error:", errorMessage);
      toast.error(`Failed to generate image: ${errorMessage}`);
      
      // Update the state with the error
      setResults(prev => ({
        ...prev,
        [slideId]: { loading: false, imageUrl: null, error: errorMessage }
      }));
      
      return null;
    }
  }, [results]);

  return {
    results,
    generateImage
  };
}
