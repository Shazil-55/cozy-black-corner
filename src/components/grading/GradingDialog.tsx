
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GradingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (grade: number, feedback: string) => void;
  studentName: string;
  totalMarks: number;
  currentGrade?: number | null;
  currentFeedback?: string;
}

export const GradingDialog: React.FC<GradingDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  studentName,
  totalMarks,
  currentGrade,
  currentFeedback,
}) => {
  const [obtainedMarks, setObtainedMarks] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setObtainedMarks(currentGrade?.toString() || "");
      setFeedback(currentFeedback || "");
    }
  }, [isOpen, currentGrade, currentFeedback]);

  const handleSave = () => {
    const grade = parseFloat(obtainedMarks);
    if (isNaN(grade) || grade < 0 || grade > totalMarks) {
      alert(`Please enter a valid grade between 0 and ${totalMarks}`);
      return;
    }
    onSave(grade, feedback);
    onClose();
  };

  const handleClose = () => {
    setObtainedMarks("");
    setFeedback("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grade Assignment - {studentName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="obtainedMarks">
              Obtained Marks (out of {totalMarks})
            </Label>
            <Input
              id="obtainedMarks"
              type="number"
              min="0"
              max={totalMarks}
              value={obtainedMarks}
              onChange={(e) => setObtainedMarks(e.target.value)}
              placeholder={`Enter marks (0-${totalMarks})`}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter feedback for the student..."
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Grade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
