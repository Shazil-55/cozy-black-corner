
import { toast } from "sonner";

// Updated Gemini API constants
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent";

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
  promptFeedback?: {
    blockReason?: string;
  };
}

export interface SyllabusContent {
  modules: {
    title: string;
    lessons: {
      title: string;
      description: string;
    }[];
  }[];
}

/**
 * Analyzes document content using Google's Gemini AI
 */
export async function analyzeSyllabusContent(
  fileContent: string, 
  numClasses: number,
  apiKey: string
): Promise<SyllabusContent | null> {
  try {
    console.log('==================',fileContent);
    
    if (!fileContent) {
      throw new Error("No document content to analyze");
    }

    if (!apiKey) {
      throw new Error("API key is required");
    }

    console.log("Calling Gemini API with model: gemini-1.0-pro");
    console.log("Using API URL:", API_URL);

    const prompt = `
      You are a professional education content developer specializing in creating well-structured course syllabi.
      
      I will provide you with course content, and I need you to organize it into a logical syllabus structure.
      The syllabus should have approximately ${Math.ceil(numClasses / 4)} modules, with each module containing approximately ${Math.min(4, Math.ceil(numClasses / (numClasses / 4)))} lessons for a total of around ${numClasses} lessons.
      
      For each module:
      1. Create a descriptive title that accurately represents the content
      2. Break it down into logical lessons
      
      For each lesson:
      1. Create a clear, descriptive title
      2. Write a brief 1-2 sentence description of what will be covered
      
      Format your response as a JSON object with the following structure:
      {
        "modules": [
          {
            "title": "Module Title",
            "lessons": [
              {
                "title": "Lesson Title",
                "description": "Brief description of the lesson content"
              }
            ]
          }
        ]
      }
      
      Make sure your response is only the JSON object with no additional text or explanation.
      
      Here is the course content to analyze:
      
      ${fileContent.slice(0, 15000)} // Limiting to 15000 chars to avoid token limits
    `;

    // Use the explicit URL to avoid any string interpolation issues
    const requestUrl = `${API_URL}?key=${apiKey}`;
    console.log("Request URL (without API key):", API_URL);

    const response = await fetch(requestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      console.error("Error Status:", response.status);
      console.error("Error Status Text:", response.statusText);
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: GeminiResponse = await response.json();

    // Check for content filtering
    if (data.promptFeedback?.blockReason) {
      throw new Error(`Content was blocked: ${data.promptFeedback.blockReason}`);
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated");
    }

    const responseText = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from the response (in case there's any extra text)
    const jsonMatch = responseText.match(/(\{[\s\S]*\})/);
    const jsonStr = jsonMatch ? jsonMatch[0] : responseText;
    
    try {
      // Parse the JSON response
      const syllabusContent: SyllabusContent = JSON.parse(jsonStr);
      return syllabusContent;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.log("Raw response:", responseText);
      throw new Error("Failed to parse the AI response. Try again or use a different document.");
    }
  } catch (error) {
    console.error("Error analyzing document:", error);
    toast.error(`Failed to analyze document: ${error instanceof Error ? error.message : "Unknown error"}`);
    return null;
  }
}
