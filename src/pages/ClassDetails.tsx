
import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Presentation, BookText, Play, FileQuestion, Trophy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSyllabusGenerator } from "@/hooks/useSyllabusGenerator";
import SlideCard from "@/components/syllabus/SlideCard";
import PresentationView from "@/components/syllabus/PresentationView";
import { SlideData, FAQ, UserTest } from "@/services/courseService";
import ChatBot from "@/components/syllabus/ChatBot";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const ClassDetails = () => {
	const { moduleId, classId } = useParams<{
		moduleId: string;
		classId: string;
	}>();
	const { modules } = useSyllabusGenerator();
	const [isPresentationMode, setIsPresentationMode] = useState(false);
	const { toast } = useToast();

	// New state for editing functionality
	const [isEditing, setIsEditing] = useState(false);
	const [editedTitle, setEditedTitle] = useState("");
	const [editedConcepts, setEditedConcepts] = useState<string[]>([]);
	const [newConceptInput, setNewConceptInput] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	const { currentClass, moduleIndex, classIndex, slides, faqs, userTest } =
		useMemo(() => {
			const moduleIndex = modules.findIndex((m) => m.id === moduleId);
			if (moduleIndex === -1)
				return {
					currentClass: null,
					moduleIndex: -1,
					classIndex: -1,
					slides: [] as SlideData[],
					faqs: [] as FAQ[],
					userTest: undefined,
				};

			const classIndex = modules[moduleIndex].classes.findIndex(
				(c) => c.id === classId
			);
			if (classIndex === -1)
				return {
					currentClass: null,
					moduleIndex,
					classIndex: -1,
					slides: [] as SlideData[],
					faqs: [] as FAQ[],
					userTest: undefined,
				};

			// Convert Slide[] to SlideData[]
			const slidesData: SlideData[] =
				modules[moduleIndex].slides?.[classIndex]?.map((slide) => ({
					id: slide.id,
					title: slide.title,
					slideNo: slide.slideNo,
					visualPrompt: slide.visualPrompt,
					voiceoverScript: slide.voiceoverScript,
					imageUrl: slide.imageUrl,
					content: slide.content,
					example: slide.example,
					classId: slide.classId,
					createdAt: slide.createdAt,
					updatedAt: slide.updatedAt,
				})) || [];

			// Get FAQs if they exist
			const faqsData: FAQ[] = modules[moduleIndex].faqs?.[classIndex] || [];
			
			// Get userTest if it exists, safely handle the optional property
			const userTestData = modules[moduleIndex].userTests?.[classIndex]?.[0];

			return {
				currentClass: modules[moduleIndex].classes[classIndex],
				moduleIndex,
				classIndex,
				slides: slidesData,
				faqs: faqsData,
				userTest: userTestData,
			};
		}, [modules, moduleId, classId]);

	// Initialize edit state when current class changes
	React.useEffect(() => {
		if (currentClass) {
			setEditedTitle(currentClass.title);
			setEditedConcepts([...currentClass.corePoints]);
		}
	}, [currentClass]);

	const startPresentation = () => {
		setIsPresentationMode(true);
	};

	const closePresentation = () => {
		setIsPresentationMode(false);
	};

	// Function to toggle edit mode
	const toggleEditMode = () => {
		if (isEditing) {
			// If we're currently editing, save changes
			handleSaveChanges();
		} else {
			// If we're not editing, enter edit mode
			setIsEditing(true);
			if (currentClass) {
				setEditedTitle(currentClass.title);
				setEditedConcepts([...currentClass.corePoints]);
			}
		}
	};

	// Function to add a new concept
	const handleAddConcept = () => {
		if (newConceptInput.trim()) {
			setEditedConcepts([...editedConcepts, newConceptInput.trim()]);
			setNewConceptInput("");
		}
	};

	// Function to remove a concept
	const handleRemoveConcept = (index: number) => {
		setEditedConcepts(editedConcepts.filter((_, i) => i !== index));
	};

	// Function to handle key down in the new concept input
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && newConceptInput.trim()) {
			e.preventDefault();
			handleAddConcept();
		}
	};

	// Function to save changes
	const handleSaveChanges = async () => {
		if (!classId) return;

		setIsSaving(true);
		try {
			const response = await fetch(`https://dev-api.ilmee.ai/api/v_1/internal/user/class/${classId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					'access-token': localStorage.getItem('token') || '',
				},
				body: JSON.stringify({
					classTitle: editedTitle,
					concepts: editedConcepts,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update class');
			}

			// Update the local state
			if (currentClass) {
				currentClass.title = editedTitle;
				currentClass.corePoints = editedConcepts;
			}

			toast({
				title: "Class updated successfully",
				variant: "default"
			});
			
			setIsEditing(false);
		} catch (error) {
			console.error('Error updating class:', error);
			toast({
				title: "Failed to update class",
				description: "Please try again",
				variant: "destructive"
			});
		} finally {
			setIsSaving(false);
		}
	};

	if (!currentClass) {
		return (
			<div className="container mx-auto p-8 text-center">
				<h2 className="text-2xl font-medium mb-4">Class not found</h2>
				<Button asChild>
					<Link to="/">Go back to home</Link>
				</Button>
			</div>
		);
	}

	return (
		<>
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-5xl mx-auto px-4">
					{/* Header */}
					<div className="mb-6">
						<Link
							to="/"
							className="inline-flex items-center text-talentlms-blue mb-4 hover:underline"
						>
							<ArrowLeft className="w-4 h-4 mr-1" />
							Back to Syllabus
						</Link>

						<div className="bg-white rounded-lg p-6 shadow-subtle">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 bg-talentlms-blue rounded-full flex items-center justify-center">
										<Presentation className="w-5 h-5 text-white" />
									</div>
									{isEditing ? (
										<Input
											value={editedTitle}
											onChange={(e) => setEditedTitle(e.target.value)}
											className="text-2xl font-medium border-2 border-blue-300 focus:border-blue-500"
											placeholder="Class Title"
										/>
									) : (
										<h1 className="text-2xl font-medium text-talentlms-darkBlue">
											{currentClass.title}
										</h1>
									)}
								</div>
								<Button
									onClick={toggleEditMode}
									variant={isEditing ? "default" : "outline"}
									className={isEditing ? "bg-green-600 hover:bg-green-700 text-white" : ""}
									disabled={isSaving}
								>
									{isSaving ? (
										<>Saving...</>
									) : isEditing ? (
										<>
											<Save className="w-4 h-4 mr-2" />
											Save Changes
										</>
									) : (
										"Edit Class"
									)}
								</Button>
							</div>

							<div className="mb-4">
								<h3 className="text-sm font-medium text-gray-500 mb-2">
									Key Points:
								</h3>
								{isEditing ? (
									<div className="space-y-2">
										<div className="flex flex-wrap gap-2">
											{editedConcepts.map((concept, index) => (
												<div key={index} className="flex items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 text-sm text-blue-800">
													{concept}
													<Button 
														variant="ghost" 
														size="sm" 
														className="ml-2 h-5 w-5 p-0 rounded-full hover:bg-blue-200"
														onClick={() => handleRemoveConcept(index)}
													>
														×
													</Button>
												</div>
											))}
										</div>
										<div className="flex items-center mt-2">
											<Input
												value={newConceptInput}
												onChange={(e) => setNewConceptInput(e.target.value)}
												onKeyDown={handleKeyDown}
												placeholder="Add a new concept and press Enter"
												className="flex-1"
											/>
											<Button 
												onClick={handleAddConcept}
												disabled={!newConceptInput.trim()}
												className="ml-2"
											>
												Add
											</Button>
										</div>
									</div>
								) : (
									<ul className="list-disc list-inside space-y-1 pl-1 text-gray-700">
										{currentClass.corePoints.map((point, index) => (
											<li key={index}>{point}</li>
										))}
									</ul>
								)}
							</div>

							<div className="flex items-center justify-between">
								<div className="flex items-center text-gray-600 text-sm">
									<BookText className="w-4 h-4 mr-1.5" />
									{slides.length} {slides.length === 1 ? "slide" : "slides"}
								</div>

								<div className="flex gap-3">
									{slides.length > 0 && (
										<>
											<Button
												variant="default"
												onClick={startPresentation}
												className="bg-talentlms-blue hover:bg-talentlms-darkBlue text-white"
											>
												<Play className="w-4 h-4 mr-2" />
												Start Presentation
											</Button>
											{userTest ? (
												<Link to={`/quiz/${classId}?view=results`}>
													<Button className="bg-amber-500 hover:bg-amber-600">
														<Trophy className="w-4 h-4 mr-2" />
														View Results
													</Button>
												</Link>
											) : (
												<Link to={`/quiz/${classId}`}>
													<Button className="bg-green-600 hover:bg-green-700">
														<FileQuestion className="w-4 h-4 mr-2" />
														Start Quiz
													</Button>
												</Link>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Slides */}
					<div className="space-y-4">
						<h2 className="text-xl font-medium text-talentlms-darkBlue pl-2">
							Slides
						</h2>

						{slides.length === 0 ? (
							<div className="bg-white rounded-lg p-6 text-center text-gray-500">
								No slides available for this class.
							</div>
						) : (
							<div className="space-y-4">
								{slides.map((slide, index) => (
									<SlideCard
										key={slide.id}
										slide={slide}
										slideNumber={slide.slideNo}
									/>
								))}
							</div>
						)}
						
						{/* Quiz Button at the bottom - conditional based on userTest */}
						{slides.length > 0 && (
							<div className="mt-8 flex justify-center">
								{userTest ? (
									<Link to={`/quiz/${classId}?view=results`}>
										<Button className="bg-amber-500 hover:bg-amber-600 px-6 py-2 flex items-center gap-2">
											<Trophy className="w-5 h-5" />
											View Results
										</Button>
									</Link>
								) : (
									<Link to={`/quiz/${classId}`}>
										<Button className="bg-green-600 hover:bg-green-700 px-6 py-2 flex items-center gap-2">
											<FileQuestion className="w-5 h-5" />
											Start Quiz
										</Button>
									</Link>
								)}
							</div>
						)}
					</div>
				</div>

				{/* Add ChatBot to the main page as well */}
				{faqs.length > 0 && <ChatBot faqs={faqs} />}
			</div>

			{/* Presentation Mode */}
			{isPresentationMode && (
				<PresentationView
					slides={slides}
					title={currentClass.title}
					faqs={faqs}
					onClose={closePresentation}
					classId={classId || ""}
				/>
			)}
		</>
	);
};

export default ClassDetails;
