import React, { useState, useMemo } from "react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { ClassSelector } from "@/components/ClassSelector";
import { LoadingState } from "@/components/LoadingState";
import SyllabusPreview from "@/components/SyllabusPreview";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useSyllabusGenerator } from "@/hooks/useSyllabusGenerator";
import { toast } from "sonner";
import {
	BookOpen,
	ArrowRight,
	UploadCloud,
	Sparkles,
	BookText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
	const {
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
	} = useSyllabusGenerator();

	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle");
	const isMobile = useIsMobile();

	const handleFileSelected = (selectedFile: File) => {
		setUploadStatus("uploading");
		setUploadProgress(0);

		const interval = setInterval(() => {
			setUploadProgress((prev) => {
				if (prev >= 100) {
					clearInterval(interval);
					setUploadStatus("success");
					handleFileUpload(selectedFile);
					return 100;
				}
				return prev + 5;
			});
		}, 100);
	};

	const handleGenerate = () => {
		const apiKey = import.meta.env.VITE_CHATGPT_API_KEY;
		
		if (!apiKey) {
			toast.error("Please set your OpenAI API key in the environment variables.");
			return;
		}
		
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

	return (
		<div className="flex min-h-screen bg-gray-50">
			{/* Sidebar */}
			{modules.length > 0 && (
				<Sidebar
					items={sidebarItems}
					onSelect={setSelectedItem}
					selectedId={selectedItem}
				/>
			)}

			<main
				className={cn(
					"flex-1 px-6 py-6 md:py-8 max-w-full",
					modules.length > 0 && !isMobile
				)}
			>
				<div className="max-w-4xl mx-auto">
					{/* Header */}
					<div className="mb-8 text-center">
						{status === "idle" || status === "error" ? (
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
					{status === "idle" || status === "error" ? (
						<div className="space-y-6">
							{/* Step 1: Upload Document */}
							<div className="bg-white rounded-md p-6 border border-gray-200 shadow-subtle hover:shadow-md transition-shadow">
								<div className="flex items-center mb-4">
									<div className="w-8 h-8 rounded-md bg-talentlms-blue flex items-center justify-center mr-3">
										<UploadCloud className="w-4 h-4 text-white" />
									</div>
									<h2 className="font-medium text-lg text-talentlms-darkBlue">
										Upload Document
									</h2>
								</div>

								<DocumentUpload
									onFileAccepted={handleFileSelected}
									status={uploadStatus}
									progress={uploadProgress}
								/>
							</div>

							{/* Step 2: Select number of classes */}
							<div
								className={cn(
									"bg-white rounded-md p-6 border border-gray-200 shadow-subtle hover:shadow-md transition-shadow",
									!file && "opacity-70"
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
									min={1}
									max={50}
								/>

								<div className="mt-6">
									<Button
										onClick={handleGenerate}
										disabled={!file}
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
