
import React, { useState, useMemo, useEffect } from "react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { ClassSelector } from "@/components/ClassSelector";
import { LoadingState } from "@/components/LoadingState";
import { ProcessingScreen } from "@/components/ProcessingScreen";
import SyllabusPreview from "@/components/SyllabusPreview";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useSyllabusGenerator } from "@/hooks/useSyllabusGenerator";
import { useSocketProgress } from "@/hooks/useSocketProgress";
import { toast } from "sonner";
import {
	BookOpen,
	ArrowRight,
	UploadCloud,
	Sparkles,
	BookText,
	Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { readFileContent } from "@/utils/fileProcessor";

const CHARS_PER_CLASS = 5000;
const DEFAULT_MIN_CLASSES = 1;
const MAX_CLASSES = 200;

const Index = () => {
	const {
		file,
		numClasses,
		modules,
		status,
		progress,
		progressMessage,
		error,
		setNumClasses,
		handleFileUpload,
		generateSyllabus,
		updateModuleTitle,
		updateLesson,
	} = useSyllabusGenerator();

	// Get global progress state
	const { progressStatus, progressPercent, progressMessage: globalProgressMessage } = useSocketProgress();

	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle");
	const [minClasses, setMinClasses] = useState(DEFAULT_MIN_CLASSES);
	const isMobile = useIsMobile();
	const { isAuthenticated } = useAuth();

	// Determine if we should show the processing screen
	const isProcessing = progressStatus === 'processing' || progressStatus === 'starting';

	// Store last processing state in session storage
	useEffect(() => {
		if (isProcessing) {
			sessionStorage.setItem('processingActive', 'true');
		} else if (progressStatus === 'completed' || progressStatus === 'error') {
			sessionStorage.removeItem('processingActive');
		}
	}, [isProcessing, progressStatus]);

	// Check for active processing when component mounts
	useEffect(() => {
		const wasProcessing = sessionStorage.getItem('processingActive') === 'true';
		if (wasProcessing && progressStatus === 'idle') {
			// If we have a record of processing but our socket shows idle,
			// we probably lost connection and reconnected. Show the processing screen.
			console.log('Reconnected during active processing');
		}
	}, [progressStatus]);

	const handleFileSelected = async (selectedFile: File) => {
		if (!isAuthenticated) {
			toast.error("Please log in to upload documents", {
				description: "You need to be logged in to use this feature.",
				action: {
					label: "Login",
					onClick: () => window.location.href = '/login'
				}
			});
			return;
		}

		setUploadStatus("uploading");
		setUploadProgress(0);

		try {
			// Start a progress indicator
			const progressInterval = setInterval(() => {
				setUploadProgress((prev) => {
					if (prev >= 90) {
						clearInterval(progressInterval);
						return 90;
					}
					return prev + 5;
				});
			}, 100);

			// Process the file to get character count
			const fileResult = await readFileContent(selectedFile);
			
			// Calculate minimum number of classes based on character count
			const calculatedMinClasses = Math.max(
				DEFAULT_MIN_CLASSES,
				Math.ceil(fileResult.characterCount / CHARS_PER_CLASS)
			);
			
			setMinClasses(calculatedMinClasses);
			
			// If current numClasses is less than calculated minimum, update it
			if (numClasses < calculatedMinClasses) {
				setNumClasses(calculatedMinClasses);
				toast.info(`Minimum classes set to ${calculatedMinClasses} based on document length`, {
					duration: 5000,
				});
			}
			
			clearInterval(progressInterval);
			setUploadProgress(100);
			setUploadStatus("success");
			
			// Pass the file to the syllabus generator
			handleFileUpload(selectedFile);
			
		} catch (error) {
			setUploadStatus("error");
			toast.error("Error processing file", {
				description: error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	};

	const handleGenerate = () => {
		if (!file) {
			toast.error("Please upload a document first");
			return;
		}
		
		generateSyllabus();
	};

	const handleRegenerate = () => {
		toast.success("Regenerating syllabus...");
		generateSyllabus();
	};

	// Convert modules to sidebar structure with classes
	const sidebarItems = useMemo(() => {
		return modules.map((module) => ({
			id: module.id,
			title: module.title,
			type: "module" as const,
			expanded: true,
			children: module.classes.map((classItem) => ({
				id: classItem.id,
				title: classItem.title,
				type: "class" as const,
			})),
		}));
	}, [modules]);

	const [selectedItem, setSelectedItem] = useState<string | undefined>();

	// Check if we should show the processing screen
	const shouldShowProcessing = isProcessing || 
		(sessionStorage.getItem('processingActive') === 'true' && status !== 'complete');

	// Only show normal UI if no processing is happening
	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			{modules.length > 0 && !shouldShowProcessing && (
				<Sidebar
					items={sidebarItems}
					onSelect={setSelectedItem}
					selectedId={selectedItem}
				/>
			)}

			<main
				className={cn(
					"flex-1 px-6 py-6 md:py-8 max-w-full",
					modules.length > 0 && !isMobile && !shouldShowProcessing
				)}
			>
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="mb-8 text-center">
						{shouldShowProcessing ? (
							<h1 className="text-2xl font-medium tracking-tight mb-3 text-talentlms-darkBlue flex items-center justify-center">
								<BookText className="w-6 h-6 mr-2 text-talentlms-blue" />
								AI Syllabus Generator
							</h1>
						) : status === "idle" || status === "error" ? (
							<>
								<div className="flex justify-center mb-4">
									<div className="w-14 h-14 rounded-full bg-talentlms-blue flex items-center justify-center">
										<BookText className="w-7 h-7 text-white" />
									</div>
								</div>
								<h1 className="text-3xl font-medium tracking-tight mb-3 text-talentlms-darkBlue">
									AI Syllabus Generator
								</h1>
								<p className="text-muted-foreground max-w-2xl mx-auto">
									Upload your course material and let AI create a structured
									syllabus. Simply upload a document, specify the number of
									classes, and get a professionally organized course structure.
								</p>
							</>
						) : (
							<h1 className="text-2xl font-medium tracking-tight mb-3 text-talentlms-darkBlue flex items-center justify-center">
								<BookText className="w-6 h-6 mr-2 text-talentlms-blue" />
								AI Syllabus Generator
							</h1>
						)}
					</div>

					{/* Main content */}
					{shouldShowProcessing ? (
						<ProcessingScreen 
							progress={progressPercent}
							message="Generating syllabus..."
							classInfo={globalProgressMessage}
						/>
					) : status === "idle" || status === "error" ? (
						<div className="space-y-6">
							{/* Step 1: Upload Document */}
							<div className="bg-white rounded-md p-6 border border-gray-200 shadow-subtle hover:shadow-md transition-shadow">
								<div className="flex items-center mb-4">
									<div className="w-8 h-8 rounded-md bg-talentlms-blue flex items-center justify-center mr-3">
										{isAuthenticated ? (
											<UploadCloud className="w-4 h-4 text-white" />
										) : (
											<Lock className="w-4 h-4 text-white" />
										)}
									</div>
									<h2 className="font-medium text-lg text-talentlms-darkBlue">
										Upload Document
									</h2>
								</div>

								{isAuthenticated ? (
									<DocumentUpload
										onFileAccepted={handleFileSelected}
										status={uploadStatus}
										progress={uploadProgress}
									/>
								) : (
									<div className="border-2 border-dashed border-gray-200 rounded-md p-6 flex flex-col items-center justify-center text-center bg-gray-50">
										<div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
											<Lock className="h-6 w-6 text-gray-500" />
										</div>
										<h3 className="font-medium text-lg mb-2 text-gray-700">
											Authentication Required
										</h3>
										<p className="text-muted-foreground text-sm mb-4 max-w-md">
											Please log in or register to upload documents and generate syllabuses.
										</p>
										<div className="flex flex-col sm:flex-row gap-3">
											<Link to="/login">
												<Button variant="outline" className="w-full sm:w-auto">
													Login
												</Button>
											</Link>
											<Link to="/register">
												<Button className="w-full sm:w-auto bg-talentlms-blue hover:bg-talentlms-darkBlue">
													Register
												</Button>
											</Link>
										</div>
									</div>
								)}
							</div>

							{/* Step 2: Select number of classes */}
							<div
								className={cn(
									"bg-white rounded-md p-6 border border-gray-200 shadow-subtle hover:shadow-md transition-shadow",
									(!file || !isAuthenticated) && "opacity-70"
								)}
							>
								<div className="flex items-center mb-4">
									<div className="w-8 h-8 rounded-md bg-talentlms-blue flex items-center justify-center mr-3">
										<Sparkles className="w-4 h-4 text-white" />
									</div>
									<h2 className="font-medium text-lg text-talentlms-darkBlue">
										Configure Syllabus
									</h2>
								</div>

								<ClassSelector
									value={numClasses}
									onChange={setNumClasses}
									min={minClasses}
									max={MAX_CLASSES}
								/>

								<div className="mt-6">
									<Button
										onClick={handleGenerate}
										disabled={!file || !isAuthenticated}
										className="bg-talentlms-blue hover:bg-talentlms-darkBlue text-white w-full md:w-auto"
									>
										Generate Syllabus
										<ArrowRight className="ml-2 w-4 h-4" />
									</Button>
								</div>
							</div>

							{error && (
								<div className="rounded-md bg-red-50 p-4 border border-red-100">
									<p className="text-sm text-red-800">{error}</p>
								</div>
							)}
						</div>
					) : status === "analyzing" || status === "generating" ? (
						<div className="bg-white rounded-md p-8 border border-gray-200 shadow-subtle">
							<LoadingState
								message={
									status === "analyzing"
										? "Analyzing document..."
										: "Generating syllabus..."
								}
								progress={progress}
								statusMessage={progressMessage}
							/>
						</div>
					) : (
						<SyllabusPreview
							modules={modules}
							onModuleUpdate={updateModuleTitle}
							onLessonUpdate={updateLesson}
							onRegenerate={handleRegenerate}
						/>
					)}
				</div>
			</main>
		</div>
	);
};

export default Index;
