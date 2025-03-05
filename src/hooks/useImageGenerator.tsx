
import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

export interface ImageGenerationResult {
  loading: boolean;
  imageUrl: string | null;
  error: string | null;
}

export function useImageGenerator() {
  const [results, setResults] = useState<Record<string, ImageGenerationResult>>({});
  const activeGenerationsRef = useRef<Set<string>>(new Set());

  const generateImage = useCallback(async (prompt: string, slideId: string) => {
    // If we already have this image and it's not in an error state, don't regenerate
    if (results[slideId]?.imageUrl && !results[slideId]?.error) {
      console.log(`Using cached image for slide ${slideId}`);
      return results[slideId].imageUrl;
    }
    
    // If there's already an active generation for this slideId, don't start another one
    if (activeGenerationsRef.current.has(slideId)) {
      console.log(`Skipping duplicate generation request for ${slideId}`);
      return null;
    }
    
    // Mark this image as loading and add to active generations
    setResults(prev => ({
      ...prev,
      [slideId]: { loading: true, imageUrl: null, error: null }
    }));
    
    // Add to active generations using the ref (more reliable than state for async operations)
    activeGenerationsRef.current.add(slideId);
    console.log(`Starting image generation for slide ${slideId}`);

    const apiKey = import.meta.env.VITE_CHATGPT_API_KEY;
    if (!apiKey) {
      const error = "OpenAI API key not found. Please add it to your environment variables.";
      toast.error(error);
      setResults(prev => ({
        ...prev,
        [slideId]: { loading: false, imageUrl: null, error }
      }));
      
      // Remove from active generations
      activeGenerationsRef.current.delete(slideId);
      return null;
    }

    try {
      console.log(`Making API request for slide ${slideId}`);
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
        const errorMessage = errorData.error?.message || `Server responded with ${response.status}`;
        
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again later. (${errorMessage})`);
        } else {
          throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      const imageUrl = data.data[0].url;
      console.log(`Successfully generated image for slide ${slideId}`);
      
      // Update the state with the successful result
      setResults(prev => ({
        ...prev,
        [slideId]: { loading: false, imageUrl, error: null }
      }));
      
      // Remove from active generations
      activeGenerationsRef.current.delete(slideId);
      return imageUrl;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error(`Image generation error for slide ${slideId}:`, errorMessage);
      toast.error(`Failed to generate image: ${errorMessage}`);
      
      // Update the state with the error
      setResults(prev => ({
        ...prev,
        [slideId]: { loading: false, imageUrl: null, error: errorMessage }
      }));
      
      // Remove from active generations
      activeGenerationsRef.current.delete(slideId);
      return null;
    }
  }, [results]);

  // Add a method to clear all active generations (useful for component unmount)
  const clearActiveGenerations = useCallback(() => {
    activeGenerationsRef.current.clear();
  }, []);

  return {
    results,
    generateImage,
    clearActiveGenerations
  };
}
