
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import api from "@/services/api";
import { SlideData, FAQ, UserTest } from "@/services/courseService";
import { useSocketProgress } from "./useSocketProgress";

export interface Lesson {
	id: string;
	title: string;
	description: string;
}

export interface Slide {
	[x: string]: any;
	id: string;
	title: string;
	slideNo: number;
	content: string;
	visualPrompt: string;
	voiceoverScript: string;
	imageUrl: string | null;
	classId: string;
	createdAt: string;
	updatedAt: string;
}

export interface Class {
	faqs: any[];
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
	faqs: FAQ[][];
	userTests?: UserTest[][];
	lessons: Lesson[]; // Keep for backwards compatibility
}

type AnalysisState = "idle" | "analyzing" | "generating" | "complete" | "error";

export function useSyllabusGenerator() {
	const [file, setFile] = useState<File | null>(null);
	const [numClasses, setNumClasses] = useState<number>(10);
	const [modules, setModules] = useState<Module[]>([]);
	const [status, setStatus] = useState<AnalysisState>("idle");
	const [error, setError] = useState<string | null>(null);
	
	// Use our socket progress hook
	const { 
		socketId, 
		isConnected, 
		progressPercent, 
		progressStatus, 
		progressMessage 
	} = useSocketProgress();

	const handleFileUpload = useCallback((file: File) => {
		setFile(file);
		setStatus("idle");
		setError(null);
	}, []);

	const generateSyllabus = useCallback(async () => {
		if (!file) {
			setError("Please upload a document first.");
			return;
		}

		if (!socketId || !isConnected) {
			toast.error("Unable to connect to server. Please try again later.");
			return;
		}

		setStatus("analyzing");
		setError(null);

		try {
			const formData = new FormData();
			formData.append("pdfFile", file);
			formData.append("noOfClasses", numClasses.toString());
			formData.append("socketId", socketId);

			// Show initial toast notification
			toast.info("Starting to process your document", {
				description: "You'll see progress updates as we work on your syllabus",
				duration: 3000,
			});

			// Make the initial request to start processing
			const response = await api.post("/user/generate-content", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.data.message) {
				toast.info(response.data.message);
				setStatus("generating");
			}

			// The socket will handle progress updates from here
		} catch (err) {
			console.error("Error generating syllabus:", err);
			setError(
				err instanceof Error ? err.message : "An unknown error occurred"
			);
			setStatus("error");
			toast.error("Failed to generate syllabus. Please try again.");
		}
	}, [file, numClasses, socketId, isConnected]);

	// Watch for status changes from socket
	useEffect(() => {
		if (progressStatus === 'completed') {
			// Fetch the completed syllabus data
			fetchCompletedSyllabus();
		} else if (progressStatus === 'error') {
			setStatus('error');
			setError(progressMessage);
			toast.error(progressMessage);
		} else if (progressStatus === 'processing' || progressStatus === 'starting') {
			setStatus('generating');
		}
	}, [progressStatus, progressMessage]);

	// Function to fetch completed syllabus
	const fetchCompletedSyllabus = async () => {
		try {
			// Get the latest syllabus
			const response = await api.get("/user/latest-syllabus");
			const syllabusData = response.data;
			
			const CLASSES_PER_MODULE = 4;
			const generatedModules: Module[] = [];

			if (syllabusData && syllabusData.syllabus) {
				syllabusData.syllabus.sort((a: any, b: any) => a.classNo - b.classNo);

				for (
					let i = 0;
					i < syllabusData.syllabus.length;
					i += CLASSES_PER_MODULE
				) {
					const moduleClasses = syllabusData.syllabus.slice(
						i,
						i + CLASSES_PER_MODULE
					);
					const moduleIndex = Math.floor(i / CLASSES_PER_MODULE) + 1;

					const module: Module = {
						id: `module-${moduleIndex}-${uuidv4().slice(0, 4)}`,
						title: `Module ${moduleIndex}: ${
							moduleClasses[0].classTitle.split(":")[0]
						}`,
						classes: [],
						slides: [],
						faqs: [], // Initialize the faqs array
						userTests: [], // Initialize the userTests array
						lessons: [], // Keep for backwards compatibility
					};

					moduleClasses.forEach((classItem: any) => {
						const newClass: Class = {
							id: `class-${classItem.classNo}-${uuidv4().slice(0, 6)}`,
							title: classItem.classTitle,
							corePoints: classItem.coreConcepts,
							slideCount: classItem.slides.length,
							faqs: [],
						};

						module.classes.push(newClass);

						const slides: Slide[] = classItem.slides.map(
							(slide: any, slideIndex: number) => ({
								id: `slide-${uuidv4()}`,
								title: slide.title,
								slideNo: slideIndex + 1,
								content: slide.content,
								visualPrompt: slide.visualPrompt,
								voiceoverScript: slide.voiceoverScript,
								imageUrl: null,
								classId: newClass.id,
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							})
						);

						module.slides.push(slides);

						// Initialize empty FAQs array for each class
						module.faqs.push([]);

						// Initialize empty userTests array for each class
						module.userTests?.push([]);

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

			setModules(generatedModules);
			setStatus("complete");
			toast.success("Syllabus generated successfully!");
		} catch (err) {
			console.error("Error fetching completed syllabus:", err);
			setError(err instanceof Error ? err.message : "An unknown error occurred");
			setStatus("error");
			toast.error("Failed to retrieve syllabus. Please try again.");
		}
	};

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
		progress: progressPercent,
		progressMessage,
		error,
		setNumClasses,
		handleFileUpload,
		generateSyllabus,
		updateModuleTitle,
		updateLesson,
	};
}
