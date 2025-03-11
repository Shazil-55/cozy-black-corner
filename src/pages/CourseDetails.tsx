
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import { courseService, ModuleData, ClassData } from '@/services/courseService';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/Sidebar';
import ModuleCard from '@/components/syllabus/ModuleCard';
import ClassDetailsPanel from '@/components/syllabus/ClassDetailsPanel';
import EditDialog from '@/components/syllabus/EditDialog';

interface SidebarItem {
  id: string;
  title: string;
  type: 'module' | 'class';
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
  
  // State for module expansion
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  
  // Dialog state for editing
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<string>('');
  const [editTitle, setEditTitle] = useState('');

  // Fetch course details
  const { data, isLoading, error } = useQuery({
    queryKey: ['courseDetails', courseId],
    queryFn: () => courseService.getCourseDetails(courseId || ''),
    enabled: !!courseId,
    meta: {
      onError: () => {
        toast.error('Failed to fetch course details. Please try again later.');
      }
    }
  });

  // Transform API data to match our component props
  const transformedModules = React.useMemo(() => {
    if (!data?.data?.modules) return [];
    
    return data.data.modules.map((module: ModuleData) => ({
      id: module.id,
      title: module.name,
      classes: module.classes.map((classItem: ClassData) => ({
        id: classItem.id,
        title: classItem.title,
        corePoints: classItem.concepts,
        slideCount: 0 // We don't have slides in the API response
      }))
    }));
  }, [data]);

  // Initialize expanded state for modules
  React.useEffect(() => {
    if (transformedModules.length > 0) {
      const initialExpandedState: Record<string, boolean> = {};
      transformedModules.forEach(module => {
        initialExpandedState[module.id] = true; // Default to expanded
      });
      setExpandedModules(initialExpandedState);
    }
  }, [transformedModules]);

  // Transform API data to sidebar items
  const sidebarItems = React.useMemo(() => {
    if (!data?.data?.modules) return [];

    return data.data.modules.map((module: ModuleData) => {
      return {
        id: module.id,
        title: module.name,
        type: 'module' as const,
        expanded: expandedModules[module.id] ?? true,
        children: module.classes.map((classItem: ClassData) => ({
          id: classItem.id,
          title: classItem.title,
          type: 'class' as const,
        }))
      };
    });
  }, [data, expandedModules]);

  const handleClassSelect = (moduleId: string, classId: string) => {
    if (!data?.data?.modules) return;
    
    const module = data.data.modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const classItem = module.classes.find(c => c.id === classId);
    if (!classItem) return;
    
    setSelectedClass({
      moduleId,
      classId,
      title: classItem.title,
      corePoints: classItem.concepts,
    });
  };

  const handleSidebarSelect = (id: string) => {
    // Find if this is a class ID
    for (const module of data?.data?.modules || []) {
      const classItem = module.classes.find(c => c.id === id);
      if (classItem) {
        handleClassSelect(module.id, classItem.id);
        return;
      }
    }
  };

  const clearSelectedClass = () => {
    setSelectedClass(null);
  };

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Open module edit dialog
  const openModuleEdit = (moduleId: string, title: string) => {
    setEditingModule(moduleId);
    setEditTitle(title);
    setDialogOpen(true);
  };

  // Save module title changes
  const saveModuleChanges = () => {
    // In a real application, this would make an API call to update the module
    toast.success(`Module title updated to "${editTitle}"`);
    setDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex">
        <div className="flex-1 p-8 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-talentlms-blue mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course details...</p>
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
            <h1 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Error Loading Course</h1>
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
      {/* Sidebar */}
      <Sidebar 
        items={sidebarItems}
        onSelect={handleSidebarSelect}
        selectedId={selectedClass?.classId}
      />
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
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

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {/* Course Header */}
            <div className="bg-talentlms-blue p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-white" />
                <h2 className="text-xl font-semibold text-white">Course Content</h2>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-4 md:p-6">
              {selectedClass ? (
                <ClassDetailsPanel
                  title={selectedClass.title}
                  corePoints={selectedClass.corePoints}
                  slides={[]} // We don't have slides in the API response
                  onBack={clearSelectedClass}
                />
              ) : (
                transformedModules.map((module) => (
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
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
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
    </div>
  );
};

export default CourseDetails;
