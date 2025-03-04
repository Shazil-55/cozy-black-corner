
import React, { useState } from 'react';
import { Module } from '@/hooks/useSyllabusGenerator';
import { BookText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModuleCard from './syllabus/ModuleCard';
import EditDialog from './syllabus/EditDialog';

interface SyllabusPreviewProps {
  modules: Module[];
  onModuleUpdate: (moduleId: string, title: string) => void;
  onLessonUpdate: (moduleId: string, lessonId: string, title: string, description: string) => void;
  onRegenerate: () => void;
}

const SyllabusPreview: React.FC<SyllabusPreviewProps> = ({
  modules,
  onModuleUpdate,
  onLessonUpdate,
  onRegenerate,
}) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(
    // Initialize all modules as expanded
    modules.reduce((acc, module) => ({ ...acc, [module.id]: true }), {})
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'module' | 'lesson'>('module');
  const [editingModule, setEditingModule] = useState<string>('');
  const [editingLesson, setEditingLesson] = useState<string>('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Open module edit dialog
  const openModuleEdit = (moduleId: string, title: string) => {
    setDialogType('module');
    setEditingModule(moduleId);
    setEditTitle(title);
    setDialogOpen(true);
  };

  // Save changes
  const saveChanges = () => {
    if (dialogType === 'module') {
      onModuleUpdate(editingModule, editTitle);
    } else {
      onLessonUpdate(editingModule, editingLesson, editTitle, editDescription);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <div className="bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-talentlms-blue p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookText className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Syllabus Preview</h2>
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
            {modules.map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                expanded={expandedModules[module.id]}
                onToggle={() => toggleModule(module.id)}
                onEdit={openModuleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
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
    </>
  );
};

export default SyllabusPreview;
