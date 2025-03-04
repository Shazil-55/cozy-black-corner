import { useState, useCallback } from "react";
import { readFileContent } from "@/utils/fileProcessor";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface Lesson {
	id: string;
	title: string;
	description: string;
}

export interface Slide {
  title: string;
  content: string;
  visualPrompt: string;
  voiceoverScript: string;
}

export interface Class {
  id: string;
  title: string;
  corePoints: string[];
  slideCount: number;
}

export interface Module {
  id: string;
  title: string;
  classes: Class[];
  slides: Slide[][];
  lessons: Lesson[]; // Keep for backwards compatibility
}

type AnalysisState = "idle" | "analyzing" | "generating" | "complete" | "error";

// Interface for API response
interface SyllabusApiResponse {
  syllabus: Array<{
    classTitle: string;
    classNo: number;
    coreConcepts: string[];
    slides: Array<{
      slideNo: number;
      title: string;
      content: string;
      visualPrompt: string;
      voiceoverScript: string;
    }>;
    assessment: {
      quiz: string[];
    };
  }>;
}

export function useSyllabusGenerator() {
	const [file, setFile] = useState<File | null>(null);
	const [numClasses, setNumClasses] = useState<number>(10);
	const [modules, setModules] = useState<Module[]>([]);
	const [status, setStatus] = useState<AnalysisState>("idle");
	const [progress, setProgress] = useState<number>(0);
	const [error, setError] = useState<string | null>(null);

	const handleFileUpload = useCallback((file: File) => {
		setFile(file);
		setStatus("idle");
		setProgress(0);
		setError(null);
	}, []);

	const callOpenAIAPI = useCallback(async (fileContent: string, classRange: { start: number; end: number }, totalClasses: number): Promise<SyllabusApiResponse> => {
		const CHATGPT_API_KEY = import.meta.env.VITE_CHATGPT_API_KEY;
		if (!CHATGPT_API_KEY) {
			throw new Error("API key not found. Please add your API key in the application settings.");
		}

		const response = await fetch(
			"https://api.openai.com/v1/chat/completions",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${CHATGPT_API_KEY}`,
				},
				body: JSON.stringify({
					model: "gpt-4o",
					messages: [
						{
							role: "system",
							content: `You are a precision-focused syllabus architect. Strictly follow these requirements:
							- Generate classes ${classRange.start} to ${classRange.end} out of ${totalClasses} total classes
							- Each class should have 10-15 slides
							- Maintain logical progression: Foundational → Application → Mastery
							- Each slide must include header, Body: 3-5 lines paragraph of concise explanations of the concept, 
							visual prompt, voiceover script (10-15 lines) which explains the slide in the easiest way with example
							For each class there must be an assessment as well 
							- Output pure JSON without markdown formatting and the structure should look like this:

							{
								"syllabus": [
									{
										"classTitle": "Descriptive title (include Bloom's verb)",
										"classNo": ${classRange.start}-${classRange.end},
										"coreConcepts": ["list","key","topics"],
										"slides": [
											{
												"slideNo": 1,
												"title": "Clear conceptual title",
												"content": "3-5 lines paragraph of concise explanations of the concept",
												"visualPrompt": "DALLE-3 description for image",
												"voiceoverScript": "Word-for-word narration text"
											}
										],
										"assessment": {
											"quiz": ["3 knowledge-check questions"]
										}
									}
								]
							}
							This structure should be strictly followed 
							- Flag uncertain content with [REVIEW-NEEDED]`,
						},
						{
							role: "user",
							content: `PDF Content: ${fileContent}\n\nGenerate structured syllabus for classes ${classRange.start} to ${classRange.end} according to specifications.`,
						},
					],
					temperature: 0.1,
					max_tokens: 4000,
					response_format: { type: "json_object" },
				}),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error?.message || "API request failed");
		}

		const data = await response.json();
		const rawResponse = data.choices[0].message.content;
		
		try {
			return JSON.parse(rawResponse);
		} catch (parseError) {
			console.error("Failed to parse JSON:", rawResponse);
			throw new Error("Invalid JSON response from API");
		}
	}, []);

	const generateSyllabus = useCallback(async () => {
		if (!file) {
			setError("Please upload a document first.");
			return;
		}

		setStatus("analyzing");
		setProgress(10);
		setError(null);

		try {
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 90) {
						clearInterval(progressInterval);
						return 90;
					}
					return prev + Math.random() * 5;
				});
			}, 300);

			const fileContent = await readFileContent(file);
			setStatus("generating");
			setProgress(40);

			// Calculate chunks based on number of classes
			const CHUNK_SIZE = 4; // Maximum number of classes per API call
			const chunks = [];
			
			for (let i = 1; i <= numClasses; i += CHUNK_SIZE) {
				chunks.push({
					start: i,
					end: Math.min(i + CHUNK_SIZE - 1, numClasses)
				});
			}

			let combinedSyllabus: SyllabusApiResponse = { syllabus: [] };
			let chunkCounter = 0;
			
			// Process each chunk
			for (const chunk of chunks) {
				chunkCounter++;
				setProgress(40 + (50 * (chunkCounter / chunks.length)));
				
				// Show progress toast for each chunk
				toast.info(`Generating classes ${chunk.start} to ${chunk.end} (${chunkCounter}/${chunks.length})`);
				
				const chunkResult = await callOpenAIAPI(fileContent, chunk, numClasses);
				combinedSyllabus.syllabus = [...combinedSyllabus.syllabus, ...chunkResult.syllabus];
			}

			// Sort by classNo to ensure proper order
			combinedSyllabus.syllabus.sort((a, b) => a.classNo - b.classNo);
			
			// Group classes into modules (4 classes per module)
			const CLASSES_PER_MODULE = 4;
			const generatedModules: Module[] = [];
			
			for (let i = 0; i < combinedSyllabus.syllabus.length; i += CLASSES_PER_MODULE) {
				const moduleClasses = combinedSyllabus.syllabus.slice(i, i + CLASSES_PER_MODULE);
				const moduleIndex = Math.floor(i / CLASSES_PER_MODULE) + 1;
				
				// Create a module
				const module: Module = {
					id: `module-${moduleIndex}-${uuidv4().slice(0, 4)}`,
					title: `Module ${moduleIndex}: ${moduleClasses[0].classTitle.split(':')[0]}`,
					classes: [],
					slides: [],
					lessons: [] // Keep for backwards compatibility
				};
				
				// Add classes to this module
				moduleClasses.forEach((classItem, classIndex) => {
					// Create class
					const newClass: Class = {
						id: `class-${classItem.classNo}-${uuidv4().slice(0, 6)}`,
						title: classItem.classTitle,
						corePoints: classItem.coreConcepts,
						slideCount: classItem.slides.length
					};
					
					module.classes.push(newClass);
					
					// Store slides for this class
					const slides: Slide[] = classItem.slides.map(slide => ({
						title: slide.title,
						content: slide.content,
						visualPrompt: slide.visualPrompt,
						voiceoverScript: slide.voiceoverScript
					}));
					
					module.slides.push(slides);
					
					// Keep backwards compatibility with lessons
					classItem.slides.forEach(slide => {
						module.lessons.push({
							id: `lesson-${uuidv4().slice(0, 8)}`,
							title: `Class ${classItem.classNo} - ${slide.title}`,
							description: `${slide.content}\n\nVisual: ${slide.visualPrompt}\nVoiceover: ${slide.voiceoverScript}`
						});
					});
				});
				
				generatedModules.push(module);
			}

			clearInterval(progressInterval);
			setModules(generatedModules);
			setStatus("complete");
			setProgress(100);
			toast.success("Syllabus generated successfully!");
		} catch (err) {
			console.error("Error generating syllabus:", err);
			setError(
				err instanceof Error ? err.message : "An unknown error occurred"
			);
			setStatus("error");
			toast.error("Failed to generate syllabus. Please try again.");
		}
	}, [file, numClasses, callOpenAIAPI]);

	const updateModuleTitle = useCallback((moduleId: string, title: string) => {
		setModules((prevModules) =>
			prevModules.map((module) =>
				module.id === moduleId ? { ...module, title } : module
			)
		);
	}, []);

	const updateLesson = useCallback(
		(
			moduleId: string,
			lessonId: string,
			title: string,
			description: string
		) => {
			setModules((prevModules) =>
				prevModules.map((module) =>
					module.id === moduleId
						? {
								...module,
								lessons: module.lessons.map((lesson) =>
									lesson.id === lessonId
										? { ...lesson, title, description }
										: lesson
								),
						  }
						: module
				)
			);
		},
		[]
	);

	return {
		file,
		numClasses,
		modules,
		status,
		progress,
		error,
		setNumClasses,
		handleFileUpload,
		generateSyllabus,
		updateModuleTitle,
		updateLesson,
	};
}
