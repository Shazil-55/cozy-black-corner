
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Calendar, Users, FileText, Paperclip } from "lucide-react";
import {
	courseService,
	ModuleData,
	ClassData,
	SlideData,
	FAQ,
} from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import ModuleCard from "@/components/syllabus/ModuleCard";
import ClassDetailsPanel from "@/components/syllabus/ClassDetailsPanel";
import EditDialog from "@/components/syllabus/EditDialog";
import PresentationView from "@/components/syllabus/PresentationView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssignmentsTab, ClassOption } from "@/components/courses/AssignmentsTab";
import { GroupUsersTab } from "@/components/groups/GroupUsersTab";
import { GroupFilesTab } from "@/components/groups/GroupFilesTab";
import { UserGroupsTab } from "@/components/users/UserGroupsTab";

interface SidebarItem {
	id: string;
	title: string;
	type: "module" | "class";
	children?: SidebarItem[];
	expanded?: boolean;
}

const CourseDetails: React.FC = () => {
	const { courseId } = useParams<{ courseId: string }>();
	const [selectedClass, setSelectedClass] = useState<{
		moduleId: string;
		classId: string;
		title: string;
		corePoints: string[];
	} | null>(null);

	const [expandedModules, setExpandedModules] = useState<
		Record<string, boolean>
	>({});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [editingModule, setEditingModule] = useState<string>("");
	const [editTitle, setEditTitle] = useState("");

	const [isPresentationMode, setIsPresentationMode] = useState(false);
	const [presentationSlides, setPresentationSlides] = useState<SlideData[]>([]);
	const [presentationTitle, setPresentationTitle] = useState("");
	const [presentationFaqs, setPresentationFaqs] = useState<FAQ[]>([]);
	
	// Current active tab
	const [activeTab, setActiveTab] = useState("content");

	const { data, isLoading, error, refetch } = useQuery({
		queryKey: ["courseDetails", courseId],
		queryFn: () => courseService.getCourseDetails(courseId || ""),
		enabled: !!courseId,
		meta: {
			onError: () => {
				toast.error("Failed to fetch course details. Please try again later.");
			},
		},
	});

	const { data: classData, isLoading: isLoadingClass } = useQuery({
		queryKey: ["classDetails", selectedClass?.classId],
		queryFn: () => courseService.getClassDetails(selectedClass?.classId || ""),
		enabled: !!selectedClass?.classId,
		meta: {
			onError: () => {
				toast.error("Failed to fetch class details. Please try again later.");
			},
		},
	});

	// Extract classes for the AssignmentsTab
	const courseClasses: ClassOption[] = React.useMemo(() => {
		if (!data?.data?.modules) return [];
		
		return data.data.modules.flatMap((module: ModuleData) => 
			module.classes.map((cls: ClassData) => ({
				id: cls.id,
				title: cls.title
			}))
		);
	}, [data]);
  
	React.useEffect(() => {
		if (data?.data?.modules.length > 0) {
			const initialExpandedState: Record<string, boolean> = {};
			data.data.modules.forEach((module) => {
				initialExpandedState[module.id] = true;
			});
			setExpandedModules(initialExpandedState);
		}
	}, [data?.data?.modules]);

	// Map API module data to the format expected by ModuleCard
	const mappedModules = React.useMemo(() => {
		if (!data?.data?.modules) return [];

		return data.data.modules.map((module: ModuleData) => ({
			id: module.id,
			title: module.name, // Map 'name' to 'title' for ModuleCard
			classes: module.classes.map((classItem: ClassData) => ({
				id: classItem.id,
				title: classItem.title,
				corePoints: classItem.concepts,
				slideCount: 0, // Add any missing props required by Module type
			})),
		}));
	}, [data]);

	const sidebarItems = React.useMemo(() => {
		if (!data?.data?.modules) return [];

		return data.data.modules.map((module: ModuleData) => {
			return {
				id: module.id,
				title: module.name,
				type: "module" as const,
				expanded: expandedModules[module.id] ?? true,
				children: module.classes.map((classItem: ClassData) => ({
					id: classItem.id,
					title: classItem.title,
					type: "class" as const,
				})),
			};
		});
	}, [data, expandedModules]);

	const handleClassSelect = (moduleId: string, classId: string) => {
		if (!data?.data?.modules) return;

		const module = data.data.modules.find((m) => m.id === moduleId);
		if (!module) return;

		const classItem = module.classes.find((c) => c.id === classId);
		if (!classItem) return;

		setSelectedClass({
			moduleId,
			classId,
			title: classItem.title,
			corePoints: classItem.concepts,
		});
		
		// Switch to content tab when selecting a class
		setActiveTab("content");
	};

	const handleSidebarSelect = (id: string) => {
		for (const module of data?.data?.modules || []) {
			const classItem = module.classes.find((c) => c.id === id);
			if (classItem) {
				handleClassSelect(module.id, classItem.id);
				return;
			}
		}
	};

	const clearSelectedClass = () => {
		setSelectedClass(null);
	};

	const toggleModule = (moduleId: string) => {
		setExpandedModules((prev) => ({
			...prev,
			[moduleId]: !prev[moduleId],
		}));
	};

	const openModuleEdit = (moduleId: string, title: string) => {
		setEditingModule(moduleId);
		setEditTitle(title);
		setDialogOpen(true);
	};

	const saveModuleChanges = () => {
		toast.success(`Module title updated to "${editTitle}"`);
		setDialogOpen(false);
	};

	const startPresentation = (
		slides: SlideData[],
		title: string,
		faqs: FAQ[] = []
	) => {
		setPresentationSlides(slides);
		setPresentationTitle(title);
		setPresentationFaqs(faqs);
		setIsPresentationMode(true);
	};

	const closePresentationMode = () => {
		setIsPresentationMode(false);
	};
	
	// Handler for refreshing assignments after changes
	const handleAssignmentChanged = async () => {
		await refetch();
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex">
				<div className="flex-1 p-8 flex justify-center items-center">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-talentlms-blue mx-auto"></div>
						<p className="mt-4 text-gray-600 dark:text-gray-400">
							Loading course details...
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (error || !data) {
		return (
			<div className="min-h-screen flex">
				<div className="flex-1 p-8">
					<div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
						<h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
							Error Loading Course
						</h1>
						<p className="text-gray-700 dark:text-gray-300 mb-6">
							We couldn't load the course details. Please try again later.
						</p>
						<Button asChild>
							<Link to="/courses">Back to Courses</Link>
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex">
			<Sidebar
				items={sidebarItems}
				onSelect={handleSidebarSelect}
				selectedId={selectedClass?.classId}
			/>

			<div className="flex-1 p-6 overflow-y-auto">
				<div className="max-w-5xl mx-auto">
					<div className="mb-6 flex items-center justify-between">
						<div className="flex items-center">
							<Link
								to="/courses"
								className="inline-flex items-center text-talentlms-blue mr-4 hover:underline"
							>
								<ArrowLeft className="w-4 h-4 mr-1" />
								Back to Courses
							</Link>
							<h1 className="text-2xl font-bold text-talentlms-darkBlue dark:text-white">
								{data.data.name}
							</h1>
						</div>
						<div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
							<Calendar className="w-4 h-4 mr-1.5" />
							{new Date(data.data.createdAt).toLocaleDateString()}
						</div>
					</div>

					<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<div className="bg-talentlms-blue p-4">
								<TabsList className="bg-talentlms-blue/20">
									<TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:text-talentlms-blue">
										<BookOpen className="w-4 h-4 mr-2" />
										Content
									</TabsTrigger>
									<TabsTrigger value="assignments" className="data-[state=active]:bg-white data-[state=active]:text-talentlms-blue">
										<Paperclip className="w-4 h-4 mr-2" />
										Assignments
									</TabsTrigger>
									<TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-talentlms-blue">
										<Users className="w-4 h-4 mr-2" />
										Users
									</TabsTrigger>
									<TabsTrigger value="files" className="data-[state=active]:bg-white data-[state=active]:text-talentlms-blue">
										<FileText className="w-4 h-4 mr-2" />
										Files
									</TabsTrigger>
								</TabsList>
							</div>

							<div className="p-4 md:p-6">
								<TabsContent value="content">
									{selectedClass ? (
										isLoadingClass ? (
											<div className="flex justify-center items-center h-64">
												<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-talentlms-blue"></div>
												<p className="ml-4 text-gray-600">
													Loading class details...
												</p>
											</div>
										) : classData?.data ? (
											<ClassDetailsPanel
												title={classData.data.title}
												corePoints={classData.data.concepts}
												slides={classData.data.slides || []}
												faqs={classData.data.faqs || []}
												onBack={clearSelectedClass}
												onStartPresentation={() =>
													startPresentation(
														classData.data.slides,
														classData.data.title,
														classData.data.faqs
													)
												}
											/>
										) : (
											<div className="p-6 text-center">
												<p className="text-red-500">
													Failed to load class details.
												</p>
												<Button onClick={clearSelectedClass} className="mt-4">
													Go Back
												</Button>
											</div>
										)
									) : (
										mappedModules.map((module) => (
											<ModuleCard
												key={module.id}
												module={module}
												expanded={expandedModules[module.id] ?? true}
												onToggle={() => toggleModule(module.id)}
												onEdit={openModuleEdit}
												onClassSelect={handleClassSelect}
											/>
										))
									)}
								</TabsContent>
								
								<TabsContent value="assignments">
									<AssignmentsTab 
										courseId={courseId || ""} 
										assignments={data.data.assignments || []} 
										onAssignmentAdded={handleAssignmentChanged}
										classes={courseClasses} 
									/>
								</TabsContent>
								
								<TabsContent value="users">
									<GroupUsersTab groupId={courseId || ""} users={data.data.enrolledUsers || []} />
								</TabsContent>
								
								<TabsContent value="files">
									<GroupFilesTab groupId={courseId || ""} files={data.data.files || []} />
								</TabsContent>
							</div>
						</Tabs>
					</div>
				</div>
			</div>

			<EditDialog
				open={dialogOpen}
				onOpenChange={setDialogOpen}
				type="module"
				title={editTitle}
				description=""
				onTitleChange={setEditTitle}
				onDescriptionChange={() => {}}
				onSave={saveModuleChanges}
			/>

			{isPresentationMode && (
				<PresentationView
					slides={presentationSlides}
					title={presentationTitle}
					faqs={presentationFaqs}
					onClose={closePresentationMode}
					classId={classData?.data?.id || ""}
				/>
			)}
		</div>
	);
};

export default CourseDetails;
