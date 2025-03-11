import { useState, useCallback } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import api from "@/services/api";

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

	const generateSyllabus = useCallback(async () => {
		if (!file) {
			setError("Please upload a document first.");
			return;
		}

		setStatus("analyzing");
		setProgress(10);
		setError(null);

		try {
			// Set up progress simulation
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev >= 90) {
						clearInterval(progressInterval);
						return 90;
					}
					return prev + Math.random() * 5;
				});
			}, 300);

			// Create form data for the API request
			const formData = new FormData();
			formData.append('pdfFile', file);
			formData.append('noOfClasses', numClasses.toString());

			// Call the backend API
			const response = await api.post('/user/generate-content', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			// Process the response
			const syllabusData = response.data;
			
			// Group classes into modules (4 classes per module)
			const CLASSES_PER_MODULE = 4;
			const generatedModules: Module[] = [];

			// Process the syllabus data from the API
			if (syllabusData && syllabusData.syllabus) {
				// Sort by classNo to ensure proper order
				syllabusData.syllabus.sort((a: any, b: any) => a.classNo - b.classNo);

				for (let i = 0; i < syllabusData.syllabus.length; i += CLASSES_PER_MODULE) {
					const moduleClasses = syllabusData.syllabus.slice(i, i + CLASSES_PER_MODULE);
					const moduleIndex = Math.floor(i / CLASSES_PER_MODULE) + 1;

					// Create a module
					const module: Module = {
						id: `module-${moduleIndex}-${uuidv4().slice(0, 4)}`,
						title: `Module ${moduleIndex}: ${
							moduleClasses[0].classTitle.split(":")[0]
						}`,
						classes: [],
						slides: [],
						lessons: [], // Keep for backwards compatibility
					};

					// Add classes to this module
					moduleClasses.forEach((classItem: any) => {
						// Create class
						const newClass: Class = {
							id: `class-${classItem.classNo}-${uuidv4().slice(0, 6)}`,
							title: classItem.classTitle,
							corePoints: classItem.coreConcepts,
							slideCount: classItem.slides.length,
						};

						module.classes.push(newClass);

						// Store slides for this class
						const slides: Slide[] = classItem.slides.map((slide: any) => ({
							title: slide.title,
							content: slide.content,
							visualPrompt: slide.visualPrompt,
							voiceoverScript: slide.voiceoverScript,
						}));

						module.slides.push(slides);

						// Keep backwards compatibility with lessons
						classItem.slides.forEach((slide: any) => {
							module.lessons.push({
								id: `lesson-${uuidv4().slice(0, 8)}`,
								title: `Class ${classItem.classNo} - ${slide.title}`,
								description: `${slide.content}\n\nVisual: ${slide.visualPrompt}\nVoiceover: ${slide.voiceoverScript}`,
							});
						});
					});

					generatedModules.push(module);
				}
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
	}, [file, numClasses]);

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
