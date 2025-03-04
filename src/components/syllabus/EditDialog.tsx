
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'module' | 'lesson';
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSave: () => void;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onOpenChange,
  type,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === 'module' ? 'Edit Module' : 'Edit Lesson'}
          </DialogTitle>
          <DialogDescription>
            {type === 'module' 
              ? 'Update the module title to better reflect its content.' 
              : 'Edit the lesson title and description.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={type === 'module' ? "Module title" : "Lesson title"}
              className="w-full"
            />
          </div>
          
          {type === 'lesson' && (
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                placeholder="Lesson description"
                rows={4}
                className="w-full"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-talentlms-blue hover:bg-talentlms-darkBlue">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
