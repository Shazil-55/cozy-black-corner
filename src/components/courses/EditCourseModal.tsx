import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { X, Camera, Image } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { courseService, Category, UpdateCoursePayload } from "@/services/courseService";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onCourseUpdate: () => void;
}

export function EditCourseModal({
  isOpen,
  onClose,
  courseId,
  onCourseUpdate,
}: EditCourseModalProps) {
  // Updated to use string for price
  const [courseData, setCourseData] = useState<UpdateCoursePayload>({
    courseTitle: "",
    description: "",
    price: null,
    categoryId: "",
    isPublished: false,
    image: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Fetch course details
  const { data: courseDetails, isLoading: isLoadingCourse } = useQuery({
    queryKey: ["course-editor-details", courseId],
    queryFn: () => courseService.getCourseEditorDetails(courseId),
    enabled: isOpen && !!courseId
  });

  // Update courseData when courseDetails changes
  useEffect(() => {
    if (courseDetails?.data.course) {
      setCourseData({
        courseTitle: courseDetails.data.course.courseTitle || "",
        description: courseDetails.data.course.description || "",
        // Convert number to string if needed
        price: courseDetails.data.course.price !== null && courseDetails.data.course.price !== undefined 
          ? String(courseDetails.data.course.price) 
          : null,
        categoryId: courseDetails.data.course.categoryId || "",
        isPublished: courseDetails.data.course.isPublished || false,
        image: courseDetails.data.course.image || null,
        courseCode: courseDetails.data.course.courseCode || "",
      });

      // Set image preview if exists
      if (courseDetails.data.course.image) {
        setCoverImagePreview(courseDetails.data.course.image);
        setCoverImageUrl(courseDetails.data.course.image);
      }
    }
  }, [courseDetails]);

  // Fetch categories for dropdown
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => courseService.getCategories(),
    enabled: isOpen,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? null : e.target.value;
    setCourseData((prev) => ({ ...prev, price: value }));
  };

  const handleCategoryChange = (value: string) => {
    setCourseData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleCourseCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setCourseData((prev) => ({ ...prev, courseCode: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG, JPG, or PNG image",
      });
      return;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large", {
        description: "Image must be less than 5MB",
      });
      return;
    }

    try {
      setUploadingImage(true);
      setCoverImage(file);
      const imageUrl = URL.createObjectURL(file);
      setCoverImagePreview(imageUrl);

      // Upload the image to the server
      const response = await courseService.uploadFile(file);
      setCoverImageUrl(response.data.url);
      setCourseData(prev => ({ ...prev, image: response.data.url }));
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image", {
        description: error instanceof Error ? error.message : "An unknown error occurred",
      });
      resetCoverImage();
    } finally {
      setUploadingImage(false);
    }
  };

  const resetCoverImage = () => {
    setCoverImage(null);
    setCoverImageUrl(null);
    setCourseData(prev => ({ ...prev, image: null }));
    if (coverImagePreview) {
      URL.revokeObjectURL(coverImagePreview);
      setCoverImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Using PUT method as specified by the API
      await courseService.updateCourse(courseId, courseData);
      toast.success("Course updated successfully");
      onCourseUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update course", {
        description: "An error occurred while updating the course details"
      });
      console.error("Error updating course:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = isLoadingCourse || isLoadingCategories;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course Details</DialogTitle>
          <DialogDescription>
            Update the information for your course
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Spinner size="lg" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Cover Image Upload - Redesigned to be circular and centered */}
            <div className="flex justify-center items-center w-full mb-6">
              {uploadingImage ? (
                <div className="w-40 h-40 rounded-full flex items-center justify-center bg-slate-100 animate-pulse">
                  <span className="text-sm text-gray-500">Uploading...</span>
                </div>
              ) : coverImagePreview ? (
                <div className="relative">
                  <Avatar className="w-40 h-40 border-4 border-purple-100">
                    <AvatarImage src={coverImagePreview} alt="Course cover" className="object-cover" />
                    <AvatarFallback className="bg-purple-100 text-purple-500">
                      <Image className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                    onClick={resetCoverImage}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="cover-image"
                  className="relative cursor-pointer"
                >
                  <Avatar className="w-40 h-40 border-4 border-dashed border-purple-200 hover:border-purple-300 transition-colors bg-slate-50">
                    <AvatarFallback className="bg-transparent flex flex-col items-center justify-center">
                      <Camera className="w-12 h-12 text-purple-300" />
                      <span className="text-xs text-gray-500 mt-2">Add course image</span>
                    </AvatarFallback>
                  </Avatar>
                  <Input
                    id="cover-image"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </label>
              )}
            </div>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="courseTitle">Course Title</Label>
                <Input
                  id="courseTitle"
                  name="courseTitle"
                  value={courseData.courseTitle}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={courseData.description || ""}
                  onChange={handleInputChange}
                  placeholder="Course description"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={courseData.price === null ? "" : courseData.price}
                  onChange={handlePriceChange}
                  placeholder="Leave empty for free course"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={courseData.categoryId} 
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  name="courseCode"
                  value={courseData.courseCode || ""}
                  onChange={handleCourseCodeChange}
                  className="bg-white"
                />
                <p className="text-xs text-muted-foreground">Enter a unique course code</p>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
