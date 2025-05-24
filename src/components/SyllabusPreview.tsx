
import React, { useState, useEffect } from "react";
import { Module } from "@/hooks/useSyllabusGenerator";
import { BookText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModuleCard from "./syllabus/ModuleCard";
import EditDialog from "./syllabus/EditDialog";
import ClassDetailsPanel from "./syllabus/ClassDetailsPanel";
import PresentationView from "./syllabus/PresentationView";
import { SlideData, FAQ, UserTest } from "@/services/courseService";

interface SyllabusPreviewProps {
	modules: Module[];
	onModuleUpdate: (moduleId: string, title: string) => void;
	onLessonUpdate: (
		moduleId: string,
		lessonId: string,
		title: string,
		description: string
	) => void;
	onRegenerate: () => void;
}

const SyllabusPreview: React.FC<SyllabusPreviewProps> = ({
	modules,
	onModuleUpdate,
	onLessonUpdate,
	onRegenerate,
}) => {
	const [expandedModules, setExpandedModules] = useState<
		Record<string, boolean>
	>(
		modules.reduce((acc, module) => ({ ...acc, [module.id]: true }), {})
	);

	const [selectedClass, setSelectedClass] = useState<{
		moduleId: string;
		classId: string;
		title: string;
		corePoints: string[];
		slides: SlideData[];
		faqs: FAQ[];
		userTest?: UserTest;
	} | null>(null);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogType, setDialogType] = useState<"module" | "lesson">("module");
	const [editingModule, setEditingModule] = useState<string>("");
	const [editingLesson, setEditingLesson] = useState<string>("");
	const [editTitle, setEditTitle] = useState("");
	const [editDescription, setEditDescription] = useState("");

	const [isPresentationMode, setIsPresentationMode] = useState(false);

	const toggleModule = (moduleId: string) => {
		setExpandedModules((prev) => ({
			...prev,
			[moduleId]: !prev[moduleId],
		}));
	};

	const openModuleEdit = (moduleId: string, title: string) => {
		setDialogType("module");
		setEditingModule(moduleId);
		setEditTitle(title);
		setDialogOpen(true);
	};

	const handleClassSelect = (moduleId: string, classId: string) => {
		console.log("Selecting class:", moduleId, classId);
		const moduleIndex = modules.findIndex((m) => m.id === moduleId);
		if (moduleIndex === -1) return;

		const classIndex = modules[moduleIndex].classes.findIndex(
			(c) => c.id === classId
		);
		if (classIndex === -1) return;

		const classItem = modules[moduleIndex].classes[classIndex];
		console.log("Found class item:", classItem);
		
		// Handle both API-loaded classes and socket-generated classes
		// For API-loaded classes, slides might be directly in the class or in the module.slides
		let slidesData: SlideData[] = [];
		
		// Try to get slides from module.slides array (socket-generated)
		if (modules[moduleIndex].slides && modules[moduleIndex].slides[classIndex]) {
			console.log("Found slides in module.slides:", modules[moduleIndex].slides[classIndex]);
			slidesData = modules[moduleIndex].slides[classIndex].map((slide) => ({
				id: slide.id,
				title: slide.title,
				slideNo: slide.slideNo,
				visualPrompt: slide.visualPrompt,
				voiceoverScript: slide.voiceoverScript,
				imageUrl: slide.imageUrl || null,
				content: slide.content,
				example: slide.example,
				classId: slide.classId,
				createdAt: slide.createdAt,
				updatedAt: slide.updatedAt,
			}));
		} 
		// Try to get slides from classItem.slides (API-loaded)
		else if (classItem.slides && Array.isArray(classItem.slides)) {
			console.log("Found slides in classItem.slides:", classItem.slides);
			slidesData = classItem.slides.map((slide: any) => ({
				id: slide.id,
				title: slide.title,
				slideNo: slide.slideNo,
				visualPrompt: slide.visualPrompt || "",
				voiceoverScript: slide.voiceoverScript || "",
				imageUrl: slide.imageUrl || null,
				content: slide.content || "",
				example: slide.example || "",
				classId: classItem.id,
				createdAt: slide.createdAt || new Date().toISOString(),
				updatedAt: slide.updatedAt || new Date().toISOString(),
			}));
		}

		// Get FAQs if they exist
		const faqs: FAQ[] = (modules[moduleIndex].faqs?.[classIndex] || classItem.faqs || []);
		
		// Get userTest if it exists
		const userTest = modules[moduleIndex].userTests?.[classIndex]?.[0] || classItem.userTest;

		console.log("Setting selected class with slides:", slidesData.length);
		
		setSelectedClass({
			moduleId,
			classId,
			title: classItem.classTitle || classItem.title,
			// Use concepts from Class if available (API data), otherwise use corePoints
			corePoints: classItem.concepts || classItem.corePoints || [],
			slides: slidesData,
			faqs: faqs,
			userTest: userTest,
		});
	};

	const saveChanges = () => {
		if (dialogType === "module") {
			onModuleUpdate(editingModule, editTitle);
		} else {
			onLessonUpdate(editingModule, editingLesson, editTitle, editDescription);
		}
		setDialogOpen(false);
	};

	const clearSelectedClass = () => {
		setSelectedClass(null);
	};

	const startPresentation = () => {
		if (selectedClass?.slides.length) {
			setIsPresentationMode(true);
		}
	};

	const closePresentation = () => {
		setIsPresentationMode(false);
	};

	useEffect(() => {
		// Update expanded modules when modules change
		setExpandedModules(
			modules.reduce((acc, module) => ({ ...acc, [module.id]: true }), {})
		);
		
		// Debug log the modules
		console.log("Modules updated in SyllabusPreview:", modules);
	}, [modules]);

	return (
		<>
			<div className="bg-white overflow-hidden">
				<div className="bg-talentlms-blue p-4 flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<BookText className="w-6 h-6 text-white" />
						<h2 className="text-xl font-semibold text-white">
							Syllabus Preview
						</h2>
					</div>
					<Button
						onClick={onRegenerate}
						variant="outline"
						size="sm"
						className="bg-white/10 hover:bg-white/20 text-white border-white/30 transition-colors duration-200"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Regenerate
					</Button>
				</div>

				{modules.length === 0 ? (
					<div className="p-6 text-center">
						<p className="text-muted-foreground">No syllabus generated yet.</p>
					</div>
				) : (
					<div className="p-4 md:p-6">
						{selectedClass ? (
							<ClassDetailsPanel
								title={selectedClass.title}
								corePoints={selectedClass.corePoints}
								slides={selectedClass.slides}
								faqs={selectedClass.faqs}
								userTest={selectedClass.userTest}
								onBack={clearSelectedClass}
								onStartPresentation={startPresentation}
							/>
						) : (
							modules.map((module) => (
								<ModuleCard
									key={module.id}
									module={module}
									expanded={expandedModules[module.id]}
									onToggle={() => toggleModule(module.id)}
									onEdit={openModuleEdit}
									onClassSelect={handleClassSelect}
								/>
							))
						)}
					</div>
				)}
			</div>

			<EditDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				type={dialogType}
				title={editTitle}
				description={editDescription}
				onTitleChange={setEditTitle}
				onDescriptionChange={setEditDescription}
				onSave={saveChanges}
			/>

			{isPresentationMode && selectedClass && (
				<PresentationView
					slides={selectedClass.slides}
					title={selectedClass.title}
					faqs={selectedClass.faqs}
					onClose={closePresentation}
					classId={selectedClass.classId}
				/>
			)}
		</>
	);
};

export default SyllabusPreview;
